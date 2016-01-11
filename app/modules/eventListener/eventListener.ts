type callback = (...args) => void;

export default class EventListener<T> {
    private subscribers: Map<T, Array<callback>>;
    
    constructor() {
        this.subscribers = new Map();
    }

    on(eventName: T, fn: callback) {
        if (typeof fn !== 'function') {
            return;
        }
        if (!this.subscribers.has(eventName)) {
            this.subscribers.set(eventName, []);
        }

        this.subscribers.get(eventName).push(fn);
    }

    off(eventName: T, fn: callback) {
        if (typeof fn !== 'function' || !this.subscribers.has(eventName)) {
            return;
        }
        const currentCallbacks = this.subscribers.get(eventName);
        const callbacks = currentCallbacks.filter(cb => cb !== fn);
        this.subscribers.set(eventName, callbacks);
    }

    protected dispatch(eventName: T, ...args) {
        if (!this.subscribers.has(eventName)) {
            return;
        }
        this.subscribers.get(eventName).forEach(cb => cb(...args));
    }
}
