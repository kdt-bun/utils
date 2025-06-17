import { LinkedMap } from './linked-map'

export class FifoMap<K, V> extends LinkedMap<K, V> {
    public set(key: K, value: V): this {
        const existingNode = this.nodeMap.get(key)

        if (existingNode) {
            this.updateNodeValue(existingNode, value)

            return this
        }

        const newNode = this.createNode(key, value)

        this.nodeMap.set(key, newNode)
        this.addToHead(newNode)
        this.currentSize++

        if (this.maxSize && this.currentSize > this.maxSize) {
            this.removeTail()
        }

        return this
    }
}
