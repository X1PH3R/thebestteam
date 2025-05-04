import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';

// Mock announcements data with images
const mockAnnouncements = [
  {
    id: '1',
    clubName: 'STJ ACM',
    title: 'Weekly Meeting This Friday',
    content: 'Join us for our weekly meeting! We will be discussing upcoming projects and events.',
    date: '2024-03-30',
    image: 'https://picsum.photos/200/200?random=1',
    clubId: '1',
    likes: Math.floor(Math.random() * 100),
    isLiked: false,
  },
  {
    id: '2',
    clubName: 'STJ Cyberstorm',
    title: 'New Equipment Available',
    content: 'We have new cybersecurity tools available for member use. Book your slot now!',
    date: '2024-03-29',
    image: 'https://picsum.photos/200/200?random=2',
    clubId: '2',
    likes: Math.floor(Math.random() * 100),
    isLiked: false,
  },
  {
    id: '3',
    clubName: 'Hiking Club',
    title: 'Weekend Hike',
    content: 'Join us for a beautiful hike this Sunday at Bear Mountain!',
    date: '2024-03-28',
    image: 'https://picsum.photos/200/200?random=3',
    clubId: '3',
    likes: Math.floor(Math.random() * 100),
    isLiked: false,
  },
  {
    id: '4',
    clubName: 'Book Club',
    title: 'Next Book Selection',
    content: 'Our next book will be "The Great Gatsby". Join us for the discussion next week!',
    date: '2024-03-27',
    image: 'https://picsum.photos/200/200?random=4',
    clubId: '4',
    likes: Math.floor(Math.random() * 100),
    isLiked: false,
  },
];

const AnnouncementsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { joinedClubs } = useJoinedClubs();
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState(mockAnnouncements.map(announcement => ({
    ...announcement,
    isLiked: false
  })));

  const handleLike = (announcementId: string) => {
    setAnnouncements(currentAnnouncements => {
      return currentAnnouncements.map(announcement => {
        if (announcement.id === announcementId) {
          const newIsLiked = !announcement.isLiked;
          return {
            ...announcement,
            isLiked: newIsLiked,
            likes: newIsLiked ? announcement.likes + 1 : announcement.likes - 1
          };
        }
        return announcement;
      });
    });
  };

  const handleComment = (announcementId: string) => {
    Alert.alert(
      'Comments',
      'Comment functionality coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleShare = async (announcement: typeof mockAnnouncements[0]) => {
    try {
      await Share.share({
        message: `${announcement.title}\n\n${announcement.content}\n\nShared from ${announcement.clubName}`,
        title: announcement.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share announcement');
    }
  };

  const handleClubPress = (clubId: string) => {
    const club = joinedClubs.find(c => c.id === clubId);
    if (club) {
      navigation.navigate('ClubDetails', { club });
    } else {
      console.log(`Club with ID ${clubId} not found in joined clubs`);
      Alert.alert(
        'Club Not Found',
        'The club associated with this announcement is no longer available.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleExplorePress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ExploreClubs'
      })
    );
  };

  if (!joinedClubs || joinedClubs.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <LinearGradient
          colors={[theme.primary, '#FF6B6B']}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="megaphone-outline" size={80} color="#fff" />
        </LinearGradient>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Clubs Joined</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Join clubs to see their announcements and stay updated with the latest news!</Text>
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={handleExplorePress}
        >
          <Text style={styles.exploreButtonText}>Explore Clubs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Filter announcements to only show those from joined clubs
  const joinedClubNames = joinedClubs.map(club => club.name);
  const filteredAnnouncements = announcements.filter(announcement => 
    joinedClubNames.includes(announcement.clubName)
  );

  if (filteredAnnouncements.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <LinearGradient
          colors={[theme.primary, '#FF6B6B']}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="megaphone-outline" size={80} color="#fff" />
        </LinearGradient>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Announcements Yet</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Your clubs haven't posted any announcements yet. Check back later!</Text>
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={handleExplorePress}
        >
          <Text style={styles.exploreButtonText}>Explore More Clubs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        {filteredAnnouncements.map((announcement) => (
          <View 
            key={announcement.id} 
            style={[styles.announcementCard, { backgroundColor: theme.surface }]}
          >
            <LinearGradient
              colors={[theme.primary, '#FF6B6B']}
              style={styles.cardHeader}
            >
              <View style={styles.clubInfo}>
                <Image 
                  source={{ uri: announcement.image }} 
                  style={styles.clubImage}
                />
                <View>
                  <Text style={styles.clubName}>{announcement.clubName}</Text>
                  <Text style={styles.date}>{announcement.date}</Text>
                </View>
              </View>
            </LinearGradient>
            <View style={styles.cardContent}>
              <Text style={[styles.title, { color: theme.text }]}>{announcement.title}</Text>
              <Text style={[styles.content, { color: theme.textSecondary }]}>{announcement.content}</Text>
              <View style={[styles.actions, { borderTopColor: theme.border }]}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleLike(announcement.id)}
                >
                  <Ionicons 
                    name={announcement.isLiked ? "heart" : "heart-outline"} 
                    size={20} 
                    color={theme.primary} 
                  />
                  <Text style={[styles.actionText, { color: theme.primary }]}>{announcement.likes} Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleComment(announcement.id)}
                >
                  <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
                  <Text style={[styles.actionText, { color: theme.primary }]}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShare(announcement)}
                >
                  <Ionicons name="share-outline" size={20} color={theme.primary} />
                  <Text style={[styles.actionText, { color: theme.primary }]}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  exploreButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  announcementCard: {
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  clubName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AnnouncementsScreen; 