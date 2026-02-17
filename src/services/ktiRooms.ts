import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Room, RoomType } from "../types/kti";

export function subscribeRooms(homeId: string, onData: (rooms: Room[]) => void) {
  const q = query(collection(db, "homes", homeId, "rooms"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const list: Room[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    onData(list);
  });
}

export async function addRoom(homeId: string, payload: { name: string; type: RoomType; isPrivate: boolean; ownerUid?: string | null }) {
  const name = payload.name.trim();
  if (!name) throw new Error("Nombre requerido.");

  await addDoc(collection(db, "homes", homeId, "rooms"), {
    name,
    type: payload.type,
    isPrivate: payload.isPrivate,
    ownerUid: payload.isPrivate ? (payload.ownerUid ?? null) : null,
    createdAt: serverTimestamp(),
  });
}

export async function renameRoom(homeId: string, roomId: string, name: string) {
  const clean = name.trim();
  if (!clean) throw new Error("Nombre requerido.");
  await updateDoc(doc(db, "homes", homeId, "rooms", roomId), { name: clean });
}

export async function deleteRoom(homeId: string, roomId: string) {
  await deleteDoc(doc(db, "homes", homeId, "rooms", roomId));
}
