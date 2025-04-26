import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  image: any;
  memberCount: number;
  meetingTimes: Array<{
    day: string;
    time: string;
    location: string;
    frequency: string;
  }>;
  calendarLink: string;
  upcomingEvents: Array<{
    title: string;
    date: string;
    description: string;
  }>;
}

interface JoinedClubsContextType {
  joinedClubs: Club[];
  joinClub: (club: Club) => void;
}

const JoinedClubsContext = createContext<JoinedClubsContextType | undefined>(undefined);

export const JoinedClubsProvider = ({ children }: { children: ReactNode }) => {
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);

  const joinClub = (club: Club) => {
    setJoinedClubs(prev => prev.find(c => c.id === club.id) ? prev : [...prev, club]);
  };

  return (
    <JoinedClubsContext.Provider value={{ joinedClubs, joinClub }}>
      {children}
    </JoinedClubsContext.Provider>
  );
};

export const useJoinedClubs = () => {
  const context = useContext(JoinedClubsContext);
  if (!context) throw new Error('useJoinedClubs must be used within a JoinedClubsProvider');
  return context;
}; 