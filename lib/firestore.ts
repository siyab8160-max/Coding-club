import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { Event, Registration, Comment, Member, UserRole } from "@/types";

function firestore() {
  const database = getDb();
  if (!database) {
    throw new Error(
      "Firestore is not available. Check .env.local and restart the dev server."
    );
  }
  return database;
}

// ——— Events ———

export async function getEvents(constraints: QueryConstraint[] = []) {
  const q = query(collection(firestore(), "events"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Event
  );
}

export async function getFeaturedEvents(count = 3) {
  return getEvents([orderBy("date", "desc"), limit(count)]);
}

export async function getEventBySlug(slug: string) {
  const q = query(collection(firestore(), "events"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Event;
}

export async function createEvent(
  data: Omit<Event, "id" | "createdAt">
) {
  const ref = await addDoc(collection(firestore(), "events"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEvent(id: string, data: Partial<Event>) {
  await updateDoc(doc(firestore(), "events", id), data);
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(firestore(), "events", id));
}

// ——— Registrations ———

export async function createRegistration(
  data: Omit<Registration, "id" | "timestamp">
) {
  const ref = await addDoc(collection(firestore(), "registrations"), {
    ...data,
    timestamp: serverTimestamp(),
  });
  return ref.id;
}

export async function getRegistrationByUserAndEvent(
  userId: string,
  eventId: string
) {
  const q = query(
    collection(firestore(), "registrations"),
    where("userId", "==", userId),
    where("eventId", "==", eventId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Registration;
}

export async function getRegistrations(eventId?: string) {
  const constraints: QueryConstraint[] = [orderBy("timestamp", "desc")];
  if (eventId) constraints.unshift(where("eventId", "==", eventId));
  const q = query(collection(firestore(), "registrations"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Registration
  );
}

export async function getRecentRegistrations(count = 10) {
  const q = query(
    collection(firestore(), "registrations"),
    orderBy("timestamp", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Registration
  );
}

export async function getRegistrationCount() {
  const snapshot = await getDocs(collection(firestore(), "registrations"));
  return snapshot.size;
}

// ——— Comments ———

export function subscribeToComments(
  eventId: string,
  callback: (comments: Comment[]) => void
) {
  const q = query(
    collection(firestore(), "comments"),
    where("eventId", "==", eventId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs
      .map(
        (d) =>
          ({ id: d.id, ...d.data(), replies: d.data().replies || [] }) as Comment
      )
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return 0;
      });
    callback(comments);
  });
}

export async function createComment(data: {
  eventId: string;
  userId: string;
  userName: string;
  message: string;
}) {
  await addDoc(collection(firestore(), "comments"), {
    ...data,
    isPinned: false,
    replies: [],
    createdAt: serverTimestamp(),
  });
}

export async function addReply(
  commentId: string,
  reply: { userId: string; userName: string; message: string }
) {
  const ref = doc(firestore(), "comments", commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const replies = snap.data().replies || [];
  replies.push({ ...reply, createdAt: Timestamp.now() });
  await updateDoc(ref, { replies });
}

export async function deleteComment(commentId: string) {
  await deleteDoc(doc(firestore(), "comments", commentId));
}

export async function togglePinComment(commentId: string, isPinned: boolean) {
  await updateDoc(doc(firestore(), "comments", commentId), { isPinned });
}

export async function getAllComments(limitCount = 50) {
  const q = query(
    collection(firestore(), "comments"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data(), replies: d.data().replies || [] }) as Comment
  );
}

// ——— Members ———

export async function getMembers() {
  const q = query(collection(firestore(), "members"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Member
  );
}

export async function getTeamPreview(count = 6) {
  const q = query(collection(firestore(), "members"), orderBy("name"), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Member
  );
}

// ——— Stats ———

export async function getSiteStats() {
  const [events, registrations, members, statsDoc] = await Promise.all([
    getDocs(collection(firestore(), "events")),
    getDocs(collection(firestore(), "registrations")),
    getDocs(collection(firestore(), "members")),
    getDoc(doc(firestore(), "settings", "stats")),
  ]);
  const visitors = statsDoc.exists() ? statsDoc.data().visitors ?? 0 : 0;
  return {
    members: members.size,
    eventsHosted: events.size,
    registrations: registrations.size,
    visitors,
  };
}

export async function incrementVisitors() {
  const ref = doc(firestore(), "settings", "stats");
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data().visitors ?? 0 : 0;
  await updateDoc(ref, { visitors: current + 1 }).catch(async () => {
    const { setDoc } = await import("firebase/firestore");
    await setDoc(ref, { visitors: 1 });
  });
}

// ——— Users ———

export async function getUsersCount() {
  const snapshot = await getDocs(collection(firestore(), "users"));
  return snapshot.size;
}

export async function searchUserByEmail(email: string) {
  const q = query(collection(firestore(), "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { uid: d.id, ...d.data() };
}

export async function updateUserRoleByUid(uid: string, role: UserRole) {
  await updateDoc(doc(firestore(), "users", uid), { role });
}
