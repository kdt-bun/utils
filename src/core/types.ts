export type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type Nullish<T> = T | null | undefined

export type IsContainsType<T, U> = Extract<T, U> extends never ? false : true
