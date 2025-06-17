import type { AnyObject, FilterPredicate, UnknownObject } from './types'
import { isArray, unique } from '../arrays'
import { isPlainObject } from './guards'

export function entries<O extends UnknownObject>(obj: O) {
    return Object.entries(obj) as Array<[keyof O, O[keyof O]]>
}

export function filter<O extends UnknownObject>(obj: O, predicate: FilterPredicate<O, keyof O>) {
    return Object.fromEntries(entries(obj).filter(([key, value], index) => predicate(key, value, index)))
}

export function filterByValue<O extends UnknownObject>(obj: O, predicate: (value: O[keyof O]) => boolean) {
    return filter(obj, (_, value) => predicate(value))
}

export function pick<O extends UnknownObject, K extends keyof O>(obj: O, ...keys: K[]) {
    return filter(obj, (key) => keys.includes(key as K)) as Pick<O, K>
}

export function omit<O extends UnknownObject, K extends keyof O>(object: O, ...keys: K[]) {
    return filter(object, (key) => !keys.includes(key as K)) as Omit<O, K>
}

export function map<K extends PropertyKey, V, NK extends PropertyKey, NV>(obj: Record<K, V>, fn: (k: K, v: V, i: number) => [NK, NV]) {
    return Object.fromEntries(entries(obj).map(([k, v], i) => fn(k, v, i))) as Record<NK, NV>
}

export interface DeepMergeOptions {
    arrayMergeMode?: 'replace' | 'merge' | 'merge-dedupe'
}

export function deepMerge<T extends UnknownObject, U extends UnknownObject>(target: T, source: U, { arrayMergeMode = 'replace' }: DeepMergeOptions = {}): T & U {
    const result: AnyObject = { ...target }

    for (const key of Object.keys(source)) {
        const targetValue = target[key]
        const sourceValue = source[key]

        if (isArray(sourceValue)) {
            if (isArray(targetValue)) {
                if (arrayMergeMode === 'merge') {
                    result[key] = [...targetValue, ...sourceValue]
                } else if (arrayMergeMode === 'merge-dedupe') {
                    result[key] = unique([...targetValue, ...sourceValue])
                } else {
                    result[key] = [...sourceValue]
                }

                continue
            }

            result[key] = [...sourceValue]
        } else if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
            result[key] = deepMerge(targetValue, sourceValue)
        } else {
            result[key] = sourceValue
        }
    }

    return result
}

export function resolveOptions<T>(options: T | true): T {
    if (options === true) {
        return {} as T
    }

    return options
}
