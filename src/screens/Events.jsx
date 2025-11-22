import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

export const Events = () => {
  const [events] = useState([{ id: 1 }]);
  return (
    <View style={styles.container}>
      {events.map(ev => {
        return (
          <Pressable
            key={ev.id}
            // onPress={() => navigation.navigate('Details')}
            style={styles.eventCard}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 10 },
  eventCard: {
    height: 200,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
