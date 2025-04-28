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
import { RootStackParamList } from '../types';
import { Club } from '../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user } = useAuth();
  const { joinedClubs } = useJoinedClubs();
  const [userClubs, setUserClubs] = useState<Club[]>([]);

  useEffect(() => {
    if (joinedClubs) {
      setUserClubs(joinedClubs);
    }
  }, [joinedClubs]);

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={user.photoURL ? { uri: user.photoURL } : undefined}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="settings-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.displayName}>{user.displayName || 'Anonymous'}</Text>
        <Text style={styles.bio}>{user.description || 'No bio available'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userClubs.length}</Text>
            <Text style={styles.statLabel}>Clubs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.year || 'N/A'}</Text>
            <Text style={styles.statLabel}>Year</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.major || 'N/A'}</Text>
            <Text style={styles.statLabel}>Major</Text>
          </View>
        </View>

        <View style={styles.socialLinks}>
          {user.instagram && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMediaPress(user.instagram)}
            >
              <Ionicons name="logo-instagram" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
          {user.linkedin && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMediaPress(user.linkedin)}
            >
              <Ionicons name="logo-linkedin" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
          {user.twitter && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMediaPress(user.twitter)}
            >
              <Ionicons name="logo-twitter" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.clubsSection}>
        <Text style={styles.sectionTitle}>My Clubs</Text>
        <View style={styles.clubsGrid}>
          {userClubs.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={styles.clubItem}
              onPress={() => handleClubPress(club)}
            >
              <Image
                source={club.image ? { uri: club.image } : undefined}
                style={styles.clubImage}
              />
              <Text style={styles.clubName} numberOfLines={2}>
                {club.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    padding: 10,
  },
  clubsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  clubsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  clubItem: {
    width: (Dimensions.get('window').width - 60) / 3,
    marginBottom: 15,
  },
  clubImage: {
    width: '100%',
    height: (Dimensions.get('window').width - 60) / 3,
    borderRadius: 5,
  },
  clubName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ProfileScreen; 