import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';
import { useJoinedClubs } from '../context/JoinedClubsContext';
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
            dotColor: '#FF3B30'
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
                dotColor: '#FF3B30'
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
              location: club.location,
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Club Events Calendar</Text>
        <Text style={styles.subHeaderText}>View all your club events and meetings in one place</Text>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
          <Text style={styles.legendText}>Club Events & Meetings</Text>
        </View>
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#E5E5E5',
          selectedDayTextColor: '#000000',
          todayTextColor: '#FF3B30',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#FF3B30',
          selectedDotColor: '#FF3B30',
          arrowColor: '#FF3B30',
          monthTextColor: '#2d4150',
          indicatorColor: '#FF3B30',
        }}
        markingType="simple"
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}
        enableSwipeMonths={true}
        hideExtraDays={true}
        showWeekNumbers={false}
        firstDay={1}
      />

      {selectedDate && (
        <View style={styles.eventList}>
          <Text style={styles.selectedDateText}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>

          {eventsForSelectedDate.length > 0 ? (
            <>
              <View style={styles.summaryTile}>
                <Text style={styles.summaryTitle}>Club Meetings Today</Text>
                {[...new Set(eventsForSelectedDate.map(event => event.clubName))].map((clubName, index) => (
                  <View
                    key={index}
                    style={styles.clubMeetingRow}
                  >
                    <View style={styles.clubIndicator} />
                    <Text style={styles.clubMeetingText}>
                      {clubName ?? 'Unnamed Club'}
                    </Text>
                    <Text style={styles.meetingTime}>
                      {eventsForSelectedDate
                        .find(event => event.clubName === clubName)?.date
                        ? new Date(eventsForSelectedDate.find(event => event.clubName === clubName)!.date)
                            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </Text>
                  </View>
                ))}
              </View>

              {eventsForSelectedDate.map((event, index) => (
                <View 
                  key={index}
                  style={[
                    styles.eventCard,
                    event.isMeeting && styles.meetingCard
                  ]}
                >
                  <Text style={styles.eventName}>{event.title ?? 'Untitled Event'}</Text>
                  <Text style={styles.clubName}>{event.clubName ?? 'Unnamed Club'}</Text>
                  <Text style={styles.eventTime}>
                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  {event.isMeeting && (
                    <View style={styles.meetingBadge}>
                      <Text style={styles.meetingBadgeText}>Regular Meeting</Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.noEventsText}>No events scheduled for this day</Text>
          )}
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
    backgroundColor: '#FF3B30',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  calendar: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventList: {
    padding: 15,
  },
  selectedDateText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2d4150',
  },
  clubsForDayText: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  clubsForDayLabel: {
    color: '#666',
  },
  clubsList: {
    color: '#007AFF',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  meetingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2d4150',
  },
  clubName: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  meetingBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#28CD41',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  meetingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryTile: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 12,
  },
  clubMeetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  clubIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28CD41',
    marginRight: 10,
  },
  clubMeetingText: {
    flex: 1,
    fontSize: 16,
    color: '#2d4150',
    fontWeight: '500',
  },
  meetingTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default EventScreen; 