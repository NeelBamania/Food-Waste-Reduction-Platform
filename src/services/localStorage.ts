import { Donation } from '../types/donation';

// Keys for local storage
const DONATIONS_KEY = 'food_waste_donations';
const USERS_KEY = 'food_waste_users';

// Helper functions for local storage
const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
};

// Donation functions
export const getLocalDonations = (filters: { [key: string]: any } = {}): Donation[] => {
  const allDonations = getFromLocalStorage<Donation[]>(DONATIONS_KEY, []);
  
  // Apply filters
  return allDonations.filter(donation => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      return donation[key as keyof Donation] === value;
    });
  });
};

export const createLocalDonation = (donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Donation => {
  const allDonations = getFromLocalStorage<Donation[]>(DONATIONS_KEY, []);
  
  const newDonation: Donation = {
    ...donationData,
    id: `donation_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: donationData.status || 'pending'
  };
  
  allDonations.push(newDonation);
  saveToLocalStorage(DONATIONS_KEY, allDonations);
  
  return newDonation;
};

export const updateLocalDonation = (donationId: string, updateData: Partial<Donation>): Donation | null => {
  const allDonations = getFromLocalStorage<Donation[]>(DONATIONS_KEY, []);
  const index = allDonations.findIndex(d => d.id === donationId);
  
  if (index === -1) return null;
  
  const updatedDonation = {
    ...allDonations[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  allDonations[index] = updatedDonation;
  saveToLocalStorage(DONATIONS_KEY, allDonations);
  
  return updatedDonation;
};

export const deleteLocalDonation = (donationId: string): boolean => {
  const allDonations = getFromLocalStorage<Donation[]>(DONATIONS_KEY, []);
  const filteredDonations = allDonations.filter(d => d.id !== donationId);
  
  if (filteredDonations.length === allDonations.length) return false;
  
  saveToLocalStorage(DONATIONS_KEY, filteredDonations);
  return true;
};

// User functions
export const getLocalUsers = () => {
  return getFromLocalStorage<any[]>(USERS_KEY, []);
};

export const createLocalUser = (userData: any) => {
  const allUsers = getFromLocalStorage<any[]>(USERS_KEY, []);
  
  const newUser = {
    ...userData,
    id: userData.id || `user_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  allUsers.push(newUser);
  saveToLocalStorage(USERS_KEY, allUsers);
  
  return newUser;
};

export const updateLocalUser = (userId: string, userData: any) => {
  const allUsers = getFromLocalStorage<any[]>(USERS_KEY, []);
  const index = allUsers.findIndex(u => u.id === userId);
  
  if (index === -1) return null;
  
  const updatedUser = {
    ...allUsers[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  allUsers[index] = updatedUser;
  saveToLocalStorage(USERS_KEY, allUsers);
  
  return updatedUser;
}; 