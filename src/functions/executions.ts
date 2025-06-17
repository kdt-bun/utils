import type { Nullable } from '../core'
import type { Fn } from './types'

export function noop() {
    return void 0
}

export function invoke<T>(fn: () => T) {
    return fn()
}

export function invokes(functions: Array<Nullable<Fn>>) {
    for (const fn of functions) {
        fn?.()
    }
}
