import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Clubs: undefined;
  Events: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CLUBS = [
  {
    id: '1',
    name: 'Photography Club',
    description: 'Capture moments and share your passion for photography',
    members: 42,
    category: 'Arts',
    imageUrl: 'https://picsum.photos/200/200'
  },
  {
    id: '2',
    name: 'Chess Club',
    description: 'Strategic thinking and competitive chess matches',
    members: 28,
    category: 'Games',
    imageUrl: 'https://picsum.photos/200/201'
  },
  {
    id: '3',
    name: 'Hiking Club',
    description: 'Explore nature and stay active with group hikes',
    members: 56,
    category: 'Sports',
    imageUrl: 'https://picsum.photos/200/202'
  },
  {
    id: '4',
    name: 'Book Club',
    description: 'Monthly book discussions and literary analysis',
    members: 35,
    category: 'Arts',
    imageUrl: 'https://picsum.photos/200/203'
  }
];

const ClubScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = CLUBS.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clubs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.clubList}>
          {filteredClubs.map(club => (
            <TouchableOpacity 
              key={club.id}
              style={styles.clubCard}
              onPress={() => navigation.navigate('Events')}
            >
              <Image
                source={{ uri: club.imageUrl }}
                style={styles.clubImage}
              />
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubCategory}>{club.category}</Text>
                <Text style={styles.clubDescription}>{club.description}</Text>
                <View style={styles.clubStats}>
                  <Text style={styles.memberCount}>{club.members} members</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  clubList: {
    padding: 15,
  },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clubImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  clubInfo: {
    padding: 15,
  },
  clubName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clubCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  clubStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default ClubScreen; 