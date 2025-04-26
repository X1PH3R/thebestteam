import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type StudentDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentDetails'>;

const MAJORS = [
  'Accounting',
  'Biology',
  'Business Administration',
  'Computer Science',
  'Criminal Justice',
  'Education',
  'English',
  'History',
  'Marketing',
  'Psychology',
  'Other',
];

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

const INTERESTS = [
  'Academic',
  'Arts',
  'Athletics',
  'Community Service',
  'Cultural',
  'Environmental',
  'Greek Life',
  'Leadership',
  'Music',
  'Professional Development',
  'Religious',
  'Social',
  'Technology',
];

const StudentDetailsScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    major: '',
    year: '',
    interests: [] as string[],
    bio: '',
    phoneNumber: '',
    campus: 'Queens',
  });

  const [error, setError] = useState('');
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const navigation = useNavigation<StudentDetailsScreenNavigationProp>();

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.major || !formData.year) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    navigation.navigate('Home');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const renderDropdownModal = (items: string[], selectedValue: string, onSelect: (value: string) => void, onClose: () => void) => (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modalItem,
                  selectedValue === item && styles.selectedModalItem,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedValue === item && styles.selectedModalItemText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name *"
            value={formData.firstName}
            onChangeText={(value) => {
              setFormData(prev => ({ ...prev, firstName: value }));
              setError('');
            }}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name *"
            value={formData.lastName}
            onChangeText={(value) => {
              setFormData(prev => ({ ...prev, lastName: value }));
              setError('');
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowMajorModal(true)}
        >
          <Text style={formData.major ? styles.selectedText : styles.placeholderText}>
            {formData.major || 'Select your major *'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowYearModal(true)}
        >
          <Text style={formData.year ? styles.selectedText : styles.placeholderText}>
            {formData.year || 'Select your year *'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Interests *</Text>
        <View style={styles.interestsContainer}>
          {INTERESTS.map(interest => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestButton,
                formData.interests.includes(interest) && styles.selectedInterest,
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text
                style={[
                  styles.interestText,
                  formData.interests.includes(interest) && styles.selectedInterestText,
                ]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChangeText={(value) => setFormData(prev => ({ ...prev, bio: value }))}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {showMajorModal && renderDropdownModal(
          MAJORS,
          formData.major,
          (value) => {
            setFormData(prev => ({ ...prev, major: value }));
            setError('');
          },
          () => setShowMajorModal(false)
        )}

        {showYearModal && renderDropdownModal(
          YEARS,
          formData.year,
          (value) => {
            setFormData(prev => ({ ...prev, year: value }));
            setError('');
          },
          () => setShowYearModal(false)
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#C41E3A', // St. John's Red
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  interestButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectedInterest: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  interestText: {
    color: '#333',
  },
  selectedInterestText: {
    color: '#fff',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#C41E3A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#C41E3A',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedModalItem: {
    backgroundColor: '#C41E3A',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedModalItemText: {
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#C41E3A',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
});

export default StudentDetailsScreen; 