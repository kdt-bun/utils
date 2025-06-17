import type { Awaitable } from './types'
import { isFunction } from '../functions'

export async function tryCatchAsync<T>(fn: () => Awaitable<T>, fallback: Awaitable<T> | ((error: unknown) => Awaitable<T>)) {
    try {
        return await fn()
    } catch (error) {
        return isFunction(fallback) ? await fallback(error) : await fallback
    }
}
