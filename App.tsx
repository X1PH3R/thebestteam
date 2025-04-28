/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
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
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

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
import AllMembersScreen from './src/screens/AllMembersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AnnouncementsScreen from './src/screens/AnnouncementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

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
  GroupChat: { clubId: string; clubName: string };
  AllMembers: { members: any[]; clubName: string };
  Profile: undefined;
  Settings: undefined;
  Main: undefined;
};

type TabParamList = {
  Home: undefined;
  Clubs: undefined;
  Calendar: undefined;
  Announcements: undefined;
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

const HomeStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
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
      <Stack.Screen 
        name="AllMembers" 
        component={AllMembersScreen}
        options={{
          title: 'Members',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="GroupChat" 
        component={GroupChatScreen}
        options={{
          title: 'Group Chat',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const ExploreStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
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
      <Stack.Screen 
        name="AllMembers" 
        component={AllMembersScreen}
        options={{
          title: 'Members',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="GroupChat" 
        component={GroupChatScreen}
        options={{
          title: 'Group Chat',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

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

const ProfileStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Profile',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen 
        name="CreateProfile" 
        component={CreateProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="ClubDetails" 
        component={ClubDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const MainApp = () => {
  const { theme } = useTheme();
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
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
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
          title: 'My Clubs',
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
        name="Announcements" 
        component={AnnouncementsScreen}
        options={{
          title: 'Announcements',
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
        component={ProfileStack}
        options={{
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AuthProvider>
          <JoinedClubsProvider>
            <NavigationContainer linking={linking}>
              <StatusBar style="auto" />
              <Stack.Navigator>
                <Stack.Screen 
                  name="Main" 
                  component={MainApp}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="AllMembers" 
                  component={AllMembersScreen}
                  options={{
                    title: 'Members',
                    headerShown: true,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </JoinedClubsProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

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
