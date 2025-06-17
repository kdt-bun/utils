import { isFunction } from '../functions'
import { isObject } from '../objects'

export function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
    return isObject(value) && isFunction(value.then)
}

export function isPromise<T>(value: unknown): value is Promise<T> {
    return isObject(value) && isFunction(value.then) && isFunction(value.catch)
}
