import { signOut as fbSignOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";

export type AuthListener = (user: User | null) => void;

export function listenAuthState(listener: AuthListener) {
  return onAuthStateChanged(auth, listener);
}

export async function signOut() {
  await fbSignOut(auth);
}
