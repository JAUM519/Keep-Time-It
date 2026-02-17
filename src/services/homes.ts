import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { RoomType } from "../types/kti";

export type CreateRoomInput = {
  name: string;
  type: RoomType;
  isPrivate: boolean;
  ownerUid?: string | null;
};

export async function createHome(params: {
  uid: string;
  displayName: string;
  rooms: CreateRoomInput[];
}) {
  const { uid, displayName, rooms } = params;

  const homeRef = doc(collection(db, "homes"));
  const batch = writeBatch(db);

  batch.set(homeRef, { createdAt: serverTimestamp(), createdByUid: uid });

  // miembro creador
  batch.set(doc(db, "homes", homeRef.id, "members", uid), {
    uid,
    displayName: displayName || "Usuario",
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  // rooms
  for (const r of rooms) {
    const roomRef = doc(collection(db, "homes", homeRef.id, "rooms"));
    batch.set(roomRef, {
      name: r.name.trim(),
      type: r.type,
      isPrivate: r.isPrivate,
      ownerUid: r.isPrivate ? (r.ownerUid ?? uid) : null,
      createdAt: serverTimestamp(),
    });
  }

  // asigna home al usuario
  batch.update(doc(db, "users", uid), { homeId: homeRef.id });

  await batch.commit();
  return homeRef.id;
}

export async function joinHome(params: { uid: string; displayName: string; homeId: string }) {
  const { uid, displayName, homeId } = params;

  const homeRef = doc(db, "homes", homeId);
  const homeSnap = await getDoc(homeRef);
  if (!homeSnap.exists()) throw new Error("Ese hogar no existe.");

  const batch = writeBatch(db);

  batch.set(
    doc(db, "homes", homeId, "members", uid),
    {
      uid,
      displayName: displayName || "Usuario",
      role: "member",
      joinedAt: serverTimestamp(),
    },
    { merge: true }
  );

  batch.update(doc(db, "users", uid), { homeId });

  await batch.commit();
}
