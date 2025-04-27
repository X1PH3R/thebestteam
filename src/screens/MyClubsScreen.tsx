import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Club } from '../types';

type RootStackParamList = {
  Home: undefined;
  GroupChat: { clubId: string; clubName: string };
  ClubDetails: { club: Club };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyClubsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { joinedClubs } = useJoinedClubs();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Navigate to GroupChat with the first joined club if available
            if (joinedClubs && joinedClubs.length > 0) {
              navigation.navigate('GroupChat', {
                clubId: joinedClubs[0].id,
                clubName: joinedClubs[0].name
              });
            } else {
              // Handle case when no clubs are joined
              Alert.alert('No Clubs', 'Please join a club first to access the group chat.');
            }
          }}
          style={styles.chatButton}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, joinedClubs]);

  const renderClubCard = ({ item }: { item: Club }) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => navigation.navigate('ClubDetails', { club: item })}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.clubImage}
        />
      )}
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.memberCount}>{item.members.length} members</Text>
        <Text style={styles.clubDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!joinedClubs || joinedClubs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={80} color="#007AFF" />
        <Text style={styles.emptyTitle}>No Clubs Yet</Text>
        <Text style={styles.emptyText}>Join clubs to see them here</Text>
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
    <View style={styles.container}>
      <FlatList
        data={joinedClubs}
        keyExtractor={(item) => item.id}
        renderItem={renderClubCard}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
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
    overflow: 'hidden',
  },
  clubImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  clubInfo: {
    padding: 16,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberCount: {
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
  chatButton: {
    marginRight: 16,
  },
});

export default MyClubsScreen; 