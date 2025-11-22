export class Signal<T> {
  private _value: T;
  private _listeners: Set<Listener<T>> = new Set();

  constructor(value: T) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  // "Peek" allows reading without subscribing (not used in this simple version but good practice)
  peek() {
    return this._value;
  }

  subscribe(listener: Listener<T>) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  notify() {
    this._listeners.forEach(l => l(this._value));
  }
}
