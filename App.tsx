/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { JoinedClubsProvider } from './src/context/JoinedClubsContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import ExploreScreen from './src/screens/ClubScreen';
import EventScreen from './src/screens/EventScreen';
import ClubDetailsScreen from './src/screens/ClubDetailsScreen';
import MyClubsScreen from './src/screens/MyClubsScreen';
import MemberProfileScreen from './src/screens/MemberProfileScreen';
import CreateProfileScreen from './src/screens/CreateProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import GroupChatScreen from './src/screens/GroupChatScreen';
import HomeScreen from './src/screens/HomeScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Explore: undefined;
  MyClubs: { joinedClub?: any };
  ClubDetails: { club: any };
  Events: undefined;
  ExploreClubs: undefined;
  MemberProfile: { member: any };
  CreateProfile: undefined;
  GroupChat: undefined;
};

type TabParamList = {
  Home: undefined;
  Clubs: undefined;
  Calendar: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Login: 'login',
      ForgotPassword: 'forgot-password',
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
        backgroundColor: '#FF3B30',
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
        backgroundColor: '#FF3B30',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="ExploreClubs" 
      component={ExploreScreen}
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

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
  </Stack.Navigator>
);

const MainApp = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Clubs') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF3B30',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#FF3B30',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ExploreStack}
        options={{
          title: 'Explore Clubs',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Clubs" 
        component={HomeStack}
        options={{
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={EventScreen}
        options={{
          title: 'Calendar',
          headerStyle: {
            backgroundColor: '#FF3B30',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={CreateProfileScreen}
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: '#FF3B30',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: true
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <JoinedClubsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar style="light" />
            <NavigationContainer linking={linking}>
              <MainApp />
            </NavigationContainer>
          </View>
        </GestureHandlerRootView>
      </JoinedClubsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activityIndicator: {
    color: '#FF3B30'
  }
});
