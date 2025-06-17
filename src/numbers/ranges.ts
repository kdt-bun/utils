import { notNullish } from '../core'

export function isValidRange<T extends number | bigint>(start: T, end: T, inclusive = true, min?: T, max?: T) {
    if (notNullish(min) && start < min) {
        return false
    }

    if (notNullish(max) && end > max) {
        return false
    }

    return inclusive ? start <= end : start < end
}

export function isInRange<T extends number | bigint>(value: T, min: T, max: T, inclusive = true) {
    return inclusive ? value >= min && value <= max : value > min && value < max
}
