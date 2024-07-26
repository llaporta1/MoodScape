import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration (iOS key)
export const firebaseConfig = {
  apiKey: "Your-iOS-API-Key-Here", // Replace with the actual iOS API key
  authDomain: "moodscape-592de.firebaseapp.com",
  projectId: "moodscape-592de",
  storageBucket: "moodscape-592de.appspot.com",
  messagingSenderId: "923938596144",
  appId: "1:923938596144:ios:b3aa74919b9ecd2b0194f5"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // if already initialized, use that one
}

// Initialize Firebase Authentication with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
