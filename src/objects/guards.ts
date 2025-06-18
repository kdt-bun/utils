import type { AnyObject, UnknownObject } from './types'
import { isArray } from '../arrays'
import { toString } from '../core'

export function isObject(value: unknown): value is AnyObject {
    return value !== null && typeof value === 'object' && !isArray(value)
}

export function isPlainObject(value: unknown): value is UnknownObject {
    return toString(value) === '[object Object]'
}

export function isEmptyObject(value: AnyObject) {
    return Object.keys(value).length === 0
}

export function isKeyOf<T extends AnyObject>(obj: T, name: PropertyKey): name is keyof T {
    return name in obj
}

export function isKeysOf<T extends PropertyKey>(data: AnyObject, ...keys: T[]): data is Record<T, unknown> {
    return keys.every((key) => isKeyOf(data, key))
}
