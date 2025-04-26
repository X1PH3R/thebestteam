import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Clubs: undefined;
  Events: undefined;
  ClubDetails: { club: any };
  MyClubs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample data for joined clubs
const JOINED_CLUBS = [
  {
    id: '1',
    name: 'Photography Club',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Y2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    meetingTimes: [
      { day: 'Monday', time: '3:00 PM', location: 'Room 101' },
      { day: 'Thursday', time: '3:00 PM', location: 'Room 101' }
    ]
  },
  {
    id: '2',
    name: 'Chess Club',
    imageUrl: 'https://images.unsplash.com/photo-1529307473937-262d4b6c0c0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Y2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    meetingTimes: [
      { day: 'Wednesday', time: '4:00 PM', location: 'Room 203' }
    ]
  }
];

const MyClubsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate marked dates for the calendar
  const getMarkedDates = () => {
    const marked: any = {};
    JOINED_CLUBS.forEach(club => {
      club.meetingTimes.forEach(meeting => {
        // This is a simplified version - in a real app, you'd need to handle recurring events
        const date = new Date();
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(meeting.day);
        date.setDate(date.getDate() + (dayOfWeek - date.getDay() + 7) % 7);
        const dateString = date.toISOString().split('T')[0];
        marked[dateString] = { marked: true, dotColor: '#007AFF' };
      });
    });
    return marked;
  };

  const renderClubItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.clubCard}
      onPress={() => navigation.navigate('ClubDetails', { club: item })}
    >
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item.name}</Text>
        <View style={styles.meetingTimes}>
          {item.meetingTimes.map((meeting: any, index: number) => (
            <View key={index} style={styles.meetingTime}>
              <Text style={styles.meetingDay}>{meeting.day}</Text>
              <Text style={styles.meetingDetails}>{meeting.time} at {meeting.location}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            ...getMarkedDates(),
            [selectedDate]: { selected: true, marked: true, dotColor: '#007AFF' }
          }}
          theme={{
            selectedDayBackgroundColor: '#007AFF',
            todayTextColor: '#007AFF',
            dotColor: '#007AFF',
            arrowColor: '#007AFF',
          }}
        />
      </View>
      
      <View style={styles.clubsContainer}>
        <Text style={styles.sectionTitle}>My Clubs</Text>
        <FlatList
          data={JOINED_CLUBS}
          renderItem={renderClubItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.clubsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clubsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  clubsList: {
    paddingBottom: 20,
  },
  clubCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meetingTimes: {
    gap: 8,
  },
  meetingTime: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
  },
  meetingDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  meetingDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default MyClubsScreen; 