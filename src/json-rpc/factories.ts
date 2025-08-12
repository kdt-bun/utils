import type { JsonRpcErrorObject, JsonRpcErrorResponseMessage, JsonRpcNotifyMessage, JsonRpcRequestMessage, JsonRpcResponseId, JsonRpcSuccessResponseMessage } from './types'
import { notUndefined } from '../core'

export function createJsonRpcNotifyMessage<TParams>(method: string, params?: TParams): JsonRpcNotifyMessage<TParams> {
    return { jsonrpc: '2.0', method, ...(notUndefined(params) ? { params } : {}) }
}

export function createJsonRpcRequestMessage<TParams>(id: string | number, method: string, params?: TParams): JsonRpcRequestMessage<TParams> {
    return { jsonrpc: '2.0', id, method, ...(notUndefined(params) ? { params } : {}) }
}

export function createJsonRpcSuccessResponseMessage<R = any>(id: JsonRpcResponseId, result: R): JsonRpcSuccessResponseMessage<R> {
    return { jsonrpc: '2.0', id, result }
}

export function createJsonRpcErrorResponseMessage<TData>(id: JsonRpcResponseId, error: JsonRpcErrorObject<TData>): JsonRpcErrorResponseMessage<TData> {
    return { jsonrpc: '2.0', id, error }
}
