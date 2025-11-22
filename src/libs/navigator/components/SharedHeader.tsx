import React from 'react';
import {
  Text,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'; // Simple native animations
import { headerSignal } from '../hooks/useSetHeader';
import { useSignalValue } from '../hooks/useSignalValue';
import { useNav } from '../hooks/useNav';

export const SharedHeader = () => {
  const config = useSignalValue(headerSignal);
  const nav = useNav();
  console.log(config);

  // When the title changes, trigger a layout animation for a smooth morph
  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [config.title]);

  return (
    <View style={styles.portalHeader}>
      <View style={styles.headerLeft}>
        {config.showBack && (
          <Pressable onPress={nav.pop} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
        )}
      </View>

      {/* The Title container centers the text */}
      <View style={styles.headerCenter}>
        <Text
          key={config.title} // Key forces React to treat it as new, triggering animation
          style={styles.portalTitle}
          numberOfLines={1}
        >
          {config.title}
        </Text>
      </View>

      <View style={styles.headerRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  portalHeader: {
    position: 'absolute', // Float on top
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Matches screen paddingTop
    paddingTop: 50, // Safe Area
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)', // Slight translucency looks premium
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 9999, // Always on top
  },
  portalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerLeft: { width: 50, alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerRight: { width: 50 },
  backButton: { padding: 10 },
  backText: { fontSize: 24, fontWeight: 'bold' },
});
