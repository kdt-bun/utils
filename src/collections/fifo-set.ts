import { LinkedSet } from './linked-set'

export class FifoSet<T> extends LinkedSet<T> {
    public add(value: T): this {
        if (this.nodeMap.has(value)) {
            return this
        }

        const newNode = this.createNode(value)

        this.nodeMap.set(value, newNode)
        this.addToHead(newNode)
        this.currentSize++

        if (this.maxSize && this.currentSize > this.maxSize) {
            this.removeTail()
        }

        return this
    }
}
