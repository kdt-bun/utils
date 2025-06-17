import { combineSignals, createAbortController, createAbortError, type EnsureErrorInput } from '../errors'

export interface DeferredPromiseOptions<T> {
    onResolve?: (value: T | PromiseLike<T>) => void
    onReject?: (reason: unknown) => void
    onSettle?: () => void
    onCallbackError?: (error: unknown) => void
    synchronousCallbacks?: boolean
    signal?: AbortSignal
}

export interface DeferredPromise<T> extends Promise<T> {
    resolve: (value: T | PromiseLike<T>) => void
    reject: (reason?: unknown) => void
    isSettled: boolean
    isPending: boolean
    isResolved: boolean
    isRejected: boolean
}

export function createDeferred<T>({ onResolve, onReject, onSettle, onCallbackError, synchronousCallbacks = false, signal }: DeferredPromiseOptions<T> = {}): DeferredPromise<T> {
    let resolveFn: (value: T | PromiseLike<T>) => void
    let rejectFn: (reason?: unknown) => void
    let abortHandler: () => void

    let isSettled = false
    let isResolved = false
    let isRejected = false

    const promise = <DeferredPromise<T>> new Promise<T>((resolve, reject) => {
        resolveFn = resolve
        rejectFn = reject
    })

    const afterSettle = (cb: () => void) => {
        const callback = () => {
            try {
                cb()
                onSettle?.()
            } catch (error) {
                onCallbackError?.(error)
            }
        }

        if (synchronousCallbacks) {
            callback()
        } else {
            queueMicrotask(callback)
        }
    }

    Object.defineProperty(promise, 'isSettled', { get: () => isSettled, enumerable: true })
    Object.defineProperty(promise, 'isPending', { get: () => !isSettled, enumerable: true })
    Object.defineProperty(promise, 'isResolved', { get: () => isResolved, enumerable: true })
    Object.defineProperty(promise, 'isRejected', { get: () => isRejected, enumerable: true })

    promise.resolve = (value: T | PromiseLike<T>) => {
        if (isSettled) {
            return
        }

        isSettled = true
        isResolved = true

        resolveFn(value)
        afterSettle(() => onResolve?.(value))
    }

    promise.reject = (reason?: unknown) => {
        if (isSettled) {
            return
        }

        isSettled = true
        isRejected = true

        rejectFn(reason)
        afterSettle(() => onReject?.(reason))
    }

    const abort = () => {
        promise.reject(signal?.reason ?? createAbortError())
    }

    const cleanup = () => {
        if (abortHandler) {
            signal?.removeEventListener('abort', abortHandler)
        }
    }

    abortHandler = () => abort()

    if (signal?.aborted) {
        abort()
    } else {
        signal?.addEventListener('abort', abortHandler)
    }

    const originalFinally = promise.finally.bind(promise)

    promise.finally = (onFinally?: () => void) => {
        return originalFinally(() => {
            onFinally?.()
            queueMicrotask(() => cleanup())
        })
    }

    return promise
}

export interface DeferredPromiseWithTimeoutOptions<T> extends DeferredPromiseOptions<T> {
    error?: EnsureErrorInput
}

export function createDeferredWithTimeout<T>(ms: number, { error, signal, ...options }: DeferredPromiseWithTimeoutOptions<T> = {}) {
    return createDeferred<T>({ ...options, signal: combineSignals(signal, createAbortController(ms, error).signal) })
}
