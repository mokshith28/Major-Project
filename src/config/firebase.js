import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config - Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBxoXQBOhEGxTtYVBjWWu1A2ceB4kV35kc",
  authDomain: "text-recognition-ed0d8.firebaseapp.com",
  projectId: "text-recognition-ed0d8",
  storageBucket: "text-recognition-ed0d8.firebasestorage.app",
  messagingSenderId: "463658852201",
  appId: "1:463658852201:web:dc1dbe64b98a636055a7f8",
  measurementId: "G-ZDJTFMQXKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;
