import { notNullish } from '../core'
import { normalizeError, type NormalizeErrorOptions } from './factories'

export interface StringifyErrorFormatters {
    code?: (code: string) => string
    name?: (name: string) => string
    message?: (message: string) => string
}

export interface StringifyErrorOptions extends NormalizeErrorOptions {
    includeName?: boolean
    includeCode?: boolean
    includeCause?: boolean
    maxCauseDepth?: number
    causeIndent?: number
    causePrefix?: string
    circularReferenceMessage?: string
    formatters?: StringifyErrorFormatters
}

export const DEFAULT_STRINGIFY_FORMATTERS: Required<StringifyErrorFormatters> = {
    code: (value) => `[${value}]`,
    name: (value) => `${value}:`,
    message: (value) => value,
}

export function stringifyError(error: unknown, { includeName = true, includeCode = true, includeCause = true, maxCauseDepth = Number.POSITIVE_INFINITY, defaultMessage = 'Unknown error', causeIndent = 2, causePrefix = '-> ', formatters: formatters_ = {}, circularReferenceMessage = '[Circular Reference]', ...normalizeOptions }: StringifyErrorOptions = {}): string {
    const visited = new Set<unknown>()
    const formatters = { ...DEFAULT_STRINGIFY_FORMATTERS, ...formatters_ }

    const stringify = (error_: unknown, depth = maxCauseDepth, indent = '', prefix = '') => {
        if (visited.has(error_)) {
            return `${indent}${prefix}${circularReferenceMessage}`
        }

        visited.add(error_)

        if (error_ instanceof Error && 'toString' in error_ && error_.toString !== Error.prototype.toString) {
            return error_.toString()
        }

        const error = normalizeError(error_, { ...normalizeOptions, defaultMessage })
        const parts: string[] = []

        if (includeCode && 'code' in error && notNullish(error.code)) {
            parts.push(formatters.code(String(error.code)))
        }

        if (includeName) {
            parts.push(formatters.name(error.name))
        }

        parts.push(formatters.message(error.message || defaultMessage))

        if (includeCause && depth > 0) {
            const childIndent = indent + ' '.repeat(causeIndent)
            const pointers: string[] = []

            if (error instanceof AggregateError && error.errors.length > 0) {
                const childDepth = depth - 1

                for (const subError of error.errors) {
                    pointers.push(stringify(subError, childDepth, childIndent, causePrefix))
                }
            }

            if (error.cause) {
                pointers.push(stringify(error.cause, depth - 1, childIndent, causePrefix))
            }

            if (pointers.length > 0) {
                parts.push(`\n${pointers.join('\n')}`)
            }
        }

        return indent + prefix + parts.join(' ')
    }

    return stringify(error)
}
