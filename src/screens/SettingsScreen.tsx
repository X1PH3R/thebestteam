import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={theme.text} />
            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDarkMode ? '#fff' : theme.primary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SettingsScreen; 