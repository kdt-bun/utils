import type { JsonRpcErrorObject, JsonRpcErrorResponseMessage, JsonRpcMessage, JsonRpcNotifyMessage, JsonRpcRequestMessage, JsonRpcResponseId, JsonRpcResponseMessage, JsonRpcResponseMessageWithNonNullId } from './types'
import { isNull, notNullish } from '../core'
import { isNumber } from '../numbers'
import { isKeysOf, isObject } from '../objects'
import { isString } from '../strings'

export function isJsonRpcMessage<TParams = any, TResult = any, TErrorData = any>(message: unknown): message is JsonRpcMessage<TParams, TResult, TErrorData> {
    return isObject(message) && message.jsonrpc === '2.0'
}

export function isValidJsonRpcId(id: any): id is JsonRpcResponseId {
    return isString(id) || isNumber(id) || isNull(id)
}

export function isJsonRpcRequestMessage<TParams = any>(message: JsonRpcMessage): message is JsonRpcRequestMessage<TParams> {
    return isKeysOf(message, 'id', 'method') && isValidJsonRpcId(message.id) && isString(message.method)
}

export function isJsonRpcNotifyMessage<TParams = any>(message: JsonRpcMessage): message is JsonRpcNotifyMessage<TParams> {
    return isKeysOf(message, 'method') && isString(message.method) && !isKeysOf(message, 'id')
}

export function isJsonRpcResponseMessage<TResult = any, TErrorData = any>(message: JsonRpcMessage): message is JsonRpcResponseMessage<TResult, TErrorData> {
    return isKeysOf(message, 'id') && isValidJsonRpcId(message.id)
}

export function isJsonRpcError<TData = any>(message: unknown): message is JsonRpcErrorObject<TData> {
    return isObject(message) && isKeysOf(message, 'code', 'message')
}

export function isJsonRpcErrorResponseMessage<TData = any>(message: JsonRpcMessage): message is JsonRpcErrorResponseMessage<TData> {
    return isKeysOf(message, 'error') && isJsonRpcError(message.error)
}

export function isJsonRpcResponseHasNonNullableId<TResult = any, TErrorData = any>(response: JsonRpcResponseMessage): response is JsonRpcResponseMessageWithNonNullId<TResult, TErrorData> {
    return notNullish(response.id)
}
