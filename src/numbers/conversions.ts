import type { Numberish } from './types'

export const SUBSCRIPT_CHARS: Record<string, string> = {
    0: '\u2080',
    1: '\u2081',
    2: '\u2082',
    3: '\u2083',
    4: '\u2084',
    5: '\u2085',
    6: '\u2086',
    7: '\u2087',
    8: '\u2088',
    9: '\u2089',
}

export function toSubscriptDigits(input: Numberish) {
    let result = ''

    for (const char of input.toString()) {
        result += SUBSCRIPT_CHARS[char] ?? char
    }

    return result
}

export function parseExponential(input: Numberish) {
    const str = input.toString().toLowerCase()

    if (!str.includes('e')) {
        return str
    }

    const [mantissa, rawExp] = str.split('e')
    const [intPart, fracPart = ''] = mantissa.split('.')

    const exp = Number(rawExp)

    if (exp >= 0) {
        const neededZeros = Math.max(0, exp - fracPart.length)
        const padded = fracPart + '0'.repeat(neededZeros)

        if (padded.length > exp) {
            return `${intPart + padded.slice(0, exp)}.${padded.slice(exp)}`
        }

        return intPart + padded
    }

    return `0.${'0'.repeat(Math.max(0, -exp - intPart.length))}${intPart}${fracPart}`
}
