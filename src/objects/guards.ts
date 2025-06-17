import type { UnknownObject } from './types'
import { isArray } from '../arrays'
import { toString } from '../core'

export function isObject(value: unknown): value is UnknownObject {
    return value !== null && typeof value === 'object' && !isArray(value)
}

export function isPlainObject(value: unknown): value is UnknownObject {
    return toString(value) === '[object Object]'
}

export function isEmptyObject(value: UnknownObject) {
    return Object.keys(value).length === 0
}

export function isKeyOf<T extends UnknownObject>(obj: T, name: PropertyKey): name is keyof T {
    return name in obj
}

export function isKeysOf<T extends PropertyKey>(data: UnknownObject, ...keys: T[]): data is Record<T, unknown> {
    return keys.every((key) => isKeyOf(data, key))
}
