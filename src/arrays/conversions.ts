import type { Arrayable } from './types'
import { isIterable } from '../collections'
import { notNullish, type Nullable } from '../core'
import { isArray } from './guards'

export function wrap<T>(array: T | T[]) {
    return isArray(array) ? array : [array]
}

export function toArray<T>(value?: Nullable<Arrayable<T>>) {
    if (isIterable(value)) {
        return [...value]
    }

    return wrap(value ?? [])
}

export function compact<T>(array: Array<Nullable<T>>): T[] {
    return array.filter(notNullish)
}
