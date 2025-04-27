import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Club, User, Event } from '../types';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CreateProfile: undefined;
  MyClubs: undefined;
  ExploreClubs: undefined;
  ClubDetails: { club: Club };
  GroupChat: { clubId: string; clubName: string };
  EventAttendance: { event: Event };
  MemberProfile: { member: User };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CLUBS: Club[] = [
  {
    id: '1',
    name: 'Photography Club',
    description: 'Join us to explore the world through your lens!',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Q2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    members: [],
    events: [],
    location: {
      name: 'Room 101',
      latitude: 0,
      longitude: 0
    },
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Photography+Club+Meeting&details=Weekly+club+meeting&location=Room+101',
    meetings: [
      {
        day: 'Monday',
        time: '15:00',
        frequency: 'weekly'
      }
    ]
  },
  {
    id: '2',
    name: 'Chess Club',
    description: 'Challenge your mind and make new friends!',
    image: 'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=800&q=80',
    members: [],
    events: [],
    location: {
      name: 'Room 203',
      latitude: 0,
      longitude: 0
    },
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Chess+Club+Meeting&details=Weekly+club+meeting&location=Room+203',
    meetings: [
      {
        day: 'Wednesday',
        time: '16:00',
        frequency: 'weekly'
      }
    ]
  },
  {
    id: '3',
    name: 'Hiking Club',
    description: 'Explore nature and stay active!',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Q2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    members: [],
    events: [],
    location: {
      name: 'Various Locations',
      latitude: 0,
      longitude: 0
    },
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Hiking+Club+Meeting&details=Weekly+hike&location=Various+Locations',
    meetings: [
      {
        day: 'Saturday',
        time: '09:00',
        frequency: 'biweekly'
      }
    ]
  },
  {
    id: '4',
    name: 'Book Club',
    description: 'Share your love for reading!',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Q2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    members: [],
    events: [],
    location: {
      name: 'Library Room A',
      latitude: 0,
      longitude: 0
    },
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Book+Club+Meeting&details=Monthly+book+discussion&location=Library+Room+A',
    meetings: [
      {
        day: 'Friday',
        time: '17:00',
        frequency: 'monthly'
      }
    ]
  }
];

const ExploreScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef<TextInput>(null);

  const categories = ['All', 'Arts', 'Sports', 'Academic', 'Social'];

  useFocusEffect(
    React.useCallback(() => {
      setSearchQuery('');
      setSelectedCategory('All');
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }, [])
  );

  const getClubCategory = (club: Club) => {
    // Derive category from club name or description for filtering
    const lowerName = club.name.toLowerCase();
    const lowerDesc = club.description.toLowerCase();
    
    if (lowerName.includes('photo') || lowerDesc.includes('art')) return 'Arts';
    if (lowerName.includes('chess')) return 'Academic';
    if (lowerName.includes('hiking')) return 'Sports';
    if (lowerName.includes('book')) return 'Social';
    return 'Social'; // Default category
  };

  const filteredClubs = CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || getClubCategory(club) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Clubs</Text>
        <Text style={styles.subtitle}>Find your next adventure</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search clubs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.clubList}>
        {filteredClubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={styles.clubCard}
            onPress={() => {
              console.log('Attempting to navigate...');
              console.log('Navigation object:', navigation);
              console.log('Club data:', club);
              try {
                navigation.navigate('ClubDetails', { club });
                console.log('Navigation called successfully');
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }}
          >
            <Image
              source={{ uri: club.image }}
              style={styles.clubImage}
            />
            <View style={styles.clubInfo}>
              <Text style={styles.clubName}>{club.name}</Text>
              <View style={styles.clubMeta}>
                <Text style={styles.clubCategory}>{getClubCategory(club)}</Text>
                <Text style={styles.clubMembers}>{club.members.length} members</Text>
              </View>
              <Text style={styles.clubDescription} numberOfLines={2}>
                {club.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 20,
    backgroundColor: '#FF3B30',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)', // Light red border
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)', // Light red border
  },
  categoryButtonActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  categoryButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  clubList: {
    padding: 20,
  },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.1)', // Very light red border
  },
  clubImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  clubInfo: {
    padding: 15,
  },
  clubName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 5,
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clubCategory: {
    fontSize: 14,
    color: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
    fontWeight: '500',
  },
  clubMembers: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  clubDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ExploreScreen; 