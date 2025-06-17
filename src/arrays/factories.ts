import type { EmptyArray, NonEmptyArray } from './types'

export function createArray<T, TStrict extends boolean = true, TLength extends number = number>(length: TLength, value: (index: number) => T) {
    return Array.from({ length }, (_, i) => value(i)) as TStrict extends false ? T[] : (TLength extends 0 ? EmptyArray : NonEmptyArray<T>)
}

export function range(from: number, to: number, step = 1) {
    return Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + (i * step))
}

export function sample<T>(array: T[], quantity = 1) {
    return Array.from({ length: quantity }, () => array[Math.round(Math.random() * (array.length - 1))])
}
