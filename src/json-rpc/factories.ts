import type { JsonRpcErrorObject, JsonRpcErrorResponseMessage, JsonRpcNotifyMessage, JsonRpcRequestMessage, JsonRpcResponseId, JsonRpcSuccessResponseMessage } from './types'
import { notUndefined } from '../core'

export function createNotifyMessage<TParams>(method: string, params?: TParams): JsonRpcNotifyMessage<TParams> {
    return { jsonrpc: '2.0', method, ...(notUndefined(params) ? { params } : {}) }
}

export function createRequestMessage<TParams>(id: string | number, method: string, params?: TParams): JsonRpcRequestMessage<TParams> {
    return { jsonrpc: '2.0', id, method, ...(notUndefined(params) ? { params } : {}) }
}

export function createSuccessResponseMessage<R = any>(id: JsonRpcResponseId, result: R): JsonRpcSuccessResponseMessage<R> {
    return { jsonrpc: '2.0', id, result }
}

export function createErrorResponseMessage<TData>(id: JsonRpcResponseId, error: JsonRpcErrorObject<TData>): JsonRpcErrorResponseMessage<TData> {
    return { jsonrpc: '2.0', id, error }
}
