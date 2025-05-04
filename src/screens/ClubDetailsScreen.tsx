import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { useTheme } from '../context/ThemeContext';
import type { Club, User } from '../types';
import { CommonActions } from '@react-navigation/native';

type RootStackParamList = {
  MainTabs: undefined;
  Calendar: undefined;
  Events: undefined;
  Announcements: undefined;
  ClubDetails: { club: Club };
  GroupChat: { clubId: string; clubName: string };
  AllMembers: { members: User[]; clubName: string };
  MemberProfile: { member: User };
  CreateProfile: undefined;
  Settings: undefined;
  Profile: undefined;
  ExploreClubs: undefined;
  MyClubs: { joinedClub?: Club } | undefined;
};

type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ClubDetailsRouteProp = RouteProp<RootStackParamList, 'ClubDetails'>;

interface Meeting {
  day: string;
  time: string;
  location: string;
  frequency: string;
}

interface Event {
  title: string;
  date: string;
  description: string;
}

// Sample member data with the correct User type
const sampleMembers: User[] = [
  { 
    id: '1',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Computer Science',
    year: '2024'
  },
  { 
    id: '2',
    email: 'jane.smith@example.com',
    displayName: 'Jane Smith',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Business',
    year: '2025'
  },
  { 
    id: '3',
    email: 'mike.johnson@example.com',
    displayName: 'Mike Johnson',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Engineering',
    year: '2023'
  },
  { 
    id: '4',
    email: 'sarah.wilson@example.com',
    displayName: 'Sarah Wilson',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Psychology',
    year: '2024'
  },
];

const ClubDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ClubDetailsRouteProp>();
  const { club } = route.params;
  const { joinClub, leaveClub, joinedClubs } = useJoinedClubs();
  const { theme } = useTheme();
  const isJoined = joinedClubs.some(c => c.id === club.id);
  const [imageError, setImageError] = useState(false);
  const members = club.members && Array.isArray(club.members) && club.members.length > 0 ? club.members : sampleMembers;

  const handleAddToCalendar = () => {
    if (club.calendarLink) {
      Linking.openURL(club.calendarLink);
    }
  };

  const handleJoinClub = () => {
    joinClub(club);
  };

  const handleLeaveClub = () => {
    Alert.alert(
      'Leave Club',
      'Are you sure you want to leave this club?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            leaveClub(club.id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleViewAllMembers = () => {
    navigation.navigate('AllMembers', {
      members: members,
      clubName: club.name
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        {club.image && !imageError ? (
          <Image
            source={{ uri: club.image }}
            style={styles.headerImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.headerImage, { backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center' }]}> 
            <Ionicons name="image-outline" size={64} color={theme.textSecondary} />
          </View>
        )}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Club Info */}
      <View style={styles.content}>
        <Text style={[styles.clubName, { color: theme.text }]}>{club.name}</Text>
        {club.location && (
          <Text style={[styles.clubLocation, { color: theme.textSecondary }]}>{club.location.name}</Text>
        )}
        
        <View style={styles.memberCountContainer}>
          <Ionicons name="people-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.memberCount, { color: theme.textSecondary }]}>{club.members.length} members</Text>
        </View>

        <Text style={[styles.description, { color: theme.text }]}>{club.description}</Text>

        <View style={[styles.membersContainer, { backgroundColor: theme.surface }]}>
          <View style={styles.memberHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Club Members</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllMembers}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.membersList}>
            {members.slice(0, 3).map((member) => (
              <TouchableOpacity 
                key={member.id} 
                style={[styles.memberCard, { backgroundColor: theme.background }]}
                onPress={() => navigation.navigate('MemberProfile', { member })}
              >
                <Image
                  source={{ uri: member.photoURL || 'https://via.placeholder.com/50' }}
                  style={styles.memberImage}
                />
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: theme.text }]}>{member.displayName}</Text>
                  <Text style={[styles.memberRole, { color: theme.textSecondary }]}>{member.major || 'Member'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Join/Leave Button */}
        {isJoined ? (
          <TouchableOpacity 
            style={[styles.leaveButton, { backgroundColor: theme.error }]}
            onPress={handleLeaveClub}
          >
            <Text style={styles.leaveButtonText}>Leave Club</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.joinButton, { backgroundColor: theme.primary }]}
            onPress={handleJoinClub}
          >
            <Text style={styles.joinButtonText}>Join Club</Text>
          </TouchableOpacity>
        )}

        {/* Calendar Button */}
        <TouchableOpacity 
          style={[styles.calendarButton, { borderColor: theme.primary }]}
          onPress={handleAddToCalendar}
        >
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />
          <Text style={[styles.calendarButtonText, { color: theme.primary }]}>Add to Calendar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  clubName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  clubLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  memberCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberCount: {
    marginLeft: 8,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  membersContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  calendarButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ClubDetailsScreen; 