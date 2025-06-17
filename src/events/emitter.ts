import type { EventArgs, EventListener, EventListenerMap, EventMap, EventNames } from './types'

export class Emitter<TEventMap = EventMap, TStrict extends boolean = false> {
    protected readonly eventListeners: EventListenerMap = new Map()
    protected readonly onceListeners: EventListenerMap = new Map()

    public listeners<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName): Array<EventListener<EventArgs<TEventMap, TEventName, TStrict>>> {
        const listeners = this.eventListeners.get(eventName) ?? []
        const onceListeners = this.onceListeners.get(eventName) ?? []

        return [...listeners, ...onceListeners]
    }

    public listenersCount<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName): number {
        const listeners = this.eventListeners.get(eventName)
        const onceListeners = this.onceListeners.get(eventName)

        return (listeners?.size ?? 0) + (onceListeners?.size ?? 0)
    }

    public eventNames(): Array<keyof TEventMap | PropertyKey> {
        return [...new Set([...this.eventListeners.keys(), ...this.onceListeners.keys()])]
    }

    public on<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, listener: EventListener<EventArgs<TEventMap, TEventName, TStrict>>): this {
        let listeners = this.eventListeners.get(eventName)

        if (!listeners) {
            listeners = new Set()
            this.eventListeners.set(eventName, listeners)
        }

        listeners.add(listener)

        return this
    }

    public once<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, listener: EventListener<EventArgs<TEventMap, TEventName, TStrict>>): this {
        let listeners = this.onceListeners.get(eventName)

        if (!listeners) {
            listeners = new Set()
            this.onceListeners.set(eventName, listeners)
        }

        listeners.add(listener)

        return this
    }

    public off<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, listener: EventListener<EventArgs<TEventMap, TEventName, TStrict>>): this {
        const listeners = this.eventListeners.get(eventName)

        if (listeners) {
            listeners.delete(listener)

            if (listeners.size === 0) {
                this.eventListeners.delete(eventName)
            }
        }

        const onceListeners = this.onceListeners.get(eventName)

        if (onceListeners) {
            onceListeners.delete(listener)

            if (onceListeners.size === 0) {
                this.onceListeners.delete(eventName)
            }
        }

        return this
    }

    public emit<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, ...args: EventArgs<TEventMap, TEventName, TStrict>): boolean {
        let hasListeners = false

        const listeners = [...(this.eventListeners.get(eventName) ?? [])]

        if (listeners.length > 0) {
            hasListeners = true

            for (const listener of listeners) {
                listener(...args)
            }
        }

        const onceListeners = [...(this.onceListeners.get(eventName) ?? [])]

        if (onceListeners.length > 0) {
            hasListeners = true

            for (const listener of onceListeners) {
                listener(...args)
            }

            this.onceListeners.delete(eventName)
        }

        return hasListeners
    }

    public removeAllListeners<TEventName extends EventNames<TEventMap, TStrict>>(eventName?: TEventName): this {
        if (eventName === undefined) {
            this.eventListeners.clear()
            this.onceListeners.clear()
        } else {
            this.eventListeners.delete(eventName)
            this.onceListeners.delete(eventName)
        }

        return this
    }
}
