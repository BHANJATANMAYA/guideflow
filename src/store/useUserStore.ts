import { create } from "zustand";

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

interface UserStore {
  user: {
    name: string;
    email: string;
    avatar: string;
    vipLevel: "Free" | "Pro" | "VIP";
    fanPoints: number;
    missionsCompleted: number;
    eventsAttended: number;
  };
  preferences: UserPreferences;
  updatePreference: (key: UserPreferenceKey, value: boolean) => void;
  addPoints: (points: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocL8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R8R=s96-c",
    vipLevel: "Pro",
    fanPoints: 1250,
    missionsCompleted: 12,
    eventsAttended: 8,
  },
  preferences: {
    notificationsEnabled: true,
    soundEffectsEnabled: true,
    vibrationEnabled: false,
    crowdAvoidanceMode: true,
    arDirectionsEnabled: false,
    highContrastMode: false,
    largeTextEnabled: false,
  },
  updatePreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),
  addPoints: (points) =>
    set((state) => ({
      user: { ...state.user, fanPoints: state.user.fanPoints + points },
    })),
}));
