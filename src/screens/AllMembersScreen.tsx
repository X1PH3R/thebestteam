import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { User } from '../types';

type RootStackParamList = {
  MemberProfile: { member: User };
  AllMembers: { members: User[]; clubName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AllMembersRouteProp = RouteProp<RootStackParamList, 'AllMembers'>;

const AllMembersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AllMembersRouteProp>();
  const { members, clubName } = route.params;

  const renderMember = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => navigation.navigate('MemberProfile', { member: item })}
    >
      <Image
        source={{ uri: item.photoURL || 'https://via.placeholder.com/50' }}
        style={styles.memberImage}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.displayName}</Text>
        <Text style={styles.memberDetails}>{item.major || 'Member'} • Class of {item.year}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{clubName} Members</Text>
        <Text style={styles.subtitle}>{members.length} members</Text>
      </View>
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default AllMembersScreen; 