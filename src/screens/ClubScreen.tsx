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
    name: 'STJ ACM',
    description: 'Join us to explore the world through your lens!',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2Fv2%2FC4E0BAQFjWELOoWObiQ%2Fcompany-logo_200_200%2Fcompany-logo_200_200%2F0%2F1645384621406%2Fsjuacm_logo%3Fe%3D2147483647%26v%3Dbeta%26t%3DUtTcv0BCxoIZ2EsiO7usV1VaQ224WES21a7-x1NU2_c&f=1&nofb=1&ipt=842b1ec1b19e09c8718786ee538aff2c6932aad08ed6211e07eb3f7f7671e0b7',
    members: [
      { id: '1', email: 'sarah@example.com', displayName: 'Sarah Johnson', major: 'Computer Science' },
      { id: '2', email: 'michael@example.com', displayName: 'Michael Chen', major: 'Software Engineering' },
      { id: '3', email: 'alex@example.com', displayName: 'Alex Rodriguez', major: 'Data Science' },
      { id: '4', email: 'emily@example.com', displayName: 'Emily Davis', major: 'Computer Science' },
      { id: '5', email: 'david@example.com', displayName: 'David Kim', major: 'Information Technology' }
    ],
    admins: [
      { id: 'admin1', email: 'smith@example.com', displayName: 'Professor Smith', major: 'Computer Science' }
    ],
    events: [],
    announcements: [],
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
    name: 'STJ Cyberstorm',
    description: 'Challenge your mind and make new friends!',
    image: 'https://redstormsports.com/custompages/gallery/The_Red_Storm_Thunderbird_Meet_St_John_s_New_Mascot__09_17_2009_genrel/2590433.jpeg?width=1024&height=682',
    members: [
      { id: '6', email: 'james@example.com', displayName: 'James Wilson', major: 'Business' },
      { id: '7', email: 'lisa@example.com', displayName: 'Lisa Thompson', major: 'Marketing' },
      { id: '8', email: 'robert@example.com', displayName: 'Robert Garcia', major: 'Finance' },
      { id: '9', email: 'patricia@example.com', displayName: 'Patricia Lee', major: 'Management' }
    ],
    admins: [
      { id: 'admin2', email: 'anderson@example.com', displayName: 'Coach Anderson', major: 'Sports Management' }
    ],
    events: [],
    announcements: [],
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
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.momondo.de%2Fdiscover%2Fwp-content%2Fuploads%2Fsites%2F264%2F2022%2F08%2FDEST_AUSTRIA_VALLEY_OF_UMBALFAELLE_GROSSVENEDIGER_ROETSPITZE_HOHE_TAUERN_PEOPLE_HIKERS_GettyImages-1358569473.jpg&f=1&nofb=1&ipt=edf57e30384e47722e3e0c1ba28635280409dfcbe4e85d0a46a29c836ee9c1fc',
    members: [
      { id: '10', email: 'emma@example.com', displayName: 'Emma Thompson', major: 'Environmental Science' },
      { id: '11', email: 'daniel@example.com', displayName: 'Daniel Brown', major: 'Biology' },
      { id: '12', email: 'sophia@example.com', displayName: 'Sophia Martinez', major: 'Geology' },
      { id: '13', email: 'william@example.com', displayName: 'William Taylor', major: 'Outdoor Education' },
      { id: '14', email: 'olivia@example.com', displayName: 'Olivia Clark', major: 'Environmental Studies' },
      { id: '15', email: 'benjamin@example.com', displayName: 'Benjamin White', major: 'Wildlife Biology' }
    ],
    admins: [
      { id: 'admin3', email: 'jackson@example.com', displayName: 'Ranger Jackson', major: 'Park Management' }
    ],
    events: [],
    announcements: [],
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
    members: [
      { id: '16', email: 'victoria@example.com', displayName: 'Victoria Adams', major: 'English Literature' },
      { id: '17', email: 'christopher@example.com', displayName: 'Christopher Moore', major: 'Creative Writing' },
      { id: '18', email: 'isabella@example.com', displayName: 'Isabella Scott', major: 'Comparative Literature' }
    ],
    admins: [
      { id: 'admin4', email: 'parker@example.com', displayName: 'Librarian Parker', major: 'Library Science' }
    ],
    events: [],
    announcements: [],
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

export { CLUBS };

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