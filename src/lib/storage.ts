import { ADMIN_CREDENTIALS, TIME_SLOTS } from './constants';

// LocalStorage keys
const STORAGE_KEYS = {
  BOOKINGS: 'dalee_bookings',
  AVAILABILITY: 'dalee_availability',
  ADMIN_SESSION: 'dalee_admin_session',
  BLOCKED_DATES: 'dalee_blocked_dates',
};

// Types
export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  depositPaid: boolean;
  createdAt: string;
}

export interface BlockedDate {
  date: string;
  reason?: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  startTime: string;
  endTime: string;
}

// Default availability (Mon-Sun 8h-21h)
const DEFAULT_AVAILABILITY: Availability[] = [
  { dayOfWeek: 0, enabled: true, startTime: "08:00", endTime: "21:00" },
  { dayOfWeek: 1, enabled: true, startTime: "08:00", endTime: "21:00" },
  { dayOfWeek: 2, enabled: true, startTime: "08:00", endTime: "21:00" },
  { dayOfWeek: 3, enabled: true, startTime: "08:00", endTime: "21:00" },
  { dayOfWeek: 4, enabled: true, startTime: "08:00", endTime: "21:00" },
  { dayOfWeek: 5, enabled: true, startTime: "08:00", endTime: "21:00" },
  { dayOfWeek: 6, enabled: true, startTime: "08:00", endTime: "21:00" },
];

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Bookings
export const getBookings = (): Booking[] => {
  return getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
};

export const saveBooking = (booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  setToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  return newBooking;
};

export const updateBooking = (id: string, updates: Partial<Booking>): Booking | null => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  bookings[index] = { ...bookings[index], ...updates };
  setToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings[index];
};

export const deleteBooking = (id: string): boolean => {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.id !== id);
  if (filtered.length === bookings.length) return false;
  
  setToStorage(STORAGE_KEYS.BOOKINGS, filtered);
  return true;
};

export const getBookingsByDate = (date: string): Booking[] => {
  return getBookings().filter(b => b.date === date && b.status !== 'cancelled');
};

// Availability
export const getAvailability = (): Availability[] => {
  return getFromStorage<Availability[]>(STORAGE_KEYS.AVAILABILITY, DEFAULT_AVAILABILITY);
};

export const setAvailability = (availability: Availability[]): void => {
  setToStorage(STORAGE_KEYS.AVAILABILITY, availability);
};

// Blocked Dates
export const getBlockedDates = (): BlockedDate[] => {
  return getFromStorage<BlockedDate[]>(STORAGE_KEYS.BLOCKED_DATES, []);
};

export const addBlockedDate = (date: string, reason?: string): void => {
  const blocked = getBlockedDates();
  if (!blocked.find(b => b.date === date)) {
    blocked.push({ date, reason });
    setToStorage(STORAGE_KEYS.BLOCKED_DATES, blocked);
  }
};

export const removeBlockedDate = (date: string): void => {
  const blocked = getBlockedDates().filter(b => b.date !== date);
  setToStorage(STORAGE_KEYS.BLOCKED_DATES, blocked);
};

export const isDateBlocked = (date: string): boolean => {
  return getBlockedDates().some(b => b.date === date);
};

// Admin Session
export const isAdminLoggedIn = (): boolean => {
  const session = getFromStorage<{ loggedIn: boolean; timestamp: number } | null>(
    STORAGE_KEYS.ADMIN_SESSION,
    null
  );
  if (!session) return false;
  
  // Session expires after 24 hours
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (Date.now() - session.timestamp > twentyFourHours) {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    return false;
  }
  
  return session.loggedIn;
};

export const adminLogin = (username: string, password: string): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    setToStorage(STORAGE_KEYS.ADMIN_SESSION, { loggedIn: true, timestamp: Date.now() });
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = (date: string, serviceDuration: number = 150): string[] => {
  const dayOfWeek = new Date(date).getDay();
  const availability = getAvailability();
  const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek);
  
  if (!dayAvailability || !dayAvailability.enabled) return [];
  if (isDateBlocked(date)) return [];
  
  const bookings = getBookingsByDate(date);
  const bookedTimes = bookings.map(b => b.time);
  
  return TIME_SLOTS.filter((slot: string) => {
    if (bookedTimes.includes(slot)) return false;
    
    const [hours, minutes] = slot.split(':').map(Number);
    const slotMinutes = hours * 60 + minutes;
    
    const [startH, startM] = dayAvailability.startTime.split(':').map(Number);
    const [endH, endM] = dayAvailability.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return slotMinutes >= startMinutes && slotMinutes + serviceDuration <= endMinutes;
  });
};
