import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useJoinedClubs } from '../context/JoinedClubsContext';

type RootStackParamList = {
  Home: undefined;
  Explore: undefined;
  ClubDetails: { club: Club };
  MyClubs: { joinedClub?: Club };
};

type TabParamList = {
  Home: undefined;
  Explore: undefined;
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

interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  image: any;
  memberCount: number;
  meetingTimes: Meeting[];
  calendarLink: string;
  upcomingEvents: Event[];
}

const ClubDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ClubDetailsRouteProp>();
  const { club } = route.params;
  const { joinClub, joinedClubs } = useJoinedClubs();
  const isJoined = joinedClubs.some(c => c.id === club.id);

  const handleAddToCalendar = () => {
    if (club.calendarLink) {
      Linking.openURL(club.calendarLink);
    }
  };

  const handleJoinClub = () => {
    joinClub(club);
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        {club.image && (
          <Image source={typeof club.image === 'string' ? { uri: club.image } : club.image} style={styles.headerImage} />
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
        <Text style={styles.clubCategory}>{club.category}</Text>
        
        <View style={styles.memberCountContainer}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.memberCount}>{club.memberCount} members</Text>
        </View>

        <Text style={styles.description}>{club.description}</Text>

        {/* Meeting Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Times</Text>
          {club.meetingTimes?.map((meeting: Meeting, index: number) => (
            <View key={index} style={styles.meetingTime}>
              <Text style={styles.meetingDay}>{meeting.day}</Text>
              <Text style={styles.meetingDetails}>
                {meeting.time} • {meeting.location}
              </Text>
              <Text style={styles.meetingFrequency}>{meeting.frequency}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {club.upcomingEvents?.map((event: Event, index: number) => (
            <View key={index} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.calendarButton}
            onPress={handleAddToCalendar}
          >
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.calendarButtonText}>Add to Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.joinButton, isJoined && { backgroundColor: '#e6f2ff' }]}
            onPress={handleJoinClub}
            disabled={isJoined}
          >
            <Text style={[styles.joinButtonText, isJoined && { color: '#007AFF' }]}>{isJoined ? 'Joined' : 'Join Club'}</Text>
          </TouchableOpacity>
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
  clubCategory: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meetingTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetingDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  meetingDetails: {
    fontSize: 14,
    color: '#666',
  },
  meetingFrequency: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  calendarButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  joinButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClubDetailsScreen; 