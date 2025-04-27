import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Club } from '../types';

interface JoinedClubsContextType {
  joinedClubs: Club[];
  joinClub: (club: Club) => void;
  leaveClub: (clubId: string) => void;
}

const JoinedClubsContext = createContext<JoinedClubsContextType | undefined>(undefined);

export const JoinedClubsProvider = ({ children }: { children: ReactNode }) => {
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);

  const joinClub = (club: Club) => {
    setJoinedClubs(prev => prev.find(c => c.id === club.id) ? prev : [...prev, club]);
  };

  const leaveClub = (clubId: string) => {
    setJoinedClubs(prev => prev.filter(club => club.id !== clubId));
  };

  return (
    <JoinedClubsContext.Provider value={{ joinedClubs, joinClub, leaveClub }}>
      {children}
    </JoinedClubsContext.Provider>
  );
};

export const useJoinedClubs = () => {
  const context = useContext(JoinedClubsContext);
  if (!context) throw new Error('useJoinedClubs must be used within a JoinedClubsProvider');
  return context;
}; 