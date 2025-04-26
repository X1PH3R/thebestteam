import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const events = [
  { id: '1', title: 'Tech Fair 2025', date: 'May 10, 2025' },
  { id: '2', title: 'SJU Club Showcase', date: 'May 15, 2025' },
  { id: '3', title: 'Hackathon Weekend', date: 'June 1, 2025' },
];

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
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
  itemDate: {
    fontSize: 14,
    color: 'gray',
  },
}); 