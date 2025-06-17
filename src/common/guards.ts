import { isArray, isEmptyArray } from '../arrays'
import { isCollectionLike, isEmptyCollection, isIterable } from '../collections'
import { isBoolean, isNullish, isSymbol, type Primitive } from '../core'
import { ensureError, type EnsureErrorInput, type ErrorConstructorLike } from '../errors'
import { isBigInt, isNumber } from '../numbers'
import { isEmptyObject, isPlainObject } from '../objects'
import { isEmptyString, isString } from '../strings'

export function isPrimitive(value: unknown): value is Primitive {
    return isString(value) || isNumber(value) || isBoolean(value) || isNullish(value) || isSymbol(value) || isBigInt(value)
}

export function isJsonablePrimitive(value: unknown): value is Exclude<Primitive, bigint | symbol> {
    return isString(value) || isNumber(value) || isBoolean(value) || isNullish(value)
}

export function isTrueLike(value: unknown, trueLikeValues = ['true', 't', 'yes', 'y', 'on', '1']) {
    if (value === true || value === 1 || value === 1n) {
        return true
    }

    if (isString(value)) {
        return trueLikeValues.includes(value.trim().toLowerCase())
    }

    return false
}

export function isEmpty(value: unknown) {
    if (isNullish(value)) {
        return true
    }

    if (isArray(value)) {
        return isEmptyArray(value)
    }

    if (isPrimitive(value)) {
        if (isString(value)) {
            return isEmptyString(value)
        }

        return false
    }

    if (isPlainObject(value)) {
        return isEmptyObject(value)
    }

    if (isIterable(value) && isCollectionLike(value)) {
        return isEmptyCollection(value)
    }

    return false
}

export function assert(condition: unknown, message: EnsureErrorInput, errorConstructor?: ErrorConstructorLike): asserts condition {
    if (!condition) {
        throw ensureError(message, errorConstructor)
    }
}

export function assertParam(condition: unknown, message: EnsureErrorInput, errorConstructor?: ErrorConstructorLike): asserts condition {
    assert(condition, message, errorConstructor ?? TypeError)
}
