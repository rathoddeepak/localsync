import React from 'react';
import { RouteDef } from '../types/route';
import { NavigationStore } from '../store/navigation';
import { useSignalValue } from '../hooks/useSignalValue';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
    // Listen for the exit command
    const isExiting = useSignalValue(route.isExitingSignal);
    const isNewScreen = index === store.stack.value.length - 1 && index > 0;
    const translateX = useSharedValue(isNewScreen ? SCREEN_WIDTH : 0);

    // 1. FREEZE LOGIC (Inspired by Legend-List)
    // Instead of unmounting, we check visibility.
    // We subscribe to the index signal.
    // const isTop = index === store.stack.value.length - 1; // This might cause re-render, let's optimize.
    // Actually, let's use the isFocusedSignal for logic, but for rendering we need to know if we are "far"

    // 1. The Final Cleanup function (Run on JS Thread)
    const handleCleanup = React.useCallback(() => {
      store.cleanupRoute(route.key);
    }, [store, route.key]);

    // 2. EFFECT: Watch for External Pop (Hardware Back or Header Back)

    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(() => {
      if (isExiting) {
        // The store told us to leave. Animate out -> Then Cleanup.
        translateX.value = withTiming(
          SCREEN_WIDTH,
          { duration: 250 },
          finished => {
            if (finished) {
              scheduleOnRN(handleCleanup);
            }
          },
        );
      }
    }, [isExiting, handleCleanup]); // Dependencies are stable
    /* eslint-enable react-hooks/exhaustive-deps */

    // Entrance Animation
    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(() => {
      if (isNewScreen && !isExiting) {
        translateX.value = withSpring(0, { duration: 200 });
      }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    // Gesture Handling (Native Thread)
    const pan = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onUpdate(e => {
        if (index === 0) return;
        // Only allow dragging to the right
        if (e.translationX > 0) translateX.value = e.translationX;
      })
      .onEnd(e => {
        if (index === 0) return;

        const shouldClose =
          e.translationX > SCREEN_WIDTH * 0.3 || e.velocityX > 800;

        if (shouldClose) {
          // Animate to the edge, THEN cleanup
          translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
            scheduleOnRN(handleCleanup);
          });
        } else {
          // Reset if swipe wasn't strong enough
          translateX.value = withSpring(0, { duration: 200 });
        }
      });

    // 1. DYNAMIC PADDING (The Fix)
    // This runs entirely on the UI thread.
    // If header grows to 120px, this padding updates instantly.
    const headerHeightSV = store.headerHeight;
    const layoutStyle = useAnimatedStyle(() => ({
      paddingTop: headerHeightSV.value,
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      zIndex: index,
    }));

    return (
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.screen, animatedStyle, layoutStyle]}>
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
  screen: {
    ...StyleSheet.absoluteFillObject, // Absolute stacking is crucial for performance
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
});
