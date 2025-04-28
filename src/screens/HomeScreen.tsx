import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useJoinedClubs } from '../context/JoinedClubsContext';
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>My Clubs</Text>
      <FlatList
        data={joinedClubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.clubItem, { borderBottomColor: theme.border }]}>
            <Text style={[styles.clubName, { color: theme.text }]}>{item.name}</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  clubItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  clubName: {
    fontSize: 18,
  },
});

export default HomeScreen; 