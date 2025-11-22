import React from 'react';
import { NavigationStore } from '../store/navigation';
import { View, BackHandler, StyleSheet } from 'react-native';
import { useSignalValue } from '../hooks/useSignalValue';
import { ScreenWrapper } from './ScreenWrapper';
import { SharedHeader } from './SharedHeader';

export const NavContext = React.createContext<NavigationStore | null>(null);

export const NavigationStack = ({
  routes,
  initialRoute,
}: {
  routes: Record<string, React.ComponentType<any>>;
  initialRoute: string;
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const store = React.useMemo(
    () => new NavigationStore(routes, initialRoute),
    [],
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  const stack = useSignalValue(store.stack); // Only updates when pushing/popping

  // Hardware Back
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (store.stack.value.length > 1) {
        store.pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <NavContext.Provider value={store}>
      <View style={styles.container}>
        {/* Here is the "Legend-List" inspiration:
           We map the stack. React handles the reconciliation.
           Because <LegendaryScreenWrapper> is Memoized with a custom comparator,
           existing screens DO NOT RE-RENDER when we push a new one.
        */}
        {stack.map(route => (
          <ScreenWrapper key={route.key} route={route} store={store} />
        ))}
      </View>

      {/* THE PORTAL HEADER LAYER (Floats on top) */}
      {/* It sits optically above the stack so transitions happen BEHIND it */}
      <SharedHeader />
    </NavContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
