import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

// Mock announcements data
const mockAnnouncements = [
  {
    id: '1',
    clubName: 'Chess Club',
    title: 'Weekly Tournament This Saturday',
    content: 'Join us for our weekly tournament! All skill levels welcome. Prizes for winners!',
    date: '2024-03-30',
  },
  {
    id: '2',
    clubName: 'Photography Club',
    title: 'New Equipment Available',
    content: 'We have new cameras available for member use. Book your slot now!',
    date: '2024-03-29',
  },
  {
    id: '3',
    clubName: 'Chess Club',
    title: 'Strategy Workshop',
    content: 'Learn advanced chess strategies from our club master this Sunday.',
    date: '2024-03-28',
  },
];

const AnnouncementsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { joinedClubs } = useJoinedClubs();

  if (!joinedClubs || joinedClubs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="megaphone-outline" size={80} color="#FF3B30" />
        <Text style={styles.emptyText}>Join clubs to see their announcements</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exploreButtonText}>Explore Clubs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {mockAnnouncements.map((announcement) => (
        <View key={announcement.id} style={styles.announcementCard}>
          <View style={styles.header}>
            <Text style={styles.clubName}>{announcement.clubName}</Text>
            <Text style={styles.date}>{announcement.date}</Text>
          </View>
          <Text style={styles.title}>{announcement.title}</Text>
          <Text style={styles.content}>{announcement.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  announcementCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clubName: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});

export default AnnouncementsScreen; 