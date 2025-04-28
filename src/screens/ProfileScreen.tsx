import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types';
import { Club } from '../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user } = useAuth();
  const { joinedClubs } = useJoinedClubs();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [userClubs, setUserClubs] = useState<Club[]>([]);

  useEffect(() => {
    if (joinedClubs) {
      setUserClubs(joinedClubs);
    }
  }, [joinedClubs]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={[styles.themeToggle, { backgroundColor: theme.surface }]}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, isDarkMode, toggleTheme]);

  const handleEditProfile = () => {
    navigation.navigate('CreateProfile');
  };

  const handleClubPress = (club: Club) => {
    navigation.navigate('ClubDetails', { club });
  };

  const handleSocialMediaPress = (url: string | undefined) => {
    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      Linking.openURL(url);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={user.photoURL ? { uri: user.photoURL } : undefined}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={24} color={theme.primary} />
            <Text style={[styles.editText, { color: theme.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.displayName, { color: theme.text }]}>{user.displayName || 'Anonymous'}</Text>
        <Text style={[styles.bio, { color: theme.textSecondary }]}>{user.description || 'No bio available'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{userClubs.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Clubs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{user.year || 'N/A'}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Year</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{user.major || 'N/A'}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Major</Text>
          </View>
        </View>

        <View style={styles.socialLinks}>
          {user.instagram && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMediaPress(user.instagram)}
            >
              <Ionicons name="logo-instagram" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
          {user.linkedin && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMediaPress(user.linkedin)}
            >
              <Ionicons name="logo-linkedin" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
          {user.twitter && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMediaPress(user.twitter)}
            >
              <Ionicons name="logo-twitter" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>My Clubs</Text>
        {userClubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={styles.clubItem}
            onPress={() => handleClubPress(club)}
          >
            <Image source={{ uri: club.image }} style={styles.clubImage} />
            <View style={styles.clubInfo}>
              <Text style={[styles.clubName, { color: theme.text }]}>{club.name}</Text>
              <Text style={[styles.clubDescription, { color: theme.textSecondary }]}>
                {club.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editText: {
    fontSize: 14,
    marginLeft: 4,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    marginHorizontal: 10,
  },
  section: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  clubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  clubImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clubDescription: {
    fontSize: 14,
  },
  themeToggle: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ProfileScreen; 