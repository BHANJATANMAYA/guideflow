import { create } from "zustand";
import type { Zone, VenueEvent, Recommendation, Notification } from "../types";

interface AppStore {
  // Navigation
  activeTab: "dashboard" | "map" | "assistant" | "profile";
  setActiveTab: (tab: "dashboard" | "map" | "assistant" | "profile") => void;

  // Modals & Panels
  isVIPModalOpen: boolean;
  isNotificationsPanelOpen: boolean;
  isHelpDrawerOpen: boolean;
  isRoutePlanningModalOpen: boolean;
  toggleModal: (modalName: "vip" | "notifications" | "help" | "route") => void;

  // Live Data
  event: VenueEvent | null;
  zones: Zone[];
  recommendations: Recommendation[];
  notifications: Notification[];
  loading: boolean;

  // Setters
  setEvent: (event: VenueEvent | null) => void;
  setZones: (zones: Zone[]) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),

  isVIPModalOpen: false,
  isNotificationsPanelOpen: false,
  isHelpDrawerOpen: false,
  isRoutePlanningModalOpen: false,

  toggleModal: (name) =>
    set((state) => {
      switch (name) {
        case "vip":
          return { isVIPModalOpen: !state.isVIPModalOpen };
        case "notifications":
          return { isNotificationsPanelOpen: !state.isNotificationsPanelOpen };
        case "help":
          return { isHelpDrawerOpen: !state.isHelpDrawerOpen };
        case "route":
          return { isRoutePlanningModalOpen: !state.isRoutePlanningModalOpen };
        default:
          return state;
      }
    }),

  event: null,
  zones: [],
  recommendations: [],
  notifications: [],
  loading: true,

  setEvent: (event) => set({ event }),
  setZones: (zones) => set({ zones }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setNotifications: (notifications) => set({ notifications }),
  setLoading: (loading) => set({ loading }),
}));
