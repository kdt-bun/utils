import { toUnixTimestamp } from './conversions'

export function timestamp() {
    return toUnixTimestamp(new Date())
}
