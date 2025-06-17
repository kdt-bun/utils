export function toString(value: unknown) {
    return Object.prototype.toString.call(value)
}

export function typeOf(value: unknown): string {
    if (value === null) {
        return 'null'
    }

    return typeof value === 'object' || typeof value === 'function' ? toString(value).slice(8, -1).toLowerCase() : typeof value
}

export function isNull(value: unknown): value is null {
    return value === null
}

export function isUndefined(value: unknown): value is undefined {
    return value === undefined
}

export function isNullish(value: unknown): value is null | undefined {
    return isNull(value) || isUndefined(value)
}

export function notNull<T>(value: T): value is Exclude<T, null> {
    return !isNull(value)
}

export function notUndefined<T>(value: T): value is Exclude<T, undefined> {
    return !isUndefined(value)
}

export function notNullish<T>(value: T): value is NonNullable<T> {
    return !isNullish(value)
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

export function isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
}
