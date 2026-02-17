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
import { Room } from "../types/models";

function roomsCol(uid: string) {
  return collection(db, "users", uid, "rooms");
}

export function subscribeRooms(uid: string, onData: (rooms: Room[]) => void, onError?: (e: unknown) => void) {
  const q = query(roomsCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const rooms: Room[] = snap.docs.map((d) => ({
        id: d.id,
        name: String(d.data().name ?? ""),
        createdAt: d.data().createdAt,
      }));
      onData(rooms);
    },
    (e) => onError?.(e)
  );
}

export async function createRoom(uid: string, name: string) {
  const clean = name.trim();
  if (!clean) throw new Error("El nombre de la habitación es requerido.");
  await addDoc(roomsCol(uid), { name: clean, createdAt: serverTimestamp() });
}

export async function renameRoom(uid: string, roomId: string, name: string) {
  const clean = name.trim();
  if (!clean) throw new Error("El nombre de la habitación es requerido.");
  await updateDoc(doc(roomsCol(uid), roomId), { name: clean });
}

export async function deleteRoom(uid: string, roomId: string) {
  await deleteDoc(doc(roomsCol(uid), roomId));
}
