import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { useTheme } from '../context/ThemeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { Club } from '../types';

type RootStackParamList = {
  GroupChat: { clubId: string; clubName: string };
  ClubDetails: { club: Club };
};

type TabParamList = {
  ExploreTab: undefined;
  MyClubsTab: undefined;
  ProfileTab: undefined;
};

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const MyClubsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { joinedClubs } = useJoinedClubs();
  const { theme } = useTheme();

  const navigateToExplore = () => {
    navigation.navigate('ExploreTab');
  };

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
          <Ionicons name="chatbubbles-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, joinedClubs, theme]);

  const renderClubCard = ({ item }: { item: Club }) => (
    <TouchableOpacity
      style={[styles.clubCard, { backgroundColor: theme.background }]}
      onPress={() => navigation.navigate('ClubDetails', { club: item })}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.clubImage}
        />
      )}
      <View style={styles.clubInfo}>
        <Text style={[styles.clubName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.memberCount, { color: theme.textSecondary }]}>{item.members.length} members</Text>
        <Text style={[styles.clubDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!joinedClubs || joinedClubs.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="people-outline" size={80} color={theme.primary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Clubs Yet</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Join clubs to see them here</Text>
        <TouchableOpacity 
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={navigateToExplore}
        >
          <Text style={styles.exploreButtonText}>Explore Clubs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
  },
  listContent: {
    padding: 16,
  },
  clubCard: {
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
    marginBottom: 8,
  },
  clubDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
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