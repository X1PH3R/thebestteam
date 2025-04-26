import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useJoinedClubs } from '../context/JoinedClubsContext';

type RootStackParamList = {
  MyClubs: { joinedClub?: any };
  Explore: undefined;
  ClubDetails: { club: any };
};

type TabParamList = {
  Home: undefined;
  Explore: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<TabParamList>;
type MyClubsRouteProp = RouteProp<RootStackParamList, 'MyClubs'>;

interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  image: any;
  memberCount: number;
  meetingTimes: Array<{
    day: string;
    time: string;
    location: string;
    frequency: string;
  }>;
  calendarLink: string;
  upcomingEvents: Array<{
    title: string;
    date: string;
    description: string;
  }>;
}

const MyClubsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MyClubsRouteProp>();
  const { joinedClubs } = useJoinedClubs();

  // Handle new club from navigation params
  React.useEffect(() => {
    if (route.params?.joinedClub) {
      // This is a placeholder implementation. In a real application, you might want to add the new club to the context
    }
  }, [route.params?.joinedClub]);

  const handleExplorePress = () => {
    // Navigate to the Explore tab
    navigation.navigate('Explore');
  };

  if (joinedClubs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={80} color="#007AFF" />
        <Text style={styles.emptyTitle}>No Clubs Yet</Text>
        <Text style={styles.emptyText}>Join clubs to see them here</Text>
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={handleExplorePress}
        >
          <Text style={styles.exploreButtonText}>Explore Clubs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Clubs</Text>
      </View>
      <View style={styles.clubList}>
        {joinedClubs.map((club, index) => (
          <TouchableOpacity
            key={index}
            style={styles.clubCard}
            onPress={() => navigation.navigate('ClubDetails', { club })}
          >
            <Image source={typeof club.image === 'string' ? { uri: club.image } : club.image} style={styles.clubImage} />
            <View style={styles.clubInfo}>
              <Text style={styles.clubName}>{club.name}</Text>
              <Text style={styles.clubCategory}>{club.category}</Text>
              <Text style={styles.clubDescription} numberOfLines={2}>
                {club.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {joinedClubs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
          {joinedClubs.map((club) => (
            (club.meetingTimes ?? []).map((meeting, idx) => (
              <View key={club.id + '-meeting-' + idx} style={styles.eventCard}>
                <Text style={styles.eventTitle}>{club.name}</Text>
                <Text style={styles.eventDate}>{meeting.day} • {meeting.time}</Text>
                <Text style={styles.eventDescription}>{meeting.location} ({meeting.frequency})</Text>
                {club.calendarLink && (
                  <TouchableOpacity onPress={() => Linking.openURL(club.calendarLink)} style={styles.googleCalendarButton}>
                    <Ionicons name="logo-google" size={16} color="#fff" />
                    <Text style={styles.googleCalendarButtonText}>Add to Google Calendar</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ))}
        </View>
      )}
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
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  clubList: {
    padding: 20,
  },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  clubInfo: {
    padding: 16,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clubCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  calendarButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 8,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  googleCalendarButton: {
    backgroundColor: '#34A853',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
    marginTop: 8,
  },
  googleCalendarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default MyClubsScreen; 