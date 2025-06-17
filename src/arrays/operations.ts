import type { Nullable } from '../core'
import type { Arrayable } from './types'
import { toArray } from './conversions'

export function merge<T>(...arrays: Array<Nullable<Arrayable<T>>>) {
    return arrays.flatMap((array) => toArray(array))
}

export function flatten<T>(array?: Nullable<Arrayable<T | T[]>>) {
    return toArray(array).flat() as T[]
}

export function unique<T>(array: T[]) {
    return [...new Set(array)]
}

export function uniqueBy<T>(array: T[], equalFn: (a: T, b: T) => boolean) {
    return array.reduce<T[]>((r, c) => (r.some((v) => equalFn(v, c)) ? r : [...r, c]), [])
}

export function intersection<T>(a: T[], b: T[]) {
    return a.filter((v) => b.includes(v))
}

export function diff<T>(a: T[], b: T[]) {
    return a.filter((v) => !b.includes(v))
}

export function symmetricDiff<T>(a: T[], b: T[]) {
    return [...diff(a, b), ...diff(b, a)]
}

export function shuffle<T>(array: T[]): T[] {
    const result = [...array]

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = result[i]

        result[i] = result[j]!
        result[j] = temp
    }

    return result
}
