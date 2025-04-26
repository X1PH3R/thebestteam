import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../types';

type EventAttendanceRouteProp = RouteProp<RootStackParamList, 'EventAttendance'>;

const EventAttendanceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EventAttendanceRouteProp>();
  const { event } = route.params;
  const { theme } = useTheme();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await BarCodeScanner.requestPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && locationStatus === 'granted');
    })();
  }, []);

  const verifyLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        event.location.latitude,
        event.location.longitude
      );

      if (distance <= 100) { // 100 meters radius
        setLocationVerified(true);
        Alert.alert('Success', 'Location verified successfully');
      } else {
        Alert.alert('Error', 'You must be at the event location to mark attendance');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify location');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (data === event.id) {
      setScanned(true);
      Alert.alert('Success', 'QR Code verified successfully');
    } else {
      Alert.alert('Error', 'Invalid QR Code');
    }
  };

  const handleSubmitAttendance = async () => {
    if (!scanned) {
      Alert.alert('Error', 'Please scan the event QR code');
      return;
    }

    if (!locationVerified) {
      Alert.alert('Error', 'Please verify your location');
      return;
    }

    if (notes.length > 500) {
      Alert.alert('Error', 'Notes must be less than 500 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit attendance
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      Alert.alert('Success', 'Attendance recorded successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>
          Camera and location permissions are required for attendance verification
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Event Attendance</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Event Details</Text>
            <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
            <Text style={[styles.eventDate, { color: theme.textSecondary }]}>
              {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString()}
            </Text>
            <Text style={[styles.eventLocation, { color: theme.textSecondary }]}>
              {event.location.name}
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>QR Code Verification</Text>
            {!scanned ? (
              <View style={styles.scannerContainer}>
                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={styles.scanner}
                />
              </View>
            ) : (
              <View style={[styles.verifiedContainer, { backgroundColor: theme.success }]}>
                <Ionicons name="checkmark-circle" size={40} color="white" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Location Verification</Text>
            <TouchableOpacity
              style={[styles.verifyButton, { backgroundColor: theme.primary }]}
              onPress={verifyLocation}
              disabled={locationVerified}
            >
              <Text style={styles.verifyButtonText}>
                {locationVerified ? 'Location Verified' : 'Verify Location'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes (Optional)</Text>
            <TextInput
              style={[styles.notesInput, {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about the event..."
              placeholderTextColor={theme.textSecondary}
              multiline
              maxLength={500}
            />
            <Text style={[styles.characterCount, { color: theme.textSecondary }]}>
              {notes.length}/500 characters
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmitAttendance}
            disabled={isSubmitting || !scanned || !locationVerified}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Attendance</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 16,
  },
  scannerContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanner: {
    flex: 1,
  },
  verifiedContainer: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  verifyButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesInput: {
    height: 100,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
});

export default EventAttendanceScreen; 