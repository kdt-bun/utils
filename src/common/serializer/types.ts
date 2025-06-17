import type { Jsonable } from '../types'

export interface SerializedValue {
    type: string
    value: Jsonable
    metadata?: Record<string, Jsonable>
}

export type SerializeReplacer = (value: SerializedValue) => Jsonable
