import type { Numberish, NumberString } from './types'
import { isString } from '../strings'

export function isNumber(value: unknown): value is number {
    return typeof value === 'number'
}

export function isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
}

export function isSpecialNumberString(value: string) {
    return ['NaN', '-NaN', '+NaN', 'Infinity', '-Infinity', '+Infinity'].includes(value)
}

export function isNumberString<TStrict extends boolean = true>(value: string): value is (TStrict extends true ? NumberString : string) {
    if (isSpecialNumberString(value)) {
        return true
    }

    return !Number.isNaN(Number(value))
}

export function isNumberish(input: unknown): input is Numberish {
    return isNumber(input) || isBigInt(input) || (isString(input) && isNumberString(input))
}
