import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Clubs: undefined;
  Calendar: undefined;
  Profile: undefined;
  Announcements: undefined;
  ClubDetails: { club: Club };
  GroupChat: { club: Club };
  MemberProfile: { member: User };
  AllMembers: { members: User[]; clubName: string };
  CreateProfile: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Settings: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  major?: string;
  year?: string;
  description?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  photoURL?: string;
  image?: string;
  members: User[];
  admins: User[];
  events: Event[];
  announcements: Announcement[];
  groupChatId?: string;
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  calendarLink?: string;
  meetings?: Meeting[];
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
}

export interface Meeting {
  day: string;
  time: string;
  frequency: string;
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

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  clubId: string;
} 