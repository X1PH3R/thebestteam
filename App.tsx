/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

import ExploreClubsScreen from './src/screens/ClubScreen';
import EventScreen from './src/screens/EventScreen';
import ClubDetailsScreen from './src/screens/ClubDetailsScreen';
import MyClubsScreen from './src/screens/MyClubsScreen';
import MemberProfileScreen from './src/screens/MemberProfileScreen';
import CreateProfileScreen from './src/screens/CreateProfileScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

type RootStackParamList = {
  MyClubs: undefined;
  ClubDetails: { club: any };
  Events: undefined;
  ExploreClubs: undefined;
  MemberProfile: { member: any };
  CreateProfile: undefined;
};

type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: 'home',
      Explore: 'explore',
      Events: 'events',
      ClubDetails: 'club/:id',
    },
  },
};

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#007AFF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="MyClubs" 
      component={MyClubsScreen}
      options={{
        title: 'My Clubs',
      }}
    />
    <Stack.Screen 
      name="ClubDetails" 
      component={ClubDetailsScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="Events" 
      component={EventScreen}
      options={{
        title: 'Events',
      }}
    />
    <Stack.Screen 
      name="MemberProfile" 
      component={MemberProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="CreateProfile" 
      component={CreateProfileScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#007AFF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="ExploreClubs" 
      component={ExploreClubsScreen}
      options={{
        title: 'Explore Clubs',
      }}
    />
    <Stack.Screen 
      name="ClubDetails" 
      component={ClubDetailsScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="Events" 
      component={EventScreen}
      options={{
        title: 'Events',
      }}
    />
    <Stack.Screen 
      name="MemberProfile" 
      component={MemberProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="CreateProfile" 
      component={CreateProfileScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default function App() {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="light" />
        <NavigationContainer linking={linking}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
                let iconName: string;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Explore') {
                  iconName = focused ? 'compass' : 'compass-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                } else {
                  iconName = 'help';
                }

                return <Ionicons name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
              tabBarStyle: {
                paddingBottom: 10,
                paddingTop: 10,
                height: 80,
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0',
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 5,
              },
              tabBarIconStyle: {
                marginBottom: -5,
              },
            })}
          >
            <Tab.Screen 
              name="Explore" 
              component={ExploreStack}
              options={{
                title: 'Explore',
              }}
            />
            <Tab.Screen 
              name="Home" 
              component={HomeStack}
              options={{
                title: 'Home',
              }}
            />
            <Tab.Screen 
              name="Profile" 
              component={CreateProfileScreen}
              options={{
                title: 'Profile',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
