export function createSymbolKeySerializer() {
    const symbols = new WeakMap<symbol, string>()
    const symbolDescriptionsCount: Record<string, number> = {}

    let counter = 0

    return (symbol: symbol) => {
        if (!symbols.has(symbol)) {
            let description = symbol.description

            if (description?.length) {
                symbolDescriptionsCount[description] ??= 0

                if (symbolDescriptionsCount[description]++ > 0) {
                    description += `__${symbolDescriptionsCount[description]}`
                }
            } else {
                description = String(++counter)
            }

            symbols.set(symbol, `[Symbol(${description})]`)
        }

        return symbols.get(symbol)!
    }
}
