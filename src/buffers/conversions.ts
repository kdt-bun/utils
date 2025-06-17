import type { BufferLike } from './types'
import { isArrayBuffer, isArrayBufferView, isBuffer, isSharedArrayBuffer } from './guards'

export function bufferToString(buffer: BufferLike, encoding: BufferEncoding = 'utf-8') {
    if (isBuffer(buffer)) {
        return buffer.toString(encoding)
    }

    const decoder = new TextDecoder(encoding)

    if (isArrayBuffer(buffer) || isSharedArrayBuffer(buffer)) {
        return decoder.decode(new Uint8Array(buffer))
    }

    if (isArrayBufferView(buffer)) {
        return decoder.decode(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength))
    }

    throw new Error('Invalid buffer')
}
