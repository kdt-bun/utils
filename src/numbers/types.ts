export type NumberString = `${number}` | 'Infinity' | '-Infinity' | '+Infinity' | 'NaN' | '-NaN' | '+NaN'

export type Numberish = NumberString | number | bigint
