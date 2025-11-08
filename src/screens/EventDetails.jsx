import { View, Text, StyleSheet } from 'react-native';

export const EventDetails = () => {
  return (
    <View style={styles.container}>
      <Text>Event Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
