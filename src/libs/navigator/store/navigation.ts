import { RouteDef } from '../types/route';
import { Signal } from '../utils/signal';

export class NavigationStore {
  // The stack is a signal of Route Definitions
  stack = new Signal<RouteDef[]>([]);

  private routeMap: Record<string, React.ComponentType<any>>;

  constructor(
    routes: Record<string, React.ComponentType<any>>,
    initialRoute: string,
  ) {
    this.routeMap = routes;
    this.push(initialRoute);
  }

  push(name: string, params: any = {}) {
    const currentStack = this.stack.value;
    const newRoute: RouteDef = {
      key: `${name}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      component: this.routeMap[name],
      paramsSignal: new Signal(params),
      indexSignal: new Signal(currentStack.length),
      isFocusedSignal: new Signal(true), // New screen is focused
    };

    // Update previous top to be unfocused
    if (currentStack.length > 0) {
      currentStack[currentStack.length - 1].isFocusedSignal.value = false;
    }

    // Push to stack (Triggering Navigator update)
    this.stack.value = [...currentStack, newRoute];
  }

  pop() {
    const currentStack = this.stack.value;
    if (currentStack.length <= 1) return;

    const newStack = currentStack.slice(0, -1);

    // Make the new top screen focused
    newStack[newStack.length - 1].isFocusedSignal.value = true;

    this.stack.value = newStack;
  }

  // Update params without re-rendering the screen wrapper
  setParams(routeKey: string, newParams: any) {
    const route = this.stack.value.find(r => r.key === routeKey);
    if (route) {
      route.paramsSignal.value = { ...route.paramsSignal.value, ...newParams };
    }
  }
}
