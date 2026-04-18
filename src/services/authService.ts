import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import {
  createGoogleProvider,
  getFirebaseAuth,
  getFirestoreDb,
  isFirebaseConfigured,
} from "./firebaseClient";

export interface AuthSession {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google" | "guest";
}

const GUEST_SESSION_KEY = "guideflow_guest_session";

const createAvatarDataUri = (name: string) => {
  const initials = name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "GF";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f5a0" />
          <stop offset="100%" stop-color="#00d9ff" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="28" fill="url(#bg)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#042436" font-family="Arial, sans-serif" font-size="32" font-weight="700">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const normalizeName = (name: string) => name.trim().replace(/\s+/g, " ");

const buildGuestSession = (name: string, uid?: string): AuthSession => {
  const normalizedName = normalizeName(name);
  const sanitized = normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    uid: uid || `guest-${sanitized || "fan"}`,
    name: normalizedName || "GuideFlow Fan",
    email: "",
    avatar: createAvatarDataUri(normalizedName || "GuideFlow Fan"),
    provider: "guest",
  };
};

const readStoredGuestSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(GUEST_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed.provider === "guest" ? parsed : null;
  } catch {
    return null;
  }
};

const storeGuestSession = (session: AuthSession) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
};

const clearGuestSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_SESSION_KEY);
};

const persistSessionProfile = async (session: AuthSession) => {
  const db = getFirestoreDb();

  if (!db) {
    return;
  }

  await setDoc(
    doc(db, "users", session.uid),
    {
      displayName: session.name,
      email: session.email,
      avatar: session.avatar,
      provider: session.provider,
      lastLogin: Date.now(),
    },
    { merge: true },
  );
};

const mapFirebaseSession = (user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}): AuthSession => {
  if (user.isAnonymous) {
    const storedGuestSession = readStoredGuestSession();
    return buildGuestSession(storedGuestSession?.name || "GuideFlow Fan", user.uid);
  }

  const name = user.displayName || user.email?.split("@")[0] || "GuideFlow User";

  return {
    uid: user.uid,
    name,
    email: user.email || "",
    avatar: user.photoURL || createAvatarDataUri(name),
    provider: "google",
  };
};

export const isGoogleSignInAvailable = isFirebaseConfigured;

export const continueAsGuest = async (name: string): Promise<AuthSession> => {
  const auth = getFirebaseAuth();

  if (!auth) {
    const session = buildGuestSession(name);
    storeGuestSession(session);
    return session;
  }

  const credential =
    auth.currentUser?.isAnonymous && auth.currentUser.uid
      ? auth.currentUser
      : (await signInAnonymously(auth)).user;

  const session = buildGuestSession(name, credential.uid);
  storeGuestSession(session);
  await persistSessionProfile(session);
  return session;
};

export const signInWithGoogle = async (): Promise<AuthSession> => {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error(
      "Firebase Auth is not configured yet. Add your Firebase config in .env to enable Google login.",
    );
  }

  const result = await signInWithPopup(auth, createGoogleProvider());
  const session = mapFirebaseSession(result.user);
  clearGuestSession();
  await persistSessionProfile(session);
  return session;
};

export const signOutSession = async () => {
  clearGuestSession();

  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    await signOut(auth);
  }
};

export const subscribeToAuthSession = (
  callback: (session: AuthSession | null) => void,
) => {
  const auth = getFirebaseAuth();
  const guestSession = readStoredGuestSession();

  if (!auth) {
    callback(guestSession);
    return () => {};
  }

  callback(guestSession);

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(mapFirebaseSession(user));
      return;
    }

    callback(readStoredGuestSession());
  });
};
