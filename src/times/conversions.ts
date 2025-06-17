import { isBoolean } from '../core'
import { BigIntMath, isSpecialNumberString, type Numberish } from '../numbers'
import { isString, padZeroStart } from '../strings'

export function toDate(input: Date | number | string) {
    return new Date(input)
}

export function toUnixTimestamp(date: Date) {
    return Math.floor(date.getTime() / 1000)
}

export function formatDate(date: Date, format: string | boolean = true) {
    if (isBoolean(format)) {
        format = format ? 'HH:mm:ss.SSS dd/MM/yyyy' : 'HH:mm:ss dd/MM/yyyy'
    }

    const tokens = {
        'HH': padZeroStart(date.getHours(), 2),
        'mm': padZeroStart(date.getMinutes(), 2),
        'ss': padZeroStart(date.getSeconds(), 2),
        'SSS': padZeroStart(date.getMilliseconds(), 3),
        'dd': padZeroStart(date.getDate(), 2),
        'MM': padZeroStart(date.getMonth() + 1, 2),
        'yyyy': date.getFullYear().toString(),
    }

    return format.replaceAll(/HH|mm|ss|SSS|dd|MM|yyyy/g, (match) => tokens[match])
}

export function humanizeNanoseconds(ns: Numberish) {
    if (isString(ns) && isSpecialNumberString(ns)) {
        return ns
    }

    let remaining: bigint

    try {
        remaining = BigInt(ns)
    } catch {
        return ns.toString()
    }

    if (remaining === 0n) {
        return '0ns'
    }

    const units: Array<[label: string, value: bigint]> = [
        ['h', 3_600_000_000_000n],
        ['m', 60_000_000_000n],
        ['s', 1_000_000_000n],
        ['ms', 1_000_000n],
        ['μs', 1000n],
        ['ns', 1n],
    ]

    const sign = remaining < 0n ? '-' : ''
    const parts: string[] = []

    remaining = BigIntMath.abs(remaining)

    for (const [label, value] of units) {
        if (remaining >= value) {
            parts.push(`${remaining / value}${label}`)
            remaining %= value
        }
    }

    return sign + parts.join(' ')
}

export function humanizeMilliseconds(ms: Numberish) {
    return humanizeNanoseconds(BigInt(ms) * 1_000_000n)
}
