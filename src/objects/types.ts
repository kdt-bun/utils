export type AnyObject = Record<PropertyKey, any>

export type UnknownObject = Record<PropertyKey, unknown>

export type Constructor<T> = new (...args: any[]) => T

export type ClassMethods<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T]

export type ClassMethodArgs<T, M extends ClassMethods<T>> = T[M] extends (...args: infer A) => any ? A : never

export type ClassMethodReturn<T, M extends ClassMethods<T>> = T[M] extends (...args: any[]) => infer R ? R : never

export type FilterPredicate<O, K extends keyof O> = (key: K, value: O[K], index: number) => boolean
