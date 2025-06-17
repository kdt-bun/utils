import type { EmptyArray, NonEmptyArray } from './types'

export function isArray<T = any>(value: unknown): value is T[] {
    return Array.isArray(value)
}

export function isEmptyArray<T = any, TStrict extends boolean = true>(value: T[]): value is (TStrict extends true ? EmptyArray : T[]) {
    return value.length === 0
}

export function isNonEmptyArray<T = any, TStrict extends boolean = true>(value: T[]): value is (TStrict extends true ? NonEmptyArray<T> : T[]) {
    return !isEmptyArray(value)
}
