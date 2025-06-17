import type { Jsonable } from '../types'
import type { SerializeReplacer } from './types'
import { isArray } from '../../arrays'
import { isCollectionLike, isIterable, isMapLike } from '../../collections'
import { isSymbol, typeOf } from '../../core'
import { ensureError, type EnsureErrorInput, type ErrorLike } from '../../errors'
import { isBigInt, isNumber } from '../../numbers'
import { type AnyObject, isPlainObject } from '../../objects'
import { isDate } from '../../times'
import { isJsonablePrimitive } from '../guards'
import { createSymbolKeySerializer } from '../symbols'

export const defaultReplacer: SerializeReplacer = (value) => ({ ...value, __serialized__: true })

export type SerializeErrorStrategy = 'ignore' | 'throw' | 'placeholder'

export interface SerializeErrorOptions {
    strategy?: SerializeErrorStrategy
    placeholder?: Jsonable
    error?: EnsureErrorInput
}

function handleSerializeError({ strategy, placeholder, error }: Required<SerializeErrorOptions>) {
    if (strategy === 'ignore') {
        return
    }

    if (strategy === 'throw') {
        throw ensureError(error)
    }

    return placeholder
}

export interface SerializeOptions {
    replacer?: SerializeReplacer
    getSymbolUniqueId?: (symbol: symbol) => string
    handleObjectSymbolKey?: boolean
    handleNonEnumerableProperty?: boolean
    maxDepth?: number
    maxDepthOptions?: SerializeErrorOptions
    circularReference?: SerializeErrorOptions
    propertyAccessError?: SerializeErrorOptions
    handleIterable?: boolean
    handleError?: boolean
    ignoreUnserializable?: boolean
    unserializableReplacer?: (value: unknown) => Jsonable
    visited?: WeakSet<object>
}

export const DEFAULT_SERIALIZE_OPTIONS: Omit<Required<SerializeOptions>, 'visited' | 'getSymbolUniqueId' | 'unserializableReplacer'> & { maxDepthOptions: Required<SerializeErrorOptions>, circularReference: Required<SerializeErrorOptions>, propertyAccessError: Required<SerializeErrorOptions> } = {
    replacer: defaultReplacer,
    handleObjectSymbolKey: true,
    handleNonEnumerableProperty: true,
    maxDepth: Number.POSITIVE_INFINITY,
    maxDepthOptions: { strategy: 'placeholder', placeholder: { type: 'max-depth', value: '[Max Depth Reached]' }, error: () => new Error('Max depth reached') },
    circularReference: { strategy: 'placeholder', placeholder: { type: 'circular-reference', value: '[Circular Reference]' }, error: () => new Error('Circular reference') },
    propertyAccessError: { strategy: 'placeholder', placeholder: { type: 'property-access-error', value: '[Property Access Error]' }, error: () => new Error('Property access error') },
    handleIterable: true,
    handleError: true,
    ignoreUnserializable: true,
}

export function serialize(value: unknown, options: SerializeOptions = {}): Jsonable {
    const requiredOptions = { ...DEFAULT_SERIALIZE_OPTIONS, ...options, maxDepthOptions: { ...DEFAULT_SERIALIZE_OPTIONS.maxDepthOptions, ...options.maxDepthOptions }, circularReference: { ...DEFAULT_SERIALIZE_OPTIONS.circularReference, ...options.circularReference }, propertyAccessError: { ...DEFAULT_SERIALIZE_OPTIONS.propertyAccessError, ...options.propertyAccessError } }
    const { replacer, getSymbolUniqueId = createSymbolKeySerializer(), maxDepth, maxDepthOptions, circularReference, handleIterable, handleError, ignoreUnserializable, unserializableReplacer, visited = new WeakSet() } = requiredOptions

    if (maxDepth <= 0) {
        return handleSerializeError(maxDepthOptions)
    }

    if (isNumber(value)) {
        if (Number.isNaN(value)) {
            return replacer({ type: 'number', value: 'NaN' })
        }

        if (!Number.isFinite(value)) {
            return replacer({ type: 'number', value: value > 0 ? 'Infinity' : '-Infinity' })
        }

        return value
    }

    if (isJsonablePrimitive(value)) {
        return value
    }

    if (isBigInt(value)) {
        return replacer({ type: 'bigint', value: value.toString() })
    }

    if (isSymbol(value)) {
        return replacer({ type: 'symbol', value: getSymbolUniqueId(value) })
    }

    if (isDate(value)) {
        return replacer({ type: 'date', value: value.toISOString() })
    }

    if (value instanceof RegExp) {
        return replacer({ type: 'regexp', value: value.toString() })
    }

    if (visited.has(value)) {
        return handleSerializeError(circularReference)
    }

    visited.add(value)

    const newOptions = {
        ...requiredOptions, getSymbolUniqueId, visited, maxDepth: maxDepth - 1,
    }

    if (isArray(value)) {
        return Array.from(value, (v) => serialize(v, newOptions))
    }

    if (handleIterable && isIterable(value)) {
        const metadata = value.constructor ? { name: value.constructor.name } : undefined

        if (isCollectionLike(value)) {
            if (isMapLike(value)) {
                return replacer({ type: 'map-like', metadata, value: serialize(Object.fromEntries(value.entries()), newOptions) })
            }

            return replacer({ type: 'set-like', metadata, value: serialize([...value], newOptions) })
        }

        return replacer({ type: 'iterable', metadata, value: serialize([...value], newOptions) })
    }

    if (isPlainObject(value)) {
        return serializeObject(value, newOptions)
    }

    if (handleError && value instanceof Error) {
        return replacer({ type: 'error', value: serializeError(value, newOptions) })
    }

    if (ignoreUnserializable) {
        return
    }

    if (unserializableReplacer) {
        return unserializableReplacer(value)
    }

    throw new Error(`Unserializable value of type: ${typeOf(value)}`)
}

function serializeObject(value: AnyObject, options: typeof DEFAULT_SERIALIZE_OPTIONS & { getSymbolUniqueId: (symbol: symbol) => string }) {
    const { handleObjectSymbolKey, handleNonEnumerableProperty, propertyAccessError, getSymbolUniqueId } = options
    const result: Record<string, Jsonable> = {}

    const getValue = (key: keyof typeof value) => {
        try {
            return value[key]
        } catch (error) {
            return handleSerializeError({ ...propertyAccessError, error: new Error(`Property access error for key: ${String(key)}`, { cause: error }) })
        }
    }

    const keys = handleNonEnumerableProperty ? Object.getOwnPropertyNames(value) : Object.keys(value)

    for (const key of keys) {
        result[key] = serialize(getValue(key), options)
    }

    if (handleObjectSymbolKey) {
        const symbolKeys = Object.getOwnPropertySymbols(value)

        for (const symKey of symbolKeys) {
            result[getSymbolUniqueId(symKey)] = serialize(getValue(symKey), options)
        }
    }

    return result
}

function serializeError(error: Error, options: typeof DEFAULT_SERIALIZE_OPTIONS & { getSymbolUniqueId: (symbol: symbol) => string }) {
    const errorObject: ErrorLike = { name: error.name }

    if (error.message) {
        errorObject.message = error.message
    }

    if (error.stack) {
        errorObject.stack = error.stack
    }

    if (error.cause) {
        errorObject.cause = error.cause
    }

    if (error instanceof AggregateError && error.errors) {
        errorObject.errors = error.errors
    }

    return Object.assign(errorObject, serializeObject(error, options))
}
