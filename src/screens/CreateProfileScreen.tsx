import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';

type RootStackParamList = {
  MyClubs: undefined;
  ClubDetails: { club: any };
  Events: undefined;
  ExploreClubs: undefined;
  MemberProfile: { member: any };
  CreateProfile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading, user, updateProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [resume, setResume] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setHasUnsavedChanges(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setHasUnsavedChanges(true);
    }
  };

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        setResume(result.assets[0].uri);
        setHasUnsavedChanges(true);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick the resume file.');
    }
  };

  const handleSaveProfile = async () => {
    if (!name || !studentId || !email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      await register({
        email,
        password,
        name,
        university: 'Example University', // This should be dynamic based on the user's selection
        studentId,
        major,
        year,
        description,
        social: {
          instagram,
          linkedin,
          twitter
        },
        resume: resume || undefined,
        profileImage: profileImage || undefined
      });

      // Navigation will be handled by the AuthContext after successful registration
    } catch (error) {
      // Error is already handled in the auth context
    }
  };

  const yearOptions = [
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
    'Graduate Student',
    'Alumni'
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {user ? 'Edit Profile' : 'Create Profile'}
          </Text>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!hasUnsavedChanges || isLoading) && styles.disabledButton
            ]}
            onPress={handleSaveProfile}
            disabled={!hasUnsavedChanges || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={pickImage}
            disabled={isLoading}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={50} color="#ccc" />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(value) => handleInputChange(setName, value)}
              placeholder="Your name"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student ID *</Text>
            <TextInput
              style={styles.input}
              value={studentId}
              onChangeText={(value) => handleInputChange(setStudentId, value)}
              placeholder="Your student ID"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => handleInputChange(setEmail, value)}
              placeholder="Your university email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(value) => handleInputChange(setPassword, value)}
              placeholder="Create a password"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(value) => handleInputChange(setConfirmPassword, value)}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Major</Text>
            <TextInput
              style={styles.input}
              value={major}
              onChangeText={(value) => handleInputChange(setMajor, value)}
              placeholder="Your major"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year}
                onValueChange={(value) => handleInputChange(setYear, value)}
                style={styles.picker}
                enabled={!isLoading}
              >
                <Picker.Item label="Select your year" value="" />
                {yearOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={(value) => handleInputChange(setDescription, value)}
              placeholder="Tell us about yourself"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram</Text>
              <TextInput
                style={styles.input}
                value={instagram}
                onChangeText={(value) => handleInputChange(setInstagram, value)}
                placeholder="Your Instagram handle"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LinkedIn</Text>
              <TextInput
                style={styles.input}
                value={linkedin}
                onChangeText={(value) => handleInputChange(setLinkedin, value)}
                placeholder="Your LinkedIn profile URL"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Twitter</Text>
              <TextInput
                style={styles.input}
                value={twitter}
                onChangeText={(value) => handleInputChange(setTwitter, value)}
                placeholder="Your Twitter handle"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.resumeSection}>
            <Text style={styles.label}>Resume</Text>
            <TouchableOpacity 
              style={styles.resumeButton}
              onPress={pickResume}
              disabled={isLoading}
            >
              <Text style={styles.resumeButtonText}>
                {resume ? 'Change Resume' : 'Upload Resume'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  socialSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resumeSection: {
    marginTop: 20,
  },
  resumeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default CreateProfileScreen; 