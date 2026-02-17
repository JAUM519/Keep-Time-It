import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Item, ItemKind } from "../types/kti";

export function subscribeItems(homeId: string, roomId: string, onData: (items: Item[]) => void) {
  const q = query(
    collection(db, "homes", homeId, "rooms", roomId, "items"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const list: Item[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    onData(list);
  });
}

export async function addItem(homeId: string, roomId: string, payload: { name: string; kind: ItemKind }) {
  const name = payload.name.trim();
  if (!name) throw new Error("Nombre requerido.");

  const ref = doc(collection(db, "homes", homeId, "rooms", roomId, "items"));
  await setDoc(ref, {
    name,
    kind: payload.kind,
    totalMs: 0,
    activeSession: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function renameItem(homeId: string, roomId: string, itemId: string, name: string) {
  const clean = name.trim();
  if (!clean) throw new Error("Nombre requerido.");
  await updateDoc(doc(db, "homes", homeId, "rooms", roomId, "items", itemId), { name: clean, updatedAt: serverTimestamp() });
}

export async function deleteItem(homeId: string, roomId: string, itemId: string) {
  await updateDoc(doc(db, "homes", homeId, "rooms", roomId, "items", itemId), { deletedAt: serverTimestamp() });
  // si prefieres borrar de verdad:
  // await deleteDoc(doc(db, "homes", homeId, "rooms", roomId, "items", itemId));
}

export async function toggleItem(params: {
  homeId: string;
  roomId: string;
  roomName: string;
  itemId: string;
  itemName: string;
  kind: ItemKind;
  uid: string;
}) {
  const { homeId, roomId, roomName, itemId, itemName, kind, uid } = params;

  const itemRef = doc(db, "homes", homeId, "rooms", roomId, "items", itemId);
  const sessionsCol = collection(db, "homes", homeId, "sessions");
  const now = Timestamp.now();

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(itemRef);
    if (!snap.exists()) return;

    const data = snap.data() as any;
    const active = data.activeSession as any | null;

    // START
    if (!active) {
      tx.update(itemRef, { activeSession: { startedAt: now, startedByUid: uid }, updatedAt: now });
      return;
    }

    // STOP
    const startedAtTs = active.startedAt;
    const startedAtMs = startedAtTs?.toMillis?.() ? startedAtTs.toMillis() : null;
    if (!startedAtMs) {
      tx.update(itemRef, { activeSession: null, updatedAt: now });
      return;
    }

    const durationMs = Math.max(0, now.toMillis() - startedAtMs);

    const sessionRef = doc(sessionsCol);
    tx.set(sessionRef, {
      roomId,
      roomName,
      itemId,
      itemName,
      kind,
      startedAt: startedAtTs,
      endedAt: now,
      durationMs,
      startedByUid: active.startedByUid,
      endedByUid: uid,
    });

    tx.update(itemRef, {
      activeSession: null,
      totalMs: (data.totalMs ?? 0) + durationMs,
      updatedAt: now,
    });
  });
}
