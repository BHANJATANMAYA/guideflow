import { create } from "zustand";
import type { AuthSession } from "../services/authService";

interface UserPreferences {
  notificationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  vibrationEnabled: boolean;
  crowdAvoidanceMode: boolean;
  arDirectionsEnabled: boolean;
  highContrastMode: boolean;
  largeTextEnabled: boolean;
}

export type UserPreferenceKey = keyof UserPreferences;

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  vipLevel: "Free" | "Pro" | "VIP";
  fanPoints: number;
  missionsCompleted: number;
  eventsAttended: number;
}

interface UserStore {
  user: UserProfile;
  preferences: UserPreferences;
  isAuthenticated: boolean;
  authReady: boolean;
  authProvider: AuthSession["provider"] | null;
  setAuthReady: (value: boolean) => void;
  applyAuthSession: (session: AuthSession | null) => void;
  resetAuthSession: () => void;
  updatePreference: (key: UserPreferenceKey, value: boolean) => void;
  addPoints: (points: number) => void;
}

const DEFAULT_USER: UserProfile = {
  uid: "guest-demo",
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatar:
    "https://lh3.googleusercontent.com/a/ACg8ocL8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R=s96-c",
  vipLevel: "Pro",
  fanPoints: 1250,
  missionsCompleted: 12,
  eventsAttended: 8,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  notificationsEnabled: true,
  soundEffectsEnabled: true,
  vibrationEnabled: false,
  crowdAvoidanceMode: true,
  arDirectionsEnabled: false,
  highContrastMode: false,
  largeTextEnabled: false,
};

export const useUserStore = create<UserStore>((set) => ({
  user: DEFAULT_USER,
  preferences: DEFAULT_PREFERENCES,
  isAuthenticated: false,
  authReady: false,
  authProvider: null,
  setAuthReady: (value) => set({ authReady: value }),
  applyAuthSession: (session) =>
    set((state) => {
      if (!session) {
        return {
          user: DEFAULT_USER,
          isAuthenticated: false,
          authProvider: null,
        };
      }

      const nextLevel = session.provider === "google" ? "Pro" : "Free";

      return {
        user: {
          ...state.user,
          uid: session.uid,
          name: session.name,
          email: session.email,
          avatar: session.avatar,
          vipLevel: nextLevel,
        },
        isAuthenticated: true,
        authProvider: session.provider,
      };
    }),
  resetAuthSession: () =>
    set({
      user: DEFAULT_USER,
      isAuthenticated: false,
      authProvider: null,
    }),
  updatePreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),
  addPoints: (points) =>
    set((state) => ({
      user: { ...state.user, fanPoints: state.user.fanPoints + points },
    })),
}));
