/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';

import ClubScreen from './src/screens/ClubScreen';
import EventScreen from './src/screens/EventScreen';
import ClubDetailsScreen from './src/screens/ClubDetailsScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL('/');

export default function App() {
  const onLayoutRootView = useCallback(async () => {
    if (SplashScreen.hideAsync) {
      await SplashScreen.hideAsync();
    }
  }, []);

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Clubs: 'clubs',
        Events: 'events',
        ClubDetails: 'club/:id',
      },
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            initialRouteName="Clubs"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#333',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Clubs" 
              component={ClubScreen}
              options={{ title: 'Clubs' }}
            />
            <Stack.Screen 
              name="Events" 
              component={EventScreen}
              options={{ title: 'Events' }}
            />
            <Stack.Screen 
              name="ClubDetails" 
              component={ClubDetailsScreen}
              options={{ 
                title: 'Club Details',
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
