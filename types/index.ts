import { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "admin" | "superadmin";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Timestamp;
}

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerURL: string;
  venue: string;
  date: Timestamp;
  registrationDeadline: Timestamp;
  organizers: string[];
  prizes: string;
  rules: string;
  schedule: ScheduleItem[];
  createdBy: string;
  createdAt: Timestamp;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  participantName: string;
  email: string;
  college: string;
  phone: string;
  teamName?: string;
  timestamp: Timestamp;
}

export interface CommentReply {
  userId: string;
  userName: string;
  message: string;
  createdAt: Timestamp;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  isPinned: boolean;
  createdAt: Timestamp;
  replies: CommentReply[];
}

export interface Member {
  id: string;
  name: string;
  role: string;
  category: "core" | "developers" | "designers" | "coordinators";
  photoURL?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface SiteStats {
  members: number;
  eventsHosted: number;
  registrations: number;
  visitors: number;
}
