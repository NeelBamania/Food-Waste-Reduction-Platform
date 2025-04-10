import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { createUser, getUser } from '../services/firebase';
import { auth, googleProvider } from '../lib/firebase';
import { demoUsers, DemoUser } from '../data/demoUsers';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserData {
  id: string;
  name?: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  donationFormData: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationFormData, setDonationFormData] = useState<any | null>(null);

  // Function to find demo user by email and password
  const findDemoUser = (email: string, password: string): DemoUser | undefined => {
    return demoUsers.find(user => user.email === email && user.password === password);
  };

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Try to find demo user
      const demoUser = findDemoUser(email, password);
      
      if (demoUser) {
        // Login successful with demo user
        const userData = {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role
        };
        
        // Store user in localStorage
        localStorage.setItem('demoUser', JSON.stringify(userData));
        
        // Set user state
        setUser(userData);
        return;
      }
      
      // If not a demo user, try Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUser(userCredential.user.uid) as UserData;
      if (userData) {
        setUser({
          id: userCredential.user.uid,
          name: userData.name || userCredential.user.displayName || '',
          email: userCredential.user.email || '',
          role: userData.role || 'user'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      // For demo purposes, we'll simulate Google login with a random demo user
      const randomIndex = Math.floor(Math.random() * demoUsers.length);
      const demoUser = demoUsers[randomIndex];
      
      const userData = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role
      };
      
      // Store user in localStorage
      localStorage.setItem('demoUser', JSON.stringify(userData));
      
      // Set user state
      setUser(userData);
      
      // In a real implementation, we would use Firebase Google auth
      // const result = await signInWithPopup(auth, googleProvider);
      // ... rest of the Firebase implementation
    } catch (error) {
      console.error('Google login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login with Google');
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const { email, password, ...rest } = userData;
      
      // For demo purposes, we'll just create a new user in our demo users array
      // In a real implementation, we would use Firebase
      const newUser: DemoUser = {
        id: `user${Date.now()}`,
        email,
        password,
        name: rest.name || 'New User',
        role: rest.role || 'user',
        ...rest
      };
      
      // Add to demo users (this won't persist between page refreshes)
      demoUsers.push(newUser);
      
      // Set user state
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      });
      
      // Store user in localStorage
      localStorage.setItem('demoUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }));
      
      // In a real implementation, we would use Firebase
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // await createUser({
      //   id: userCredential.user.uid,
      //   email,
      //   ...rest,
      //   role: rest.role || 'user'
      // });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('demoUser');
      
      // Clear user state
      setUser(null);
      
      // In a real implementation, we would use Firebase
      // await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        logout,
        register,
        donationFormData
      }}
    >
      {!loading && children}
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