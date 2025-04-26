import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ClubsScreen from './src/screens/ClubsScreen';
import EventsScreen from './src/screens/EventsScreen';

export type RootStackParamList = {
  Home: undefined;
  Clubs: undefined;
  Events: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{title: 'SJU Connect'}}
        />
        <Stack.Screen 
          name="Clubs" 
          component={ClubsScreen}
          options={{title: 'Clubs'}}
        />
        <Stack.Screen 
          name="Events" 
          component={EventsScreen}
          options={{title: 'Events'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 