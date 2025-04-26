import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Clubs: undefined;
  Events: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SJU Connect!</Text>

      <Button 
        title="View Clubs" 
        onPress={() => navigation.navigate('Clubs')} 
        color="#cc0000"
      />

      <View style={styles.buttonSpacer} />

      <Button 
        title="View Events" 
        onPress={() => navigation.navigate('Events')} 
        color="#cc0000"
      />
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
    marginBottom: 30,
    color: '#cc0000', // SJU red 🔥
    textAlign: 'center',
  },
  buttonSpacer: {
    height: 20,
  },
}); 