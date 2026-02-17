import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { HomeMember } from "../types/kti";

export function subscribeMembers(homeId: string, onData: (m: HomeMember[]) => void) {
  const q = query(collection(db, "homes", homeId, "members"), orderBy("joinedAt", "asc"));
  return onSnapshot(q, (snap) => {
    const list: HomeMember[] = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
    onData(list);
  });
}
