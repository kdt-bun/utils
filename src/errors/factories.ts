import type { ErrorConstructorLike, ErrorLike } from './types'
import { notNullish } from '../core'
import { isString } from '../strings'
import { isErrorLike } from './guards'

export type EnsureErrorInput = string | Error | (() => string | Error)

export function ensureError(input: EnsureErrorInput, errorConstructor?: ErrorConstructorLike): Error {
    if (typeof input === 'string') {
        return errorConstructor ? new errorConstructor(input) : new Error(input)
    }

    if (typeof input === 'function') {
        return ensureError(input(), errorConstructor)
    }

    return input
}

export function createAbortError(message = 'This operation was aborted', name = 'AbortError') {
    return new DOMException(message, name)
}

export function createTimeoutError(message = 'The operation was aborted due to a timeout', name = 'TimeoutError') {
    return createAbortError(message, name)
}

export function createAbortController(timeout?: number, timeoutError?: EnsureErrorInput) {
    const controller = new AbortController()

    if (notNullish(timeout) && timeout > 0 && timeout <= Number.MAX_SAFE_INTEGER) {
        let timeoutId: NodeJS.Timeout

        const cleanup = () => {
            clearTimeout(timeoutId)
            controller.signal.removeEventListener('abort', cleanup)
        }

        controller.signal.addEventListener('abort', cleanup)
        timeoutId = setTimeout(() => controller.abort(ensureError(timeoutError ?? createTimeoutError())), timeout)
    }

    return controller
}

export function fromErrorLike({ name, message, stack, cause, ...properties }: ErrorLike, errorConstructor?: ErrorConstructorLike) {
    const errorClass = errorConstructor ?? Error
    const error = new errorClass(message, { cause })

    Object.defineProperty(error, 'name', { value: name, writable: true, enumerable: false, configurable: true })
    Object.defineProperty(error, 'stack', { value: stack, writable: true, enumerable: false, configurable: true })
    Object.defineProperty(error, 'cause', { value: cause, writable: true, enumerable: false, configurable: true })

    for (const [key, value] of Object.entries(properties)) {
        Object.defineProperty(error, key, Object.getOwnPropertyDescriptor(properties, key) ?? { value, writable: true, enumerable: true, configurable: true })
    }

    return error
}

export interface NormalizeErrorOptions {
    defaultMessage?: string
    errorConstructor?: ErrorConstructorLike
}

export function normalizeError(error: unknown, { errorConstructor, defaultMessage = 'Unknown error' }: NormalizeErrorOptions = {}): Error {
    const errorClass = errorConstructor ?? Error

    if (error instanceof errorClass) {
        return error
    }

    if (isString(error)) {
        return ensureError(error, errorConstructor)
    }

    if (isErrorLike(error)) {
        return fromErrorLike(error, errorConstructor)
    }

    return new errorClass(defaultMessage, { cause: error })
}
