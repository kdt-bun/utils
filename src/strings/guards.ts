import type { Nullish } from '../core'
import type { HexString, UrlLike } from './types'
import { wrap } from '../arrays'
import { transform } from '../functions'

export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export function isEmptyString(value: string) {
    return value.length === 0
}

export function hasPrefix(value: string, prefix: string) {
    return value.startsWith(prefix)
}

export function hasSuffix(value: string, suffix: string) {
    return value.endsWith(suffix)
}

export function isValidProtocol({ protocol }: URL, protocols?: Nullish<string[]>) {
    if (!protocols?.length) {
        return true
    }

    return protocols.map((x) => `${x.toLowerCase()}:`).includes(protocol)
}

export function isValidUrl(url: UrlLike, protocols?: Nullish<string[]>) {
    if (url instanceof URL) {
        return isValidProtocol(url, protocols)
    }

    try {
        return isValidProtocol(new URL(url), protocols)
    } catch {
        return false
    }
}

export function isWebSocketUrl(url: UrlLike, wsProtocols = ['ws', 'wss']) {
    return isValidUrl(url, wsProtocols)
}

export function isHttpUrl(url: UrlLike, httpProtocols = ['http', 'https']) {
    return isValidUrl(url, httpProtocols)
}

export function isStringEquals(str: string, ...others: string[]) {
    return others.every((other) => str === other)
}

export function isStringEqualsIgnoreCase(str: string, ...others: string[]) {
    return transform(str.toLocaleLowerCase(), (x) => others.every((other) => x === other.toLocaleLowerCase()))
}

export function isIncludesAll(str: string, search: string[]) {
    return search.every((s) => str.includes(s))
}

export function isIncludesAny(str: string, search: string[]) {
    return search.some((s) => str.includes(s))
}

export function isIncludes(str: string, search: string | string[], type: 'any' | 'all' = 'all') {
    return type === 'all' ? isIncludesAll(str, wrap(search)) : isIncludesAny(str, wrap(search))
}

export function isHexString(value: string, length?: number): value is string {
    const len = length ? `{${length * 2}}` : '+'
    const regex = new RegExp(`^(?:0x)?[0-9a-f]${len}$`, 'iu')

    return regex.test(value)
}

export function isStrictHexString(value: string, length?: number): value is HexString {
    return hasPrefix(value, '0x') && isHexString(value, length)
}
