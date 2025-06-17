import type { Numberish } from '../numbers'
import { WHITESPACE_CHARACTERS } from './constants'
import { hasPrefix, hasSuffix } from './guards'

export function ensurePrefix(str: string, prefix: string) {
    return hasPrefix(str, prefix) ? str : prefix + str
}

export function ensureSuffix(str: string, suffix: string) {
    return hasSuffix(str, suffix) ? str : str + suffix
}

export function stripPrefix(str: string, prefix: string) {
    return hasPrefix(str, prefix) ? str.slice(prefix.length) : str
}

export function stripSuffix(str: string, suffix: string) {
    return hasSuffix(str, suffix) ? str.slice(0, -suffix.length) : str
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function escapeRegExp(input: string) {
    return input.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`).replaceAll('-', String.raw`\x2d`)
}

export function * chunkStr(str: string, size: number) {
    const len = str.length

    for (let i = 0; i < len; i += size) {
        yield str.slice(i, i + size)
    }
}

export function truncate(str: string, maxLength: number, omission = '...') {
    if (str.length <= maxLength) {
        return str
    }

    if (omission.length >= maxLength) {
        return omission.slice(0, maxLength)
    }

    return str.slice(0, maxLength - omission.length) + omission
}

export function truncateMiddle(str: string, maxLength: number, omission = '...') {
    if (str.length <= maxLength) {
        return str
    }

    if (omission.length >= maxLength) {
        return omission.slice(0, maxLength)
    }

    const left = Math.floor((maxLength - omission.length) / 2)
    const right = maxLength - omission.length - left

    return str.slice(0, left) + omission + str.slice(-right)
}

export function ltrim(str: string, characters: string | Set<string> = WHITESPACE_CHARACTERS) {
    const end = str.length

    if (typeof characters === 'string') {
        characters = new Set(characters)
    }

    let start = 0

    while (start < end && characters.has(str[start])) {
        ++start
    }

    return start > 0 ? str.slice(start, end) : str
}

export function rtrim(str: string, characters: string | Set<string> = WHITESPACE_CHARACTERS) {
    if (typeof characters === 'string') {
        characters = new Set(characters)
    }

    let end = str.length

    while (end > 0 && characters.has(str[end - 1])) {
        --end
    }

    return end < str.length ? str.slice(0, Math.max(0, end)) : str
}

export function trim(str: string, characters: string | Set<string> = WHITESPACE_CHARACTERS) {
    return ltrim(rtrim(str, characters), characters)
}

export function trimRepeated(input: string, target: string) {
    return input.replaceAll(new RegExp(`(?:${escapeRegExp(target)}){2,}`, 'g'), target)
}

export function padStart(str: string | Numberish, targetLength: number, padString = ' ') {
    return str.toString().padStart(targetLength, padString)
}

export function padZeroStart(num: string | Numberish, targetLength: number) {
    return padStart(num, targetLength, '0')
}
