import React from 'react';
import { RouteDef } from '../types/route';
import { NavigationStore } from '../store/navigation';
import { useSignalValue } from '../hooks/useSignalValue';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ScreenContent } from './ScreenContent';
import { scheduleOnRN } from 'react-native-worklets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ScreenWrapperProps = {
  route: RouteDef;
  store: NavigationStore;
};

export const ScreenWrapper = React.memo(
  ({ route, store }: ScreenWrapperProps) => {
    const index = useSignalValue(route.indexSignal); // Reactive index
    const isNewScreen = index === store.stack.value.length - 1 && index > 0;
    const translateX = useSharedValue(isNewScreen ? SCREEN_WIDTH : 0);

    // 1. FREEZE LOGIC (Inspired by Legend-List)
    // Instead of unmounting, we check visibility.
    // We subscribe to the index signal.
    // const isTop = index === store.stack.value.length - 1; // This might cause re-render, let's optimize.
    // Actually, let's use the isFocusedSignal for logic, but for rendering we need to know if we are "far"

    // Entrance Animation
    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(() => {
      if (index > 0) {
        translateX.value = SCREEN_WIDTH;
        translateX.value = withTiming(0, { duration: 300 });
      }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const handlePop = React.useCallback(() => {
      store.pop();
    }, [store]);

    // Gesture Handling (Native Thread)
    const pan = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onUpdate(e => {
        if (index === 0) return;
        if (e.translationX > 0) translateX.value = e.translationX;
      })
      .onEnd(e => {
        if (index === 0) return;
        if (e.translationX > SCREEN_WIDTH * 0.3 || e.velocityX > 800) {
          translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
            scheduleOnRN(handlePop);
          });
        } else {
          translateX.value = withTiming(0, { duration: 300 });
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      zIndex: index,
    }));

    // PARALLAX EFFECT for screens underneath
    // We use a Reanimated reaction or just style logic.
    // Since we don't have a global 'progress' signal here for simplicity, we rely on the fact
    // that the screen ON TOP handles the animation.
    // Real production apps would link the Top Screen's translate value to the Bottom Screen's scale.

    return (
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.screen, animatedStyle]}>
          <ScreenContent route={route} />
        </Animated.View>
      </GestureDetector>
    );
  },
  (prev, next) => {
    // CRITICAL: Custom comparison.
    // Only re-render if the route KEY changes (which never happens for the same screen instance).
    // We ignore stack changes. The component manages its own state via Signals.
    return prev.route.key === next.route.key;
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  screen: {
    ...StyleSheet.absoluteFillObject, // Absolute stacking is crucial for performance
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  page: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 100,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  subtext: {
    padding: 20,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
