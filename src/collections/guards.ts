import type { CollectionLike, MapLike, SetLike } from './types'
import { isObject } from '../objects'

export function isIterable<T>(value: unknown): value is Iterable<T> {
    return isObject(value) && Symbol.iterator in value && typeof value[Symbol.iterator] === 'function'
}

export function isCollectionLike<T>(value: Iterable<unknown>): value is CollectionLike<T> {
    return 'size' in value && typeof value.size === 'number'
}

export function isEmptyCollection(value: CollectionLike) {
    return value.size === 0
}

export function isSetLike<T>(value: CollectionLike): value is SetLike<T> {
    return 'has' in value && typeof value.has === 'function'
}

export function isMapLike<K, V>(value: CollectionLike): value is MapLike<K, V> {
    return 'get' in value && typeof value.get === 'function' && 'entries' in value && typeof value.entries === 'function'
}
