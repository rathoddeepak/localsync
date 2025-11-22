import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationStack } from './src/libs/navigator/components/NavigationStack';
import { useNav } from './src/libs/navigator/hooks/useNav';
import { Signal } from './src/libs/navigator/utils/signal';
import { useParamsSignal } from './src/libs/navigator/hooks/useParamSignal';
import { useSetHeader } from './src/libs/navigator/hooks/useSetHeader';

// 1. Header Title that updates via Signal (Fine-Grained)
const SignalHeader = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const HomeScreen = () => {
  const nav = useNav();

  useSetHeader({ title: 'Telegram Inbox', showBack: false });

  return (
    <View style={styles.page}>
      <Text style={styles.subtext}>
        This stack uses Signals. Pushing a screen does not re-render this
        parent.
      </Text>

      {[1, 2, 3].map(i => (
        <Pressable
          key={i}
          style={styles.card}
          onPress={() => nav.push('Details', { id: i, title: `Item ${i}` })}
        >
          <View style={styles.avatar} />
          <Text style={styles.cardText}>Open Item {i}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const DetailsScreen = ({ params$ }: { params$: Signal<any> }) => {
  const nav = useNav();
  // Fine-grained: This component renders ONCE.
  // Only 'id' text node updates if signal changes (simulated here via hook).
  const id = useParamsSignal(params$, 'id');
  useSetHeader({ title: `Conversation ${id}`, showBack: true });

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.bodyText}>
          Swipe right to go back. This transition runs on the UI Thread.
        </Text>
        <Pressable style={styles.btn} onPress={() => nav.push('Settings')}>
          <Text style={styles.btnText}>Go Deeper (Settings)</Text>
        </Pressable>
      </View>
    </View>
  );
};

const SettingsScreen = () => (
  <View style={styles.page}>
    <SignalHeader title="Settings" />
    <View style={styles.content}>
      <Text>The screens below this one are frozen.</Text>
    </View>
  </View>
);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationStack
        initialRoute="Home"
        routes={{
          Home: HomeScreen,
          Details: DetailsScreen,
          Settings: SettingsScreen,
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
