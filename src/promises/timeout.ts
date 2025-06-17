import { createAbortController, type EnsureErrorInput } from '../errors'
import { abortable } from './abortable'

export function withTimeout<T>(promise: Promise<T>, ms: number, error?: EnsureErrorInput) {
    return abortable(promise, createAbortController(ms, error).signal)
}
