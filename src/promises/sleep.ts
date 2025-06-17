import { createAbortError } from '../errors'

export function sleep(ms: number, signal?: AbortSignal) {
    const createError = () => (signal?.reason ?? createAbortError())

    if (signal?.aborted) {
        return Promise.reject(createError())
    }

    return new Promise<void>((resolve, reject) => {
        let timeoutId: NodeJS.Timeout | number
        let onAbort: () => void

        const cleanup = () => {
            clearTimeout(timeoutId)
            signal?.removeEventListener('abort', onAbort)
        }

        onAbort = () => {
            cleanup()
            reject(createError())
        }

        signal?.addEventListener('abort', onAbort)

        const onTimeout = () => {
            cleanup()
            resolve()
        }

        timeoutId = setTimeout(onTimeout, ms)
    })
}
