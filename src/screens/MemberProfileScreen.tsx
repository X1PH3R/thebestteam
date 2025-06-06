import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Linking,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Club, User } from '../types';
import { CLUBS } from './ClubScreen';

type RootStackParamList = {
  MyClubs: undefined;
  ClubDetails: { club: Club };
  Events: undefined;
  ExploreClubs: undefined;
  MemberProfile: { member: User };
  CreateProfile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MemberProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { member } = route.params as { member: User };

  // Find all clubs where this member is a participant
  const memberClubs = CLUBS.filter((club: Club) => 
    club.members.some((m: User) => m.id === member.id) || 
    club.admins.some((a: User) => a.id === member.id)
  );

  const handleSocialLink = async (url: string | undefined) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening social link:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={{ uri: member.photoURL || 'https://via.placeholder.com/150' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          <Text style={styles.memberName}>{member.displayName}</Text>
          <Text style={styles.memberRole}>{member.major} • Class of {member.year}</Text>
        </View>

        {/* Clubs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clubs</Text>
          {memberClubs.length > 0 ? (
            <View style={styles.clubsList}>
              {memberClubs.map((club: Club) => (
                <TouchableOpacity
                  key={club.id}
                  style={styles.clubCard}
                  onPress={() => navigation.navigate('ClubDetails', { club })}
                >
                  <Image
                    source={{ uri: club.image }}
                    style={styles.clubImage}
                  />
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{club.name}</Text>
                    <Text style={styles.clubDescription} numberOfLines={2}>
                      {club.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noClubsText}>Not a member of any clubs yet.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{member.description || 'No description available.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL(`mailto:${member.email}`)}
          >
            <Ionicons name="mail-outline" size={24} color="#FF3B30" />
            <Text style={styles.contactText}>{member.email}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          {member.instagram && (
            <TouchableOpacity 
              style={styles.socialItem}
              onPress={() => handleSocialLink(member.instagram)}
            >
              <Ionicons name="logo-instagram" size={24} color="#E1306C" />
              <Text style={styles.socialText}>@{member.instagram}</Text>
            </TouchableOpacity>
          )}
          {member.linkedin && (
            <TouchableOpacity 
              style={styles.socialItem}
              onPress={() => handleSocialLink(member.linkedin)}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
              <Text style={styles.socialText}>{member.linkedin}</Text>
            </TouchableOpacity>
          )}
          {member.twitter && (
            <TouchableOpacity 
              style={styles.socialItem}
              onPress={() => handleSocialLink(member.twitter)}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              <Text style={styles.socialText}>@{member.twitter}</Text>
            </TouchableOpacity>
          )}
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
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  content: {
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  memberName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  memberRole: {
    fontSize: 18,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  clubsList: {
    gap: 12,
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  clubImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
  },
  noClubsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default MemberProfileScreen; 