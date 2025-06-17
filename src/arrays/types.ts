export type Arrayable<T> = T | T[] | Iterable<T>

export type EmptyArray = []

export type NonEmptyArray<T> = [T, ...T[]]

export type ElementOf<T> = T extends Array<infer E> ? E : never
