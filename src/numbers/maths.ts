export function avg(array: number[]) {
    return array.reduce((a, b) => a + b, 0) / array.length
}

export function sum(array: number[]) {
    return array.reduce((a, b) => a + b, 0)
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}
