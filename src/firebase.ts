import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const clean = (val?: string) => (val ? val.trim() : '');

// Cấu hình Firebase chuẩn của dự án Ing-Lich-Tet
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCLYAAHcUAIvkAPXa-mxGDcq5Ig9OwaMDE",
  authDomain: "ing-lich-tet.firebaseapp.com",
  projectId: "ing-lich-tet",
  storageBucket: "ing-lich-tet.firebasestorage.app",
  messagingSenderId: "915202470264",
  appId: "1:915202470264:web:7a6d753027fce31b5f988d",
  measurementId: "G-T0HPN9QJ72"
};

const rawApiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY) || DEFAULT_FIREBASE_CONFIG.apiKey;
const rawProjectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID) || DEFAULT_FIREBASE_CONFIG.projectId;
const rawAuthDomain = clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || DEFAULT_FIREBASE_CONFIG.authDomain;
const rawAppId = clean(import.meta.env.VITE_FIREBASE_APP_ID) || DEFAULT_FIREBASE_CONFIG.appId;
const rawMessagingSenderId = clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || DEFAULT_FIREBASE_CONFIG.messagingSenderId;

// Tự động sửa lỗi nhầm số 0 thành chữ O nếu biến môi trường Vercel vẫn còn lưu key cũ
const apiKey = rawApiKey.replace('Ig90waMDE', 'Ig9OwaMDE');

// Canonical Firebase auth domain luôn là {projectId}.firebaseapp.com để popup hoạt động ổn định nhất
const authDomain =
  rawAuthDomain && !rawAuthDomain.endsWith('vercel.app')
    ? rawAuthDomain
    : `${rawProjectId}.firebaseapp.com`;

const firebaseConfig = {
  apiKey: apiKey,
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
