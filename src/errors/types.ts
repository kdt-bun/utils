export interface ErrorLike {
    name: string
    message?: string
    stack?: string
    cause?: unknown
    [key: string]: unknown
}

export type ErrorConstructorLike = new (message?: string, options?: ErrorOptions) => Error
