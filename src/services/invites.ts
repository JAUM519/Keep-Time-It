import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Invite } from "../types/kti";
import { joinHome } from "./homes";

export function subscribeInvitesForUser(uid: string, onData: (inv: Invite[]) => void) {
  const q = query(collection(db, "invites"), where("toUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const list: Invite[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    onData(list);
  });
}

export async function sendInvite(params: {
  homeId: string;
  fromUid: string;
  toUid: string;
}) {
  const { homeId, fromUid, toUid } = params;

  if (fromUid === toUid) throw new Error("No puedes invitarte a ti mismo.");

  const inviteRef = doc(collection(db, "invites"));
  await setDoc(inviteRef, {
    homeId,
    fromUid,
    toUid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function acceptInvite(params: {
  inviteId: string;
  uid: string;
  displayName: string;
}) {
  const { inviteId, uid, displayName } = params;

  const ref = doc(db, "invites", inviteId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Invitación no encontrada.");

  const inv = snap.data() as any;
  if (inv.toUid !== uid) throw new Error("Esta invitación no es para ti.");
  if (inv.status !== "pending") throw new Error("Esta invitación ya fue respondida.");

  await joinHome({ uid, displayName, homeId: inv.homeId });
  await updateDoc(ref, { status: "accepted", respondedAt: serverTimestamp() });
}

export async function declineInvite(params: { inviteId: string; uid: string }) {
  const { inviteId, uid } = params;

  const ref = doc(db, "invites", inviteId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Invitación no encontrada.");

  const inv = snap.data() as any;
  if (inv.toUid !== uid) throw new Error("Esta invitación no es para ti.");
  if (inv.status !== "pending") throw new Error("Esta invitación ya fue respondida.");

  await updateDoc(ref, { status: "declined", respondedAt: serverTimestamp() });
}
