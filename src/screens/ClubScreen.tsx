import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Clubs: undefined;
  Events: undefined;
  ClubDetails: { club: any };
  MyClubs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CLUBS = [
  {
    id: '1',
    name: 'Photography Club',
    category: 'Arts',
    members: 45,
    description: 'Join us to explore the world through your lens!',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Y2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    meetingTimes: [
      { day: 'Monday', time: '3:00 PM', location: 'Room 101', frequency: 'Weekly' },
      { day: 'Thursday', time: '3:00 PM', location: 'Room 101', frequency: 'Weekly' }
    ],
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Photography+Club+Meeting&details=Weekly+club+meeting&location=Room+101'
  },
  {
    id: '2',
    name: 'Chess Club',
    category: 'Games',
    members: 30,
    description: 'Challenge your mind and make new friends!',
    imageUrl: 'https://images.unsplash.com/photo-1529307473937-262d4b6c0c0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Y2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    meetingTimes: [
      { day: 'Wednesday', time: '4:00 PM', location: 'Room 203', frequency: 'Weekly' }
    ],
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Chess+Club+Meeting&details=Weekly+club+meeting&location=Room+203'
  },
  {
    id: '3',
    name: 'Hiking Club',
    category: 'Outdoors',
    members: 60,
    description: 'Explore nature and stay active!',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Y2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    meetingTimes: [
      { day: 'Saturday', time: '9:00 AM', location: 'Various Locations', frequency: 'Weekly' }
    ],
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Hiking+Club+Meeting&details=Weekly+hike&location=Various+Locations'
  },
  {
    id: '4',
    name: 'Book Club',
    category: 'Literature',
    members: 25,
    description: 'Share your love for reading!',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8Y2hpYHx8&auto=format&fit=crop&w=1638&q=80',
    meetingTimes: [
      { day: 'Tuesday', time: '5:00 PM', location: 'Library Room A', frequency: 'Monthly' }
    ],
    calendarLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Book+Club+Meeting&details=Monthly+book+discussion&location=Library+Room+A'
  }
];

const ExploreClubsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Arts', 'Games', 'Outdoors', 'Literature'];

  const filteredClubs = CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
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
            onPress={() => navigation.navigate('ClubDetails', { club })}
          >
            <Image
              source={{ uri: club.imageUrl }}
              style={styles.clubImage}
            />
            <View style={styles.clubInfo}>
              <Text style={styles.clubName}>{club.name}</Text>
              <View style={styles.clubMeta}>
                <Text style={styles.clubCategory}>{club.category}</Text>
                <Text style={styles.clubMembers}>{club.members} members</Text>
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
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  clubList: {
    padding: 20,
  },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
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
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  clubInfo: {
    padding: 15,
  },
  clubName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clubCategory: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  clubMembers: {
    fontSize: 14,
    color: '#666',
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ExploreClubsScreen; 