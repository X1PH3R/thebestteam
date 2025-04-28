import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { useTheme } from '../context/ThemeContext';
import { Club, Event, User } from '../types';

type RootStackParamList = {
  Home: undefined;
  Clubs: undefined;
  Events: undefined;
  ClubDetails: { club: Club };
  ExploreClubs: undefined;
  MemberProfile: { member: User };
  MyClubs: undefined;
  GroupChat: { clubId: string; clubName: string };
  EventAttendance: { event: Event };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MarkedDates = {
  [date: string]: {
    marked: boolean;
    dotColor?: string;
    selected?: boolean;
    dots?: Array<{
      key: string;
      color: string;
      selectedDotColor?: string;
    }>;
    customStyles?: {
      container: {
        backgroundColor: string;
        borderRadius: number;
      };
      text: {
        color: string;
      };
    };
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
  };
};

interface CalendarEvent extends Event {
  clubName: string;
  isMeeting?: boolean;
}

const EventScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { joinedClubs } = useJoinedClubs();
  const { theme, isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CalendarEvent[]>([]);

  // Get the next occurrence of a weekday from a given date
  const getNextWeekday = (date: Date, dayName: string) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(dayName.toLowerCase());
    const currentDay = date.getDay();
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) daysUntilTarget += 7;
    
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + daysUntilTarget);
    // Set time to midnight UTC to avoid timezone issues
    nextDate.setUTCHours(0, 0, 0, 0);
    return nextDate;
  };

  // Create marked dates object for calendar
  const getMarkedDates = () => {
    const markedDates: MarkedDates = {};
    const today = new Date();
    // Set time to midnight UTC to avoid timezone issues
    today.setUTCHours(0, 0, 0, 0);
    const threeMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    
    // First, mark all dates with the selection style
    let currentDate = new Date(today);
    while (currentDate <= threeMonthsFromNow) {
      const dateString = currentDate.toISOString().split('T')[0];
      markedDates[dateString] = {
        marked: false,
        selected: dateString === selectedDate
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Then, add dots for events and meetings
    joinedClubs.forEach(club => {
      // Add special events
      club.events.forEach(event => {
        const eventDate = new Date(event.date);
        // Set time to midnight UTC to avoid timezone issues
        eventDate.setUTCHours(0, 0, 0, 0);
        const eventDateString = eventDate.toISOString().split('T')[0];
        if (markedDates[eventDateString]) {
          markedDates[eventDateString] = {
            ...markedDates[eventDateString],
            marked: true,
            dotColor: theme.primary
          };
        }
      });

      // Add regular meetings
      if (club.meetings) {
        currentDate = new Date(today);
        while (currentDate <= threeMonthsFromNow) {
          club.meetings.forEach(meeting => {
            const nextMeeting = getNextWeekday(currentDate, meeting.day);
            const meetingDateString = nextMeeting.toISOString().split('T')[0];
            if (markedDates[meetingDateString]) {
              markedDates[meetingDateString] = {
                ...markedDates[meetingDateString],
                marked: true,
                dotColor: theme.primary
              };
            }
          });
          currentDate.setDate(currentDate.getDate() + 7);
        }
      }
    });

    return markedDates;
  };

  // Get events and meetings for a specific date
  const getEventsForDate = (date: string) => {
    const events: CalendarEvent[] = [];
    const selectedDateTime = new Date(date);
    const dayName = selectedDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    joinedClubs.forEach(club => {
      // Add special events
      club.events.forEach(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        if (eventDate === date) {
          events.push({ ...event, clubName: club.name });
        }
      });

      // Add regular meetings
      if (club.meetings) {
        club.meetings.forEach(meeting => {
          if (meeting.day.toLowerCase() === dayName) {
            events.push({
              id: `meeting-${club.id}`,
              title: `${club.name} Regular Meeting`,
              description: `Regular ${meeting.frequency} meeting at ${meeting.time}`,
              date: `${date}T${meeting.time}`,
              location: club.location || {
                name: 'Location TBD',
                latitude: 0,
                longitude: 0
              },
              attendees: [],
              clubName: club.name,
              isMeeting: true
            });
          }
        });
      }
    });

    // Sort by time
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const onDayPress = (day: any) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    setEventsForSelectedDate(getEventsForDate(dateString));
  };

  // Add handleEventClick function
  const handleEventClick = (event: CalendarEvent) => {
    const club = joinedClubs.find(c => c.name === event.clubName);
    if (club) {
      navigation.navigate('ClubDetails', { club });
    } else {
      console.warn('Club not found for event:', event);
    }
  };

  // Get calendar theme based on current theme
  const getCalendarTheme = () => ({
    backgroundColor: theme.background,
    calendarBackground: theme.background,
    textSectionTitleColor: isDarkMode ? '#E0E0E0' : theme.textSecondary,
    selectedDayBackgroundColor: theme.primary,
    selectedDayTextColor: theme.background,
    todayTextColor: theme.primary,
    dayTextColor: isDarkMode ? '#FFFFFF' : theme.text,
    textDisabledColor: isDarkMode ? '#666666' : theme.textSecondary,
    dotColor: theme.primary,
    selectedDotColor: theme.background,
    arrowColor: theme.primary,
    monthTextColor: isDarkMode ? '#FFFFFF' : theme.text,
    indicatorColor: theme.primary,
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
    'stylesheet.calendar.header': {
      week: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
      dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: 32,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: isDarkMode ? '#E0E0E0' : theme.textSecondary,
      },
    },
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: isDarkMode ? '#FFFFFF' : theme.text }]}>Club Events Calendar</Text>
        <Text style={[styles.subHeaderText, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>View all your club events and meetings in one place</Text>
      </View>
      
      <View style={[styles.calendarContainer, { backgroundColor: theme.surface }]}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          theme={getCalendarTheme()}
          style={styles.calendar}
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.legendText, { color: isDarkMode ? '#FFFFFF' : theme.text }]}>Events & Meetings</Text>
        </View>
      </View>

      {selectedDate && (
        <View style={[styles.eventsContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.eventsTitle, { color: isDarkMode ? '#FFFFFF' : theme.text }]}>
            Events for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: theme.background }]}
                onPress={() => handleEventClick(event)}
              >
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventTitle, { color: isDarkMode ? '#FFFFFF' : theme.text }]}>{event.title}</Text>
                  <Text style={[styles.eventTime, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>
                    {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={[styles.eventClub, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>{event.clubName}</Text>
                <Text style={[styles.eventLocation, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>
                  {event.location.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noEventsText, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>
              No events scheduled for this day
            </Text>
          )}
        </View>
      )}
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
  },
  calendarContainer: {
    margin: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendar: {
    borderRadius: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  eventsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
  },
  eventClub: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EventScreen; 