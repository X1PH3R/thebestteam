import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useJoinedClubs } from '../context/JoinedClubsContext';

type RootStackParamList = {
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

type MenuScreens = 'Calendar' | 'Events' | 'Announcements' | 'GroupChat';

type FloatingMenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  screen: MenuScreens;
  requiresClub?: boolean;
};

const BUTTON_SIZE = 60;
const SPACING = 12; // Gap between buttons

const MENU_ITEMS: FloatingMenuItem[] = [
  { icon: 'chatbubbles-outline', screen: 'GroupChat', requiresClub: true },
  { icon: 'calendar-outline', screen: 'Calendar' },
  { icon: 'time-outline', screen: 'Events' },
  { icon: 'megaphone-outline', screen: 'Announcements' },
];

const FloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const { joinedClubs } = useJoinedClubs();

  // Hide FAB in GroupChat screen
  const state = navigation.getState();
  const currentRoute = state?.routes?.[state?.index ?? 0];
  if (currentRoute?.name === 'GroupChat') {
    return null;
  }

  // Close menu when screen loses focus
  useEffect(() => {
    if (!isFocused && isOpen) {
      setIsOpen(false);
      Animated.spring(animation, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused]);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const menuItemStyle = (index: number) => {
    const offset = BUTTON_SIZE + SPACING;
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -offset * (index + 1)],
    });

    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  };

  const handleNavigation = (item: FloatingMenuItem) => {
    setIsOpen(false);
    Animated.spring(animation, {
      toValue: 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      if (item.screen === 'GroupChat') {
        if (joinedClubs && joinedClubs.length > 0) {
          const firstClub = joinedClubs[0];
          if ('id' in firstClub && 'name' in firstClub) {
            navigation.navigate('GroupChat', {
              clubId: firstClub.id,
              clubName: firstClub.name
            });
          }
        } else {
          navigation.navigate('NoClubs');
        }
      } else if (!item.requiresClub) {
        navigation.dispatch(
          CommonActions.navigate({
            name: item.screen
          })
        );
      }
    });
  };

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {MENU_ITEMS.map((item, index) => (
        <Animated.View
          key={item.screen}
          style={[styles.menuItem, menuItemStyle(index)]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={() => handleNavigation(item)}
            activeOpacity={0.8}
          >
            <Ionicons name={item.icon} size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      ))}
      <TouchableOpacity
        style={[styles.button, styles.mainButton]}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isOpen ? 'close-outline' : 'menu-outline'}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: '#FF3B30',
    zIndex: 100,
  },
  menuButton: {
    backgroundColor: '#FF3B30',
  },
  menuItem: {
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    zIndex: 99,
  },
});

export default FloatingMenu; 