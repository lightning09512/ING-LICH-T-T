import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const clean = (val?: string) => (val ? val.trim() : '');

const rawApiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const rawProjectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const rawAuthDomain = clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
const rawAppId = clean(import.meta.env.VITE_FIREBASE_APP_ID);
const rawMessagingSenderId = clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);

// Canonical Firebase auth domain is {projectId}.firebaseapp.com.
// If rawAuthDomain was set to the Vercel app domain, prefer firebaseapp.com for reliable popups.
const authDomain =
  rawAuthDomain && !rawAuthDomain.endsWith('vercel.app')
    ? rawAuthDomain
    : rawProjectId
    ? `${rawProjectId}.firebaseapp.com`
    : rawAuthDomain;

const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: authDomain,
  projectId: rawProjectId,
  appId: rawAppId,
  messagingSenderId: rawMessagingSenderId,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null;

export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
