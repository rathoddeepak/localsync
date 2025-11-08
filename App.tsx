import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Events } from './src/screens/Events';
import { EventDetails } from './src/screens/EventDetails';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Events',
  screens: {
    Events: Events,
    Details: EventDetails,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
