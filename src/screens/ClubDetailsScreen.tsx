import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import type { Club, User } from '../types';

type RootStackParamList = {
  Home: undefined;
  Explore: undefined;
  ClubDetails: { club: Club };
  MyClubs: { joinedClub?: Club };
  MemberProfile: { member: User };
  AllMembers: { members: User[]; clubName: string };
};

type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<TabParamList>;
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
    uid: '1',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Computer Science',
    year: '2024'
  },
  { 
    id: '2',
    email: 'jane.smith@example.com',
    displayName: 'Jane Smith',
    uid: '2',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Business',
    year: '2025'
  },
  { 
    id: '3',
    email: 'mike.johnson@example.com',
    displayName: 'Mike Johnson',
    uid: '3',
    photoURL: 'https://via.placeholder.com/50',
    major: 'Engineering',
    year: '2023'
  },
  { 
    id: '4',
    email: 'sarah.wilson@example.com',
    displayName: 'Sarah Wilson',
    uid: '4',
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
    navigation.navigate('Home');
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
            navigation.navigate('Home');
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
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        {club.image && !imageError ? (
          <Image
            source={{ uri: club.image }}
            style={styles.headerImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.headerImage, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}> 
            <Ionicons name="image-outline" size={64} color="#bbb" />
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
        <Text style={styles.clubName}>{club.name}</Text>
        <Text style={styles.clubLocation}>{club.location.name}</Text>
        
        <View style={styles.memberCountContainer}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.memberCount}>{club.members.length} members</Text>
        </View>

        <Text style={styles.description}>{club.description}</Text>

        <View style={styles.membersContainer}>
          <View style={styles.memberHeader}>
            <Text style={styles.sectionTitle}>Club Members</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllMembers}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.membersList}>
            {members.slice(0, 3).map((member) => (
              <TouchableOpacity 
                key={member.id} 
                style={styles.memberCard}
                onPress={() => navigation.navigate('MemberProfile', { member })}
              >
                <Image
                  source={{ uri: member.photoURL || 'https://via.placeholder.com/50' }}
                  style={styles.memberImage}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.displayName}</Text>
                  <Text style={styles.memberRole}>{member.major || 'Member'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Join/Leave Button */}
        {isJoined ? (
          <TouchableOpacity 
            style={styles.leaveButton}
            onPress={handleLeaveClub}
          >
            <Text style={styles.leaveButtonText}>Leave Club</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={handleJoinClub}
          >
            <Text style={styles.joinButtonText}>Join Club</Text>
          </TouchableOpacity>
        )}

        {/* Calendar Button */}
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={handleAddToCalendar}
        >
          <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          <Text style={styles.calendarButtonText}>Add to Calendar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#007AFF',
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
    borderColor: '#007AFF',
  },
  calendarButtonText: {
    color: '#007AFF',
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
    color: '#007AFF',
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