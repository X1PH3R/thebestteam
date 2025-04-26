import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Clubs: undefined;
  Events: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ClubScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Clubs</Text>
      </View>
      
      <View style={styles.clubList}>
        <TouchableOpacity 
          style={styles.clubCard}
          onPress={() => navigation.navigate('Events')}
        >
          <Text style={styles.clubName}>Sample Club</Text>
          <Text style={styles.clubDescription}>Click to view events</Text>
        </TouchableOpacity>
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
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clubList: {
    padding: 15,
  },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ClubScreen; 