import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const clubs = [
  { id: '1', name: 'Computer Science Club' },
  { id: '2', name: 'Business Leaders Society' },
];

export default function ClubsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs</Text>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.clubItem}>
            <Text style={styles.clubName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#cc0000',
  },
  clubItem: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  clubName: {
    fontSize: 16,
    color: '#333',
  },
}); 