import { create } from "zustand";
import type { Route } from "../types";

interface MapStore {
  activeZoneId: string | null;
  selectedRoute: Route | null;
  heatmapEnabled: boolean;
  visibleLayers: string[];

  setActiveZone: (id: string | null) => void;
  setSelectedRoute: (route: Route | null) => void;
  toggleHeatmap: () => void;
  toggleLayer: (layerId: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  activeZoneId: null,
  selectedRoute: null,
  heatmapEnabled: false,
  visibleLayers: ["zones", "pathways"],

  setActiveZone: (id) => set({ activeZoneId: id }),
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  toggleHeatmap: () =>
    set((state) => ({ heatmapEnabled: !state.heatmapEnabled })),
  toggleLayer: (layerId) =>
    set((state) => ({
      visibleLayers: state.visibleLayers.includes(layerId)
        ? state.visibleLayers.filter((l) => l !== layerId)
        : [...state.visibleLayers, layerId],
    })),
}));
