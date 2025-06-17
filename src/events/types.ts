export type EventMap = Record<PropertyKey, any[]>

export type EventNames<TEventMap, TStrict extends boolean> = TStrict extends true ? keyof TEventMap : keyof TEventMap | string

export type EventArgs<TEventMap, TEventName, TStrict extends boolean> = TStrict extends true ? TEventName extends keyof TEventMap ? TEventMap[TEventName] extends any[] ? TEventMap[TEventName] : any[] : never : TEventName extends keyof TEventMap ? TEventMap[TEventName] extends any[] ? TEventMap[TEventName] : any[] : any[]

export type EventListener<TArgs = any[]> = (...args: TArgs extends any[] ? TArgs : any[]) => void

export type EventListenerMap = Map<PropertyKey, Set<EventListener>>
