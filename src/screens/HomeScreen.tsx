import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SJU Connect!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="View Clubs"
          onPress={() => navigation.navigate('Clubs')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="View Events"
          onPress={() => navigation.navigate('Events')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#cc0000',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
}); 