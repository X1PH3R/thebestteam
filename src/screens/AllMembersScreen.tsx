import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { User } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, isDarkMode } = useTheme();

  const renderMember = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.memberCard, { backgroundColor: theme.surface }]}
      onPress={() => navigation.navigate('MemberProfile', { member: item })}
    >
      <Image
        source={{ uri: item.photoURL || 'https://via.placeholder.com/50' }}
        style={styles.memberImage}
      />
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: isDarkMode ? '#FFFFFF' : theme.text }]}>{item.displayName}</Text>
        <Text style={[styles.memberDetails, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>
          {item.major || 'Member'} • Class of {item.year}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={isDarkMode ? '#E0E0E0' : theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : theme.text }]}>{clubName} Members</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#E0E0E0' : theme.textSecondary }]}>{members.length} members</Text>
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
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 14,
  },
});

export default AllMembersScreen; 