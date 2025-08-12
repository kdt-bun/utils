export interface BaseJsonRpcMessage {
    jsonrpc: '2.0'
}

export interface JsonRpcRequestMessage<TParams = any> extends BaseJsonRpcMessage {
    id: string | number
    method: string
    params?: TParams
}

export interface JsonRpcNotifyMessage<TParams = any> extends BaseJsonRpcMessage {
    method: string
    params?: TParams
}

export interface JsonRpcErrorObject<TData = any> {
    code: number
    message: string
    data?: TData
}

export type JsonRpcResponseId = string | number | null

export interface BaseJsonRpcResponseMessage extends BaseJsonRpcMessage {
    id: JsonRpcResponseId
}

export interface JsonRpcSuccessResponseMessage<R = any> extends BaseJsonRpcResponseMessage {
    result: R
}

export interface JsonRpcErrorResponseMessage<TData = any> extends BaseJsonRpcResponseMessage {
    error: JsonRpcErrorObject<TData>
}

export type JsonRpcResponseMessage<R = any, TErrorData = any> = JsonRpcSuccessResponseMessage<R> | JsonRpcErrorResponseMessage<TErrorData>

export type JsonRpcResponseMessageWithNonNullId<R = any, TErrorData = any> = (Omit<JsonRpcSuccessResponseMessage<R>, 'id'> | Omit<JsonRpcErrorResponseMessage<TErrorData>, 'id'>) & {
    id: NonNullable<JsonRpcResponseId>
}

export type JsonRpcMessage<TParams = any, TResult = any, TErrorData = any> = JsonRpcRequestMessage<TParams> | JsonRpcNotifyMessage<TParams> | JsonRpcResponseMessage<TResult, TErrorData>
