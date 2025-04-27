import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CreateProfile: undefined;
  MyClubs: undefined;
  ExploreClubs: undefined;
  ClubDetails: { club: Club };
  GroupChat: { clubId: string; clubName: string };
  EventAttendance: { event: Event };
  MemberProfile: { member: User };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface User {
  id: string;
  email: string;
  displayName: string;
  uid: string;
  photoURL?: string;
  major?: string;
  year?: string;
  studentId?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  image: string;
  members: User[];
  events: Event[];
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  calendarLink?: string;
  meetings?: {
    day: string;  // e.g., "Monday", "Tuesday", etc.
    time: string; // e.g., "14:00"
    frequency: string; // e.g., "weekly", "biweekly"
  }[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  attendees: User[];
  clubName?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: string;
}

export interface EventAttendanceRouteParams {
  event: Event;
} 