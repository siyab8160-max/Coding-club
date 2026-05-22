import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "./firebase";
import { User, UserRole } from "@/types";

const googleProvider = new GoogleAuthProvider();

export const SESSION_COOKIE = "kaizen-session";

export function setSessionCookie(uid: string) {
  document.cookie = `${SESSION_COOKIE}=${uid}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

function requireFirebase() {
  const auth = getFirebaseAuth();
  const db = getDb();
  if (!isFirebaseConfigured || !auth || !db) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local and restart."
    );
  }
  return { auth, db };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser> {
  const { auth, db } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(credential.user, { displayName: name });
  await createUserDocument(db, credential.user, name);
  setSessionCookie(credential.user.uid);
  return credential.user;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const { auth } = requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  setSessionCookie(credential.user.uid);
  return credential.user;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const { auth, db } = requireFirebase();
  const credential = await signInWithPopup(auth, googleProvider);
  const existing = await getDoc(doc(db, "users", credential.user.uid));
  if (!existing.exists()) {
    await createUserDocument(
      db,
      credential.user,
      credential.user.displayName || "User"
    );
  }
  setSessionCookie(credential.user.uid);
  return credential.user;
}

export async function logOut(): Promise<void> {
  clearSessionCookie();
  const auth = getFirebaseAuth();
  if (auth) await signOut(auth);
}

async function createUserDocument(
  db: NonNullable<ReturnType<typeof getDb>>,
  user: FirebaseUser,
  name: string
): Promise<void> {
  const userData: Omit<User, "createdAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
  } = {
    uid: user.uid,
    name,
    email: user.email || "",
    role: "user",
    photoURL: user.photoURL || undefined,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, "users", user.uid), userData);
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { ...snap.data(), uid: snap.id } as User;
}

export async function updateUserRole(
  email: string,
  role: UserRole
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured.");
  const { collection, query, where, getDocs, updateDoc } = await import(
    "firebase/firestore"
  );
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found");
  await updateDoc(snapshot.docs[0].ref, { role });
}

export function isAdminRole(role: UserRole | null): boolean {
  return role === "admin" || role === "superadmin";
}
