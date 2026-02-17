import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserProfile } from "../types/kti";

type AppStateValue = {
  uid: string | null;
  profile: UserProfile | null;
  profileLoading: boolean;
  homeId: string | null;
  editorMode: boolean;
  setEditorMode: (v: boolean) => void;
};

const Ctx = React.createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [editorMode, setEditorMode] = React.useState(false);

  React.useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setEditorMode(false);

      unsubProfile?.();
      unsubProfile = null;

      if (!user) {
        setUid(null);
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setUid(user.uid);
      setProfileLoading(true);

      // asegura doc de usuario
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          phoneNumber: user.phoneNumber ?? null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      unsubProfile = onSnapshot(
        userRef,
        (snap) => {
          const data = snap.data() as any;
          setProfile({
            uid: user.uid,
            phoneNumber: user.phoneNumber ?? null,
            displayName: String(data?.displayName ?? ""),
            homeId: (data?.homeId ?? null) as string | null,
          });
          setProfileLoading(false);
        },
        () => setProfileLoading(false)
      );
    });

    return () => {
      unsubProfile?.();
      unsubAuth();
    };
  }, []);

  const value: AppStateValue = {
    uid,
    profile,
    profileLoading,
    homeId: profile?.homeId ?? null,
    editorMode,
    setEditorMode,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAppState debe usarse dentro de AppStateProvider");
  return v;
}
