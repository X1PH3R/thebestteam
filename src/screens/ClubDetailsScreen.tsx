import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  StatusBar,
  Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Clubs: undefined;
  Events: undefined;
  ClubDetails: { club: any };
  MemberProfile: { member: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample member data - in a real app, this would come from your backend
const sampleMembers = [
  { 
    id: 1, 
    name: 'John Doe', 
    role: 'President', 
    imageUrl: 'https://via.placeholder.com/50',
    description: 'Passionate about technology and innovation. Leading the club with a vision to make a difference.',
    email: 'john.doe@example.com',
    instagram: 'johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    twitter: 'johndoe',
    joinDate: 'January 2023'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    role: 'Vice President', 
    imageUrl: 'https://via.placeholder.com/50',
    description: 'Experienced in event planning and community building. Always looking for new ways to engage members.',
    email: 'jane.smith@example.com',
    instagram: 'janesmith',
    linkedin: 'linkedin.com/in/janesmith',
    joinDate: 'March 2023'
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    role: 'Treasurer', 
    imageUrl: 'https://via.placeholder.com/50',
    description: 'Finance professional with a keen eye for detail. Ensuring the club\'s resources are well-managed.',
    email: 'mike.johnson@example.com',
    linkedin: 'linkedin.com/in/mikejohnson',
    joinDate: 'April 2023'
  },
  { 
    id: 4, 
    name: 'Sarah Wilson', 
    role: 'Member', 
    imageUrl: 'https://via.placeholder.com/50',
    description: 'New member excited to contribute to the club\'s growth and learn from others.',
    email: 'sarah.wilson@example.com',
    instagram: 'sarahwilson',
    joinDate: 'September 2023'
  },
];

const ClubDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { club } = route.params as { club: any };

  const handleAddToCalendar = async () => {
    try {
      await Linking.openURL(club.calendarLink);
    } catch (error) {
      console.error('Error opening calendar link:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={{ uri: club.imageUrl }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club.name}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{club.category}</Text>
            <Text style={styles.memberCount}>{club.members} members</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{club.description}</Text>
        </View>

        <View style={styles.membersContainer}>
          <Text style={styles.sectionTitle}>Club Members</Text>
          <View style={styles.membersList}>
            {sampleMembers.map((member) => (
              <TouchableOpacity 
                key={member.id} 
                style={styles.memberCard}
                onPress={() => navigation.navigate('MemberProfile', { member })}
              >
                <Image
                  source={{ uri: member.imageUrl }}
                  style={styles.memberImage}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.meetingTimesContainer}>
          <Text style={styles.sectionTitle}>Meeting Times</Text>
          {club.meetingTimes.map((meeting: any, index: number) => (
            <View key={index} style={styles.meetingCard}>
              <View style={styles.meetingHeader}>
                <Text style={styles.meetingDay}>{meeting.day}</Text>
                <Text style={styles.meetingFrequency}>{meeting.frequency}</Text>
              </View>
              <View style={styles.meetingDetails}>
                <Text style={styles.meetingTime}>⏰ {meeting.time}</Text>
                <Text style={styles.meetingLocation}>📍 {meeting.location}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity 
            style={styles.eventCard}
            onPress={() => navigation.navigate('Events')}
          >
            <Text style={styles.eventTitle}>Weekly Meeting</Text>
            <Text style={styles.eventDate}>Every Wednesday at 6:00 PM</Text>
            <Text style={styles.eventDescription}>Join us for our regular club meeting</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.joinButton]}
            onPress={() => navigation.navigate('Events')}
          >
            <Text style={styles.buttonText}>Join Club</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.calendarButton]}
            onPress={handleAddToCalendar}
          >
            <Text style={styles.buttonText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
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
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  clubInfo: {
    marginBottom: 20,
  },
  clubName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  membersContainer: {
    marginBottom: 20,
  },
  membersList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  meetingTimesContainer: {
    marginBottom: 20,
  },
  meetingCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetingDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  meetingFrequency: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  meetingDetails: {
    gap: 4,
  },
  meetingTime: {
    fontSize: 14,
    color: '#666',
  },
  meetingLocation: {
    fontSize: 14,
    color: '#666',
  },
  eventsContainer: {
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  joinButton: {
    backgroundColor: '#007AFF',
  },
  calendarButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClubDetailsScreen; 