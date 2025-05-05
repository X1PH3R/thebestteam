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
import FloatingMenu from './src/components/FloatingMenu';

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
import NoClubsScreen from './src/screens/NoClubsScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  Calendar: undefined;
  Events: undefined;
  Announcements: undefined;
  ClubDetails: { club: any };
  GroupChat: { clubId: string; clubName: string };
  AllMembers: { members: any[]; clubName: string };
  MemberProfile: { member: any };
  CreateProfile: undefined;
  Settings: undefined;
  Profile: undefined;
  ExploreClubs: undefined;
  MyClubs: { joinedClub?: any } | undefined;
  NoClubs: undefined;
};

type TabParamList = {
  Explore: undefined;
  MyClubs: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

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

const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyClubs') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="MyClubs" 
        component={HomeStack}
        options={{
          title: 'My Clubs',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
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

  if (!appIsReady || authLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <NavigationContainer linking={linking}>
        <StatusBar style="auto" />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            presentation: 'card',
          }}
        >
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen 
                name="Calendar" 
                component={EventScreen}
                options={{
                  title: 'Calendar',
                  headerShown: true,
                }}
              />
              <Stack.Screen 
                name="Events" 
                component={EventScreen}
                options={{
                  title: 'Events',
                  headerShown: true,
                }}
              />
              <Stack.Screen 
                name="Announcements" 
                component={AnnouncementsScreen}
                options={{
                  title: 'Announcements',
                  headerShown: true,
                }}
              />
              <Stack.Screen 
                name="NoClubs" 
                component={NoClubsScreen}
                options={{
                  title: 'No Clubs',
                  headerShown: true,
                }}
              />
              <Stack.Screen 
                name="ClubDetails" 
                component={ClubDetailsScreen}
                options={{
                  headerShown: true,
                  presentation: 'modal',
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
              <Stack.Screen 
                name="AllMembers" 
                component={AllMembersScreen}
                options={{
                  title: 'Members',
                  headerShown: true,
                }}
              />
              <Stack.Screen 
                name="MemberProfile" 
                component={MemberProfileScreen}
                options={{
                  headerShown: true,
                }}
              />
            </>
          )}
        </Stack.Navigator>
        {user && <FloatingMenu />}
      </NavigationContainer>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AuthProvider>
          <JoinedClubsProvider>
            <AppContent />
          </JoinedClubsProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    color: '#FF3B30'
  }
});

export default App;
