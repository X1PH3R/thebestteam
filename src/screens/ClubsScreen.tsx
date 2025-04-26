import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ClubsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs</Text>
      <Text style={styles.subtitle}>Coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#cc0000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
}); 