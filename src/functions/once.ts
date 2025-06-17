import type { Args, Fn } from './types'

export function once<T extends Fn>(fn: T) {
    let called = false
    let result: ReturnType<T>
    let error: unknown | undefined

    const cb = (...args: Args<T>): ReturnType<T> => {
        if (called) {
            if (error) {
                throw error
            }

            return result
        }

        called = true

        try {
            return (result = fn(...args))
        } catch (error_) {
            error = error_
            throw error_
        }
    }

    cb.reset = () => {
        called = false
        error = undefined
    }

    return cb
}
