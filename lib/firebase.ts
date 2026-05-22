import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* vars to .env.local"
    );
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured || typeof window === "undefined") return null;
  if (!_auth) _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getDb(): Firestore | null {
  if (!isFirebaseConfigured || typeof window === "undefined") return null;
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getStorageInstance(): FirebaseStorage | null {
  if (!isFirebaseConfigured || typeof window === "undefined") return null;
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}

/** @deprecated Use getFirebaseAuth() — kept for existing imports */
export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    const instance = getFirebaseAuth();
    if (!instance) {
      throw new Error(
        "Firebase Auth is not ready. Add .env.local and restart the dev server."
      );
    }
    return Reflect.get(instance, prop);
  },
});

/** @deprecated Use getDb() */
export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    const instance = getDb();
    if (!instance) {
      throw new Error(
        "Firestore is not ready. Add .env.local and restart the dev server."
      );
    }
    return Reflect.get(instance, prop);
  },
});

/** @deprecated Use getStorageInstance() */
export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_, prop) {
    const instance = getStorageInstance();
    if (!instance) {
      throw new Error(
        "Firebase Storage is not ready. Add .env.local and restart the dev server."
      );
    }
    return Reflect.get(instance, prop);
  },
});

export const initAnalytics = async (): Promise<Analytics | null> => {
  if (!isFirebaseConfigured || typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(getFirebaseApp());
};

export default getFirebaseApp;
