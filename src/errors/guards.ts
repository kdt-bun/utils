import type { ErrorLike } from './types'
import { isKeysOf, isObject } from '../objects'
import { isString } from '../strings'

export function isError(value: unknown): value is Error {
    return value instanceof Error
}

export function isAbortError(error: unknown): error is DOMException {
    return error instanceof DOMException && error.name === 'AbortError'
}

export function isErrorLike(value: unknown): value is ErrorLike {
    return isObject(value) && isKeysOf(value, 'name') && isString(value.name)
}
