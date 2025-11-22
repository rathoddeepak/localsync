/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeMutable, SharedValue } from 'react-native-reanimated';
/* eslint-enable @typescript-eslint/no-unused-vars */

import { headerSignal } from '../hooks/useSetHeader';
import { HeaderConfig } from '../types/header';
import { RouteDef } from '../types/route';
import { Signal } from '../utils/signal';

type PartialHeaderConfig = Partial<HeaderConfig>;

export class NavigationStore {
  // The stack is a signal of Route Definitions
  stack = new Signal<RouteDef[]>([]);

  // 1. GLOBAL SHARED VALUE for layout
  // We initialize with a "safe" guess (e.g., 100) to prevent content jumping
  // before the first frame is measured.
  headerHeight: SharedValue<number> = makeMutable(100);

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
      isExitingSignal: new Signal(false),
    };

    // Update previous top to be unfocused
    if (currentStack.length > 0) {
      currentStack[currentStack.length - 1].isFocusedSignal.value = false;
    }

    // Push to stack (Triggering Navigator update)
    this.stack.value = [...currentStack, newRoute];
    headerSignal.value = {
      title: name,
      showBack: currentStack.length > 0,
    };
  }

  // 1. The "Public" Pop: Triggers the animation
  pop() {
    const currentStack = this.stack.value;
    if (currentStack.length <= 1) return;

    const topRoute = currentStack[currentStack.length - 1];
    // We do NOT remove it yet. We just signal it to leave.
    topRoute.isExitingSignal.value = true;

    const upcomingRoute = currentStack[currentStack.length - 2];
    headerSignal.value = {
      title: upcomingRoute.name,
      showBack: currentStack.length > 2,
    };
  }

  // 2. The "Private" Cleanup: Called by the component after animation
  cleanupRoute(key: string) {
    // This causes the React Re-render (Unmount)
    this.stack.value = this.stack.value.filter(r => r.key !== key);
  }

  // Update params without re-rendering the screen wrapper
  setParams(routeKey: string, newParams: any) {
    const route = this.stack.value.find(r => r.key === routeKey);
    if (route) {
      route.paramsSignal.value = { ...route.paramsSignal.value, ...newParams };
    }
  }

  // Helper to update the ACTIVE route's header dynamically
  updateHeader(config: PartialHeaderConfig) {
    headerSignal.value = {
      ...headerSignal.value,
      ...config,
    };
  }
}
