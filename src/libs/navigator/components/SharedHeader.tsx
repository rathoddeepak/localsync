import React, { useContext } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native'; // Simple native animations
import { headerSignal } from '../hooks/useSetHeader';
import { useSignalValue } from '../hooks/useSignalValue';
import { useNav } from '../hooks/useNav';
import { NavContext } from './NavigationStack';

export const SharedHeader = () => {
  const store = useContext(NavContext)!;
  const config = useSignalValue(headerSignal);
  const nav = useNav();

  const onLayout = (e: any) => {
    // PERFORMANCE NOTE:
    // This runs on JS, but only when header size physically changes.
    // Updating the SharedValue triggers UI-thread updates on all screens instantly.
    store.headerHeight.value = e.nativeEvent.layout.height;
  };

  return (
    <View style={styles.portalHeader} onLayout={onLayout}>
      <View style={styles.headerLeft}>
        {config.showBack && (
          <Pressable onPress={nav.pop} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
        )}
      </View>

      {/* The Title container centers the text */}
      <View style={styles.headerCenter}>
        <Text style={styles.portalTitle}>{config.title}</Text>
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
