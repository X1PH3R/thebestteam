/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import AuthScreen from './src/screens/AuthScreen';
import StudentDetailsScreen from './src/screens/StudentDetailsScreen';

export type RootStackParamList = {
  Auth: undefined;
  StudentDetails: undefined;
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{title: 'Welcome to St. John\'s'}}
        />
        <Stack.Screen 
          name="StudentDetails" 
          component={StudentDetailsScreen}
          options={{title: 'Complete Your Profile'}}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{title: 'Details'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
