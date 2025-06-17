import { notNullish, type Nullish } from '../core'

export function combineSignals(...signals: Array<Nullish<AbortSignal>>): AbortSignal {
    const validSignals = signals.filter(notNullish)

    if (validSignals.length === 0) {
        return new AbortController().signal
    }

    return AbortSignal.any(validSignals)
}
