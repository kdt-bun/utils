export interface LinkedNode<T> {
    value: T
    prev: LinkedNode<T> | null
    next: LinkedNode<T> | null
}

export abstract class LinkedSet<T> {
    protected readonly nodeMap = new Map<T, LinkedNode<T>>()

    protected head: LinkedNode<T> | null = null
    protected tail: LinkedNode<T> | null = null
    protected currentSize = 0

    public constructor(public readonly maxSize?: number) {}

    public get size() {
        return this.currentSize
    }

    public abstract add(value: T): this

    public has(value: T) {
        return this.nodeMap.has(value)
    }

    public delete(value: T) {
        const node = this.nodeMap.get(value)

        if (!node) {
            return false
        }

        this.nodeMap.delete(value)
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

    public * values(): IterableIterator<T> {
        let current = this.head

        while (current) {
            yield current.value
            current = current.next
        }
    }

    public keys() {
        return this.values()
    }

    public * entries(): IterableIterator<[T, T]> {
        for (const value of this.values()) {
            yield [value, value]
        }
    }

    public [Symbol.iterator]() {
        return this.values()
    }

    public forEach(callback: (value: T, value2: T, set: this) => void, thisArg?: any) {
        for (const value of this.values()) {
            callback.call(thisArg, value, value, this)
        }
    }

    protected createNode(value: T): LinkedNode<T> {
        return { value, prev: null, next: null }
    }

    protected addToHead(node: LinkedNode<T>) {
        if (this.head) {
            node.next = this.head
            this.head.prev = node
            this.head = node
        } else {
            this.head = node
            this.tail = node
        }
    }

    protected removeNode(node: LinkedNode<T>) {
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

        const tailValue = this.tail.value

        this.nodeMap.delete(tailValue)
        this.removeNode(this.tail)
        this.currentSize--
    }

    protected moveToHead(node: LinkedNode<T>) {
        this.removeNode(node)
        this.addToHead(node)
    }
}
