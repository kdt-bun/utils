import type { Awaitable } from './types'
import { isAbortError } from '../errors'
import { clamp } from '../numbers'
import { abortable } from './abortable'
import { sleep } from './sleep'

export interface GetRetryDelayOptions {
    delay?: number
    backoff?: number
    jitter?: number
    maxDelay?: number
}

export function getRetryDelay(attempts: number, { delay = 1000, backoff = 2, jitter = 0.01, maxDelay = 10_000 }: GetRetryDelayOptions = {}) {
    const exponentialDelay = delay * backoff ** (attempts - 1)
    const clampedDelay = clamp(exponentialDelay, 0, maxDelay)

    if (jitter <= 0) {
        return clampedDelay
    }

    const jitterRange = clampedDelay * jitter
    const jitterOffset = (Math.random() - 0.5) * 2 * jitterRange

    return clamp(clampedDelay + jitterOffset, 0, maxDelay)
}

export interface WithRetryContext {
    attempts: number
    retriesLeft: number
    signal?: AbortSignal
}

export interface WithRetryOptions<T> extends GetRetryDelayOptions {
    maxAttempts?: number
    shouldRetry?: (error: unknown, context: WithRetryContext) => Awaitable<boolean>
    shouldRetryOnSuccess?: (result: T, context: WithRetryContext) => Awaitable<boolean>
    onFailedAttempt?: (error: unknown, context: WithRetryContext) => Awaitable<void>
    onSuccessAttempt?: (response: T, context: WithRetryContext) => Awaitable<void>
    onBeforeWaitForNextAttempt?: (delay: number, context: WithRetryContext) => Awaitable<void>
    signal?: AbortSignal
}

export async function withRetry<T>(fn: (signal?: AbortSignal) => Awaitable<T>, { maxAttempts = 3, shouldRetry, shouldRetryOnSuccess, onFailedAttempt, onSuccessAttempt, onBeforeWaitForNextAttempt, signal, ...delayOptions }: WithRetryOptions<T> = {}): Promise<T> {
    if (signal) {
        signal.throwIfAborted()
    }

    let attempts = 0
    let result: T

    const errors = new Set<unknown>()
    const createError = () => (errors.size === 1 ? [...errors][0] : new AggregateError(errors, 'All retry attempts failed'))

    const waitForNextAttempt = async (context: WithRetryContext) => {
        const delay = getRetryDelay(attempts, delayOptions)

        await onBeforeWaitForNextAttempt?.(delay, context)
        await sleep(delay, signal).catch(() => {})
    }

    while (attempts < maxAttempts) {
        const retriesLeft = maxAttempts - ((attempts++) + 1)
        const context = { attempts, retriesLeft, signal }

        try {
            if (signal) {
                signal.throwIfAborted()
            }

            result = await abortable(Promise.resolve(fn(signal)), signal)
        } catch (error) {
            if (isAbortError(error)) {
                throw error
            }

            errors.add(error)

            if (retriesLeft <= 0) {
                throw createError()
            }

            if (shouldRetry && !(await shouldRetry(error, context))) {
                throw createError()
            }

            await waitForNextAttempt(context)
            await onFailedAttempt?.(error, context)

            continue
        }

        if (retriesLeft <= 0) {
            return result
        }

        if (shouldRetryOnSuccess && await shouldRetryOnSuccess(result, context)) {
            await waitForNextAttempt(context)
            await onSuccessAttempt?.(result, context)
        } else {
            return result
        }
    }

    throw createError()
}
