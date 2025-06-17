import type { Primitive } from '../core'

export type Jsonable = Exclude<Primitive, bigint | symbol> | Jsonable[] | { [key: string]: Jsonable }
