import { Event } from '../types';

export const generateCalendarLink = (event: Event): string => {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location.name,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const formatEventTime = (date: string): string => {
  const eventDate = new Date(date);
  return eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatEventDate = (date: string): string => {
  const eventDate = new Date(date);
  return eventDate.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isEventUpcoming = (date: string): boolean => {
  const eventDate = new Date(date);
  const now = new Date();
  return eventDate > now;
};

export const getEventStatus = (event: Event): 'upcoming' | 'ongoing' | 'past' => {
  const now = new Date();
  const startDate = new Date(event.date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'ongoing';
  return 'past';
}; 