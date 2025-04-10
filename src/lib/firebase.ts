import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbzMQk1DFKSevHv-LHAm6GumQzCDIbVRY",
  authDomain: "food-waste-reduction-platform.firebaseapp.com",
  projectId: "food-waste-reduction-platform",
  storageBucket: "food-waste-reduction-platform.firebasestorage.app",
  messagingSenderId: "95055110272",
  appId: "1:95055110272:web:5b6afd9047dc6f1f318665",
  measurementId: "G-6WE0DPBM0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings including persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider }; 