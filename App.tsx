/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClubScreen from './src/screens/ClubScreen';
import EventScreen from './src/screens/EventScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Clubs">
        <Stack.Screen 
          name="Clubs" 
          component={ClubScreen}
          options={{title: 'Clubs'}}
        />
        <Stack.Screen 
          name="Events" 
          component={EventScreen}
          options={{title: 'Events'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
