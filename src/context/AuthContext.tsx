import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type User = {
  email: string;
  university: string;
  name: string;
  studentId: string;
  major?: string;
  year?: string;
  description?: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  resume?: string;
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: User & { password: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any existing user data and check for new user
    const initializeAuth = async () => {
      try {
        // Clear existing user data
        await AsyncStorage.removeItem('user');
        setUser(null);
      } catch (error) {
        console.error('Error clearing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      // For now, just simulate a successful login
      const mockUser: User = {
        email,
        university: 'Example University',
        name: 'John Doe',
        studentId: '12345678',
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: User & { password: string }) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      // For now, just simulate a successful registration
      const { password, ...userWithoutPassword } = userData;
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      // For now, just simulate sending a reset email
      Alert.alert(
        'Password Reset',
        'If an account exists with this email, you will receive a password reset link.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Merge existing user data with new data
      const updatedUser = { ...user, ...userData };
      
      // Update AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 