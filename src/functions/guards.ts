import type { Fn } from './types'

export function isFunction<T extends Fn>(value: unknown): value is T {
    return typeof value === 'function'
}
