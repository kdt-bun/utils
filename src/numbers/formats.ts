import type { Numberish } from './types'
import { parseExponential, toSubscriptDigits } from './conversions'

export function countLeadingZeros(input: string) {
    let count = 0

    for (let i = 0; i < input.length && input[i] === '0'; i++) {
        count++
    }

    return count
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
    locales?: Intl.LocalesArgument
    groupFractionLeadingZeros?: boolean
    formatLeadingZeros?: (count: number) => string
}

export function formatNumber(input: Numberish, options_: FormatNumberOptions = {}) {
    const { locales = 'en-US', maximumFractionDigits = 4, groupFractionLeadingZeros = true, formatLeadingZeros = (count) => `0${toSubscriptDigits(count)}`, ...options } = options_

    if (!groupFractionLeadingZeros) {
        return new Intl.NumberFormat(locales, { ...options, maximumFractionDigits }).format(input as Intl.StringNumericLiteral)
    }

    const numericStr = parseExponential(input)
    const [, fractionPart = ''] = numericStr.split('.', 2)
    const leadingZerosCount = countLeadingZeros(fractionPart)

    if (leadingZerosCount <= 1) {
        return new Intl.NumberFormat(locales, { ...options, maximumFractionDigits }).format(input as Intl.StringNumericLiteral)
    }

    const parts = new Intl.NumberFormat(locales, { ...options, maximumFractionDigits: maximumFractionDigits + leadingZerosCount }).formatToParts(input as Intl.StringNumericLiteral).map((part) => {
        if (part.type === 'fraction') {
            return `${formatLeadingZeros(leadingZerosCount)}${part.value.slice(leadingZerosCount)}`
        }

        return part.value
    })

    return parts.join('')
}
