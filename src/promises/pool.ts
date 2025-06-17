import type { Awaitable } from './types'
import { assertParam } from '../common'
import { createAbortController, isAbortError } from '../errors'
import { isFunction } from '../functions'
import { isPlainObject } from '../objects'
import { abortable } from './abortable'
import { sleep } from './sleep'

export interface PoolOptions {
    delay?: number
    immediately?: boolean
    onError?: (error: unknown) => void
    stopOnError?: boolean
}

export type PoolFn = (signal: AbortSignal) => Awaitable<void>

export function pool(fn: PoolFn, options?: PoolOptions): () => void

export function pool(options: PoolOptions, fn: PoolFn): () => void

export function pool(fnOrOptions: PoolOptions | PoolFn, optionsOrFn: PoolOptions | PoolFn = {}) {
    let fn: PoolFn
    let options: PoolOptions

    if (isFunction(fnOrOptions) && isPlainObject(optionsOrFn)) {
        fn = fnOrOptions
        options = optionsOrFn
    } else {
        assertParam(isPlainObject(fnOrOptions), 'options must be an object')
        assertParam(isFunction(optionsOrFn), 'fn must be a function')

        fn = optionsOrFn
        options = fnOrOptions
    }

    const { delay = 0, immediately = true, onError, stopOnError = true } = options
    const abortController = createAbortController()

    let isActive = true

    const stop = () => {
        isActive = false
        abortController.abort()
    }

    const run = async () => {
        if (!isActive) {
            return
        }

        try {
            await abortable(Promise.resolve(fn(abortController.signal)), abortController.signal)

            if (isActive) {
                await sleep(delay, abortController.signal)
            }
        } catch (error) {
            if (isAbortError(error) && !isActive) {
                return
            }

            onError?.(error)

            if (stopOnError) {
                return stop()
            }
        }

        setTimeout(run, 0)
    }

    if (immediately) {
        Promise.resolve().then(run)
    } else {
        setTimeout(run, delay)
    }

    return stop
}
