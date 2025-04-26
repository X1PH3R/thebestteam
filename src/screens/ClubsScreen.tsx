import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const clubs = [
  { id: '1', name: 'Computer Science Club' },
  { id: '2', name: 'Business Leaders Society' },
  { id: '3', name: 'Environmental Awareness Group' },
  { id: '4', name: 'Art & Culture Club' },
];

export default function ClubsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs at SJU</Text>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#cc0000',
    textAlign: 'center',
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
  },
}); 