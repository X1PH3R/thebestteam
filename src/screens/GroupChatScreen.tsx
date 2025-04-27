import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GroupChatScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Club Chat</Text>
      <Text style={styles.subtitle}>Coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default GroupChatScreen; 