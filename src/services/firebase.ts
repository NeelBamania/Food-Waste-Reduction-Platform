import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
  QueryConstraint,
  DocumentData,
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Donation } from '../types/donation';
import { 
  getLocalDonations, 
  createLocalDonation, 
  updateLocalDonation, 
  deleteLocalDonation,
  getLocalUsers,
  createLocalUser,
  updateLocalUser
} from './localStorage';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { User as AppUser } from '../types/user';

// Flag to use local storage instead of Firebase
const USE_LOCAL_STORAGE = true;

export interface UserData {
  id: string;
  name?: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export const createUser = async (userData: any) => {
  if (USE_LOCAL_STORAGE) {
    return createLocalUser(userData);
  }
  
  try {
    const userRef = doc(db, 'users', userData.id);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString()
    });
    return userData;
  } catch (error) {
    console.error('Error creating user:', error);
    // Fallback to local storage
    return createLocalUser(userData);
  }
};

export const getUser = async (userId: string) => {
  if (USE_LOCAL_STORAGE) {
    const users = getLocalUsers();
    return users.find(user => user.id === userId) || null;
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    // Fallback to local storage
    const users = getLocalUsers();
    return users.find(user => user.id === userId) || null;
  }
};

export const updateUser = async (userId: string, userData: Partial<UserData>) => {
  if (USE_LOCAL_STORAGE) {
    return updateLocalUser(userId, userData);
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error updating user:', error);
    // Fallback to local storage
    return updateLocalUser(userId, userData);
  }
};

export const createDonation = async (donationData: any) => {
  if (USE_LOCAL_STORAGE) {
    return createLocalDonation(donationData);
  }
  
  try {
    const donationsRef = collection(db, 'donations');
    const newDonationRef = doc(donationsRef);
    await setDoc(newDonationRef, {
      ...donationData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return { id: newDonationRef.id, ...donationData };
  } catch (error) {
    console.error('Error creating donation:', error);
    // Fallback to local storage
    return createLocalDonation(donationData);
  }
};

export const getDonations = async (filters: { [key: string]: any } = {}): Promise<Donation[]> => {
  if (USE_LOCAL_STORAGE) {
    return getLocalDonations(filters);
  }
  
  try {
    const donationsRef = collection(db, 'donations');
    const constraints: QueryConstraint[] = [];
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        constraints.push(where(key, '==', value));
      }
    });
    
    // Add default ordering
    constraints.push(orderBy('createdAt', 'desc'));
    
    const q = query(donationsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Donation[];
  } catch (error) {
    console.error('Error getting donations:', error);
    // Fallback to local storage
    return getLocalDonations(filters);
  }
};

export const getDonation = async (donationId: string) => {
  if (USE_LOCAL_STORAGE) {
    const donations = getLocalDonations();
    return donations.find(donation => donation.id === donationId) || null;
  }
  
  try {
    const donationRef = doc(db, 'donations', donationId);
    const donationSnap = await getDoc(donationRef);
    if (donationSnap.exists()) {
      return { id: donationSnap.id, ...donationSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting donation:', error);
    // Fallback to local storage
    const donations = getLocalDonations();
    return donations.find(donation => donation.id === donationId) || null;
  }
};

export const updateDonation = async (donationId: string, updateData: Partial<DocumentData>) => {
  if (USE_LOCAL_STORAGE) {
    return updateLocalDonation(donationId, updateData as Partial<Donation>);
  }
  
  try {
    const donationRef = doc(db, 'donations', donationId);
    await updateDoc(donationRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return { id: donationId, ...updateData };
  } catch (error) {
    console.error('Error updating donation:', error);
    // Fallback to local storage
    return updateLocalDonation(donationId, updateData as Partial<Donation>);
  }
};

export const deleteDonation = async (donationId: string) => {
  if (USE_LOCAL_STORAGE) {
    return deleteLocalDonation(donationId);
  }
  
  try {
    const donationRef = doc(db, 'donations', donationId);
    await deleteDoc(donationRef);
    return true;
  } catch (error) {
    console.error('Error deleting donation:', error);
    // Fallback to local storage
    return deleteLocalDonation(donationId);
  }
};

export const createTask = async (taskData: any) => {
  try {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: Timestamp.now(),
      status: 'open'
    });
    return { id: taskRef.id, ...taskData };
  } catch (error) {
    throw error;
  }
};

export const getTasks = async (filters: any = {}) => {
  try {
    const tasksRef = collection(db, 'tasks');
    const constraints: QueryConstraint[] = [];
    
    if (filters.volunteer) {
      constraints.push(where('volunteer', '==', filters.volunteer));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.donation) {
      constraints.push(where('donation', '==', filters.donation));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    
    const q = query(tasksRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id: docId, ...data };
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { id: docId };
  } catch (error) {
    throw error;
  }
};

export const subscribeToDonations = (
  filters: { donor?: string; charity?: string; volunteer?: string },
  callback: (donations: Donation[]) => void
): (() => void) => {
  let q = query(collection(db, 'donations'));
  
  // Apply filters
  if (filters.donor) {
    q = query(q, where('donor', '==', filters.donor));
  }
  if (filters.charity) {
    q = query(q, where('charity', '==', filters.charity));
  }
  if (filters.volunteer) {
    q = query(q, where('volunteer', '==', filters.volunteer));
  }
  
  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const donations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Donation[];
    callback(donations);
  });
  
  return unsubscribe;
}; 