import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { Club, Event } from '../types';

type RootStackParamList = {
  Home: undefined;
  Clubs: undefined;
  Events: undefined;
  ClubDetails: { club: Club };
  ExploreClubs: undefined;
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
    return nextDate;
  };

  // Create marked dates object for calendar
  const getMarkedDates = () => {
    const markedDates: MarkedDates = {};
    const today = new Date();
    const threeMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    
    // Mark special events
    joinedClubs.forEach(club => {
      // Add special events
      club.events.forEach(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        if (!markedDates[eventDate]) {
          markedDates[eventDate] = {
            marked: true,
            dots: [{
              key: 'event',
              color: '#007AFF'
            }],
            selected: eventDate === selectedDate
          };
        }
      });

      // Add regular meetings
      if (club.meetings) {
        let currentDate = new Date(today);
        
        while (currentDate <= threeMonthsFromNow) {
          club.meetings.forEach(meeting => {
            const nextMeeting = getNextWeekday(currentDate, meeting.day);
            const meetingDate = nextMeeting.toISOString().split('T')[0];
            
            if (!markedDates[meetingDate]) {
              markedDates[meetingDate] = {
                marked: true,
                dots: [{
                  key: 'meeting',
                  color: '#28CD41'
                }],
                selected: meetingDate === selectedDate
              };
            } else if (markedDates[meetingDate].dots) {
              markedDates[meetingDate].dots?.push({
                key: 'meeting',
                color: '#28CD41'
              });
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Club Events Calendar</Text>
        <Text style={styles.subHeaderText}>View all your club events and meetings in one place</Text>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
          <Text style={styles.legendText}>Special Events</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#28CD41' }]} />
          <Text style={styles.legendText}>Regular Meetings</Text>
        </View>
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#007AFF',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          monthTextColor: '#2d4150',
          indicatorColor: '#007AFF',
        }}
        markingType="multi-dot"
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}
        enableSwipeMonths={true}
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
                  <TouchableOpacity
                    key={index}
                    style={styles.clubMeetingRow}
                    onPress={() => {
                      const club = joinedClubs.find(c => c.name === clubName);
                      if (club) {
                        navigation.navigate('ExploreClubs');
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.clubIndicator} />
                    <Text style={styles.clubMeetingText}>
                      {clubName}
                    </Text>
                    <Text style={styles.meetingTime}>
                      {eventsForSelectedDate
                        .find(event => event.clubName === clubName)?.date
                        ? new Date(eventsForSelectedDate.find(event => event.clubName === clubName)!.date)
                            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {eventsForSelectedDate.map((event, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.eventCard,
                    event.isMeeting && styles.meetingCard
                  ]}
                  onPress={() => {
                    const club = joinedClubs.find(c => c.name === event.clubName);
                    if (club) {
                      navigation.navigate('ClubDetails', { club });
                    }
                  }}
                >
                  <Text style={styles.eventName}>{event.title}</Text>
                  <Text style={styles.clubName}>{event.clubName}</Text>
                  <Text style={styles.eventTime}>
                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  {event.isMeeting && (
                    <View style={styles.meetingBadge}>
                      <Text style={styles.meetingBadgeText}>Regular Meeting</Text>
                    </View>
                  )}
                </TouchableOpacity>
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
    backgroundColor: '#007AFF',
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
    borderLeftColor: '#28CD41',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2d4150',
  },
  clubName: {
    fontSize: 16,
    color: '#007AFF',
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