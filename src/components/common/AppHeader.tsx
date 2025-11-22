import React from 'react';
import { View, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const AppHeader = () => {
  return <View style={{ height: 50, width, backgroundColor: 'black' }}></View>;
};
