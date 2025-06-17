import type { BufferLike } from './types'

export function isBuffer(value: unknown): value is Buffer {
    return Buffer.isBuffer(value)
}

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
    return value instanceof ArrayBuffer
}

export function isSharedArrayBuffer(value: unknown): value is SharedArrayBuffer {
    return value instanceof SharedArrayBuffer
}

export function isArrayBufferView(value: unknown): value is ArrayBufferView {
    return value != null && ArrayBuffer.isView(value)
}

export function isBufferLike(value: unknown): value is BufferLike {
    return isBuffer(value) || isArrayBuffer(value) || isSharedArrayBuffer(value) || isArrayBufferView(value)
}
