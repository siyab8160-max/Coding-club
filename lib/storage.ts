import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadEventBanner(
  file: File,
  eventId: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  return uploadFile(file, `events/${eventId}/banner.${ext}`);
}

export async function uploadMemberPhoto(
  file: File,
  memberId: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  return uploadFile(file, `members/${memberId}/photo.${ext}`);
}
