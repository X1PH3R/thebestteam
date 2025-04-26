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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';

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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [xNumber, setXNumber] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
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

  const handleSaveProfile = () => {
    if (!name || !xNumber) {
      Alert.alert('Missing Information', 'Please fill in your name and X-Number.');
      return;
    }

    // In a real app, you would save this to your backend
    const newProfile = {
      id: Date.now(),
      name,
      xNumber,
      major,
      year,
      imageUrl: profileImage || 'https://via.placeholder.com/150',
      description,
      email,
      instagram,
      linkedin,
      twitter,
      resume,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    Alert.alert(
      'Profile Saved',
      'Your profile has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => setHasUnsavedChanges(false)
        }
      ]
    );
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
          <Text style={styles.headerTitle}>Profile</Text>
          {hasUnsavedChanges && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={pickImage}
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>X-Number *</Text>
            <TextInput
              style={styles.input}
              value={xNumber}
              onChangeText={(value) => handleInputChange(setXNumber, value)}
              placeholder="Your X-Number"
              placeholderTextColor="#999"
              autoCapitalize="characters"
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year}
                onValueChange={(value) => handleInputChange(setYear, value)}
                style={styles.picker}
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => handleInputChange(setEmail, value)}
              placeholder="Your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.resumeSection}>
            <Text style={styles.label}>Resume</Text>
            <TouchableOpacity 
              style={styles.resumeButton}
              onPress={pickResume}
            >
              <Ionicons name="document-text-outline" size={24} color="#007AFF" />
              <Text style={styles.resumeButtonText}>
                {resume ? 'Change Resume' : 'Upload Resume'}
              </Text>
            </TouchableOpacity>
            {resume && (
              <Text style={styles.resumeFileName}>
                Resume uploaded
              </Text>
            )}
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram</Text>
              <View style={styles.socialInput}>
                <Text style={styles.socialPrefix}>@</Text>
                <TextInput
                  style={[styles.input, styles.socialInputField]}
                  value={instagram}
                  onChangeText={(value) => handleInputChange(setInstagram, value)}
                  placeholder="username"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>LinkedIn</Text>
              <TextInput
                style={styles.input}
                value={linkedin}
                onChangeText={(value) => handleInputChange(setLinkedin, value)}
                placeholder="linkedin.com/in/username"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Twitter</Text>
              <View style={styles.socialInput}>
                <Text style={styles.socialPrefix}>@</Text>
                <TextInput
                  style={[styles.input, styles.socialInputField]}
                  value={twitter}
                  onChangeText={(value) => handleInputChange(setTwitter, value)}
                  placeholder="username"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
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
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 10,
    color: '#999',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
  },
  socialSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  socialInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialPrefix: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  socialInputField: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  resumeSection: {
    marginBottom: 20,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  resumeButtonText: {
    marginLeft: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  resumeFileName: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default CreateProfileScreen; 