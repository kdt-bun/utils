import { isArray } from './guards'

export function * chunk<T>(iterable: Iterable<T>, size: number): Generator<T[], void, void> {
    if (isArray(iterable)) {
        for (let i = 0; i < iterable.length; i += size) {
            yield iterable.slice(i, i + size)
        }

        return
    }

    const iterator = iterable[Symbol.iterator]()

    let result = iterator.next()

    while (!result.done) {
        const chunk: T[] = []

        for (let i = 0; i < size && !result.done; i++) {
            chunk.push(result.value)
            result = iterator.next()
        }

        if (chunk.length > 0) {
            yield chunk
        }
    }
}
