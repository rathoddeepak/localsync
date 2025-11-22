// A lightweight implementation of Signals to bypass React Render Cycle
type Listener<T> = (value: T) => void;

type RouteDef = {
  key: string;
  name: string;
  component: React.ComponentType<any>;
  paramsSignal: Signal<any>; // Params are signals! Updating them doesn't re-render the wrapper
  indexSignal: Signal<number>; // The screen knows its index via signal
  isFocusedSignal: Signal<boolean>; // Visibility driven by signal
};
