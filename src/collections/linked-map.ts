export interface LinkedMapNode<K, V> {
    key: K
    value: V
    prev: LinkedMapNode<K, V> | null
    next: LinkedMapNode<K, V> | null
}

export abstract class LinkedMap<K, V> {
    protected readonly nodeMap = new Map<K, LinkedMapNode<K, V>>()

    protected head: LinkedMapNode<K, V> | null = null
    protected tail: LinkedMapNode<K, V> | null = null
    protected currentSize = 0

    public constructor(public readonly maxSize?: number) {}

    public get size() {
        return this.currentSize
    }

    public abstract set(key: K, value: V): this

    public get(key: K) {
        return this.nodeMap.get(key)?.value
    }

    public has(key: K) {
        return this.nodeMap.has(key)
    }

    public delete(key: K) {
        const node = this.nodeMap.get(key)

        if (!node) {
            return false
        }

        this.nodeMap.delete(key)
        this.removeNode(node)
        this.currentSize--

        return true
    }

    public clear() {
        this.nodeMap.clear()
        this.head = null
        this.tail = null
        this.currentSize = 0
    }

    public * keys(): IterableIterator<K> {
        let current = this.head

        while (current) {
            yield current.key
            current = current.next
        }
    }

    public * values(): IterableIterator<V> {
        let current = this.head

        while (current) {
            yield current.value
            current = current.next
        }
    }

    public * entries(): IterableIterator<[K, V]> {
        let current = this.head

        while (current) {
            yield [current.key, current.value]
            current = current.next
        }
    }

    public [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries()
    }

    public forEach(callback: (value: V, key: K, map: this) => void, thisArg?: any) {
        for (const [key, value] of this.entries()) {
            callback.call(thisArg, value, key, this)
        }
    }

    protected createNode(key: K, value: V): LinkedMapNode<K, V> {
        return { key, value, prev: null, next: null }
    }

    protected addToHead(node: LinkedMapNode<K, V>) {
        if (this.head) {
            node.next = this.head
            this.head.prev = node
            this.head = node
        } else {
            this.head = node
            this.tail = node
        }
    }

    protected removeNode(node: LinkedMapNode<K, V>) {
        if (node.prev) {
            node.prev.next = node.next
        } else {
            this.head = node.next
        }

        if (node.next) {
            node.next.prev = node.prev
        } else {
            this.tail = node.prev
        }
    }

    protected removeTail() {
        if (!this.tail) {
            return
        }

        const tailKey = this.tail.key

        this.nodeMap.delete(tailKey)
        this.removeNode(this.tail)
        this.currentSize--
    }

    protected moveToHead(node: LinkedMapNode<K, V>) {
        this.removeNode(node)
        this.addToHead(node)
    }

    protected updateNodeValue(node: LinkedMapNode<K, V>, value: V) {
        node.value = value
    }
}
