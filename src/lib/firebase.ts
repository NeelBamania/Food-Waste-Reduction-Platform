import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbzMQk1DFKSevHv-LHAm6GumQzCDIbVRY",
  authDomain: "food-waste-reduction-platform.firebaseapp.com",
  projectId: "food-waste-reduction-platform",
  storageBucket: "food-waste-reduction-platform.firebasestorage.app",
  messagingSenderId: "95055110272",
  appId: "1:95055110272:web:5b6afd9047dc6f1f318665",
  measurementId: "G-6WE0DPBM0R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 