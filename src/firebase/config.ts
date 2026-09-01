import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Authorized Administrator Email (Strictly enforced in code and Firestore rules)
export const AUTHORIZED_ADMIN_EMAIL = 'Collinsmonye5227@gmail.com';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || env.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseConfigJson.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: firebaseConfigJson.projectId || env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: firebaseConfigJson.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: firebaseConfigJson.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseConfigJson.appId || env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase App instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore (using custom databaseId if configured)
export const db = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

/**
 * Checks if a given email is the authorized admin email (case-insensitive)
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
}
