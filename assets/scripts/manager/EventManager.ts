type Callback = (...args: any[]) => void;

interface Listener {
  callback: Callback;
  target?: any;
}

export class EventManager {
  private static _instance: EventManager;
  private events: Map<string, Listener[]> = new Map();

  static get instance() {
    if (!this._instance) {
      this._instance = new EventManager();
    }
    return this._instance;
  }

  on(eventName: string, callback: Callback, target?: any) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push({ callback, target });
  }

  off(eventName: string, callback: Callback, target?: any) {
    const listeners = this.events.get(eventName);
    if (!listeners) return;

    this.events.set(
      eventName,
      listeners.filter(
        (l) => l.callback !== callback || l.target !== target
      )
    );
  }

  emit(eventName: string, ...args: any[]) {
    const listeners = this.events.get(eventName);
    if (!listeners) return;

    listeners.forEach((l) => {
      l.callback.apply(l.target, args);
    });
  }
}