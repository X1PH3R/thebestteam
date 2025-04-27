import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { joinedClubs } = useJoinedClubs();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Clubs</Text>
      <FlatList
        data={joinedClubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.clubItem}>
            <Text style={styles.clubName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  clubItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clubName: {
    fontSize: 18,
  },
});

export default HomeScreen; 