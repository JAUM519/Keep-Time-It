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
import { Device, ResourceType } from "../types/models";

function devicesCol(uid: string, roomId: string) {
  return collection(db, "users", uid, "rooms", roomId, "devices");
}

export function subscribeDevices(
  uid: string,
  roomId: string,
  onData: (devices: Device[]) => void,
  onError?: (e: unknown) => void
) {
  const q = query(devicesCol(uid, roomId), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const devices: Device[] = snap.docs.map((d) => ({
        id: d.id,
        roomId,
        name: String(d.data().name ?? ""),
        resourceType: (d.data().resourceType ?? "energia") as ResourceType,
        notes: d.data().notes ? String(d.data().notes) : undefined,
        createdAt: d.data().createdAt,
      }));
      onData(devices);
    },
    (e) => onError?.(e)
  );
}

export async function createDevice(uid: string, roomId: string, payload: { name: string; resourceType: ResourceType; notes?: string }) {
  const name = payload.name.trim();
  if (!name) throw new Error("El nombre del dispositivo es requerido.");

  await addDoc(devicesCol(uid, roomId), {
    name,
    resourceType: payload.resourceType,
    notes: payload.notes?.trim() || "",
    createdAt: serverTimestamp(),
  });
}

export async function updateDevice(uid: string, roomId: string, deviceId: string, updates: Partial<{ name: string; notes: string }>) {
  const ref = doc(devicesCol(uid, roomId), deviceId);
  const patch: Record<string, unknown> = {};
  if (typeof updates.name === "string") patch.name = updates.name.trim();
  if (typeof updates.notes === "string") patch.notes = updates.notes.trim();
  await updateDoc(ref, patch);
}

export async function deleteDevice(uid: string, roomId: string, deviceId: string) {
  await deleteDoc(doc(devicesCol(uid, roomId), deviceId));
}
