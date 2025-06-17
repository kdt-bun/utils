import { notNullish } from '../core'

export type ErrorCode = string | number | symbol

export interface ErrorOptions extends globalThis.ErrorOptions {
    name?: string
    code?: ErrorCode
    details?: string
    exitCode?: number
    retryable?: boolean
}

export class BaseError extends Error {
    public readonly timestamp: Date

    public declare readonly code?: ErrorCode
    public declare readonly details?: string
    public declare readonly exitCode?: number
    public declare readonly retryable?: boolean

    public constructor(message?: string, { name, code, details, exitCode, retryable, ...options }: ErrorOptions = {}) {
        super(message, options)

        this.name = name ?? this.constructor.name
        this.timestamp = new Date()

        this.withValue('code', code)
        this.withValue('details', details)
        this.withValue('exitCode', exitCode)
        this.withValue('retryable', retryable)

        Object.setPrototypeOf(this, new.target.prototype)

        if (notNullish(Error.captureStackTrace)) {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    public withValue<T>(key: string, value?: T): this {
        if (value !== undefined) {
            Object.defineProperty(this, key, { value, writable: false, enumerable: true, configurable: false })
        }

        return this
    }
}
