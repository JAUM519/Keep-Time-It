import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function setDisplayName(uid: string, displayName: string) {
  await updateDoc(doc(db, "users", uid), { displayName: displayName.trim() });
}
