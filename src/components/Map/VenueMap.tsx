import React, { useMemo } from "react";
import {
  LucideLayers,
  LucideMapPin,
  LucideRoute,
  LucideSparkles,
} from "lucide-react";

import type { Zone } from "../../types";
import { useMapStore } from "../../store/useMapStore";
import { calculateRoutes } from "../../utils/routeOptimizer";
import { StadiumSVG } from "./StadiumSVG";
import { HeatmapOverlay } from "./HeatmapOverlay";
import { RouteOverlay } from "./RouteOverlay";
import { ZoneDetailPopup } from "./ZoneDetailPopup";
import { SectorQuickAccess } from "./SectorQuickAccess";

interface VenueMapProps {
  zones: Zone[];
}

export const VenueMap = React.memo(({ zones }: VenueMapProps) => {
  const {
    activeZoneId,
    heatmapEnabled,
    toggleHeatmap,
    selectedRoute,
    setSelectedRoute,
    visibleLayers,
  } = useMapStore();

  const activeZone = useMemo(
    () => zones.find((zone) => zone.id === activeZoneId) || null,
    [activeZoneId, zones],
  );

  const recommendedRoute = useMemo(() => {
    if (!activeZone || activeZone.type === "gate") {
      return null;
    }

    const entryGate = zones
      .filter((zone) => zone.type === "gate")
      .sort((left, right) => left.waitTime - right.waitTime)[0];

    if (!entryGate) {
      return null;
    }

    return calculateRoutes(entryGate, activeZone, zones)[1] ?? null;
  }, [activeZone, zones]);

  return (
    <div className="w-full h-full glass-panel rounded-[3rem] p-6 lg:p-10 relative overflow-hidden flex flex-col items-center justify-center border-2 border-white/5 shadow-2xl transition-all">
      {zones.length === 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary-container border-t-transparent animate-spin"/>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-container animate-pulse">Initializing Layout Grid</span>
          </div>
        </div>
      )}

      <div className="absolute top-10 left-10 z-20 space-y-2 pointer-events-none">
        <h3 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none">
          Stadium Dynamics
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Live Sector Alpha-6
            </span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <LucideMapPin size={12} className="text-secondary-container" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Active Navigation:
            </span>
            <span className="text-[10px] text-primary-fixed font-black uppercase text-primary-container">
              {selectedRoute ? selectedRoute.name : "None"}
            </span>
          </div>
          {selectedRoute && (
            <>
              <div className="h-4 w-px bg-white/10"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {selectedRoute.estimatedTime} min • {selectedRoute.distance} m
              </span>
            </>
          )}
        </div>
      </div>

      <div className="absolute top-10 right-10 z-30 flex flex-col gap-4">
        <MapControlButton
          active={heatmapEnabled}
          onClick={toggleHeatmap}
          icon={<LucideSparkles size={24} />}
          label="Heatmap"
        />
        <MapControlButton
          active={visibleLayers.length > 2}
          onClick={() => {}}
          icon={<LucideLayers size={24} />}
          label="Layers"
        />
      </div>

      <div className="relative w-full h-full max-h-[600px] flex items-center justify-center">
        <StadiumSVG zones={zones} />
        <HeatmapOverlay zones={zones} enabled={heatmapEnabled} />
        <RouteOverlay selectedRoute={selectedRoute} />
      </div>

      <ZoneDetailPopup zone={activeZone} />
      <SectorQuickAccess zones={zones} />

      <button
        type="button"
        aria-label={
          recommendedRoute
            ? `Show ${recommendedRoute.name.toLowerCase()} to ${activeZone?.name}`
            : "Select a destination zone to preview a route"
        }
        disabled={!recommendedRoute}
        onClick={() => {
          if (recommendedRoute) {
            setSelectedRoute(recommendedRoute);
          }
        }}
        className="absolute top-1/2 right-10 -translate-y-1/2 z-20 w-16 h-48 glass-panel border border-white/5 rounded-full flex flex-col items-center justify-center gap-6 hover:bg-white/10 hover:scale-105 transition-all group disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        <span className="[writing-mode:vertical-lr] font-headline font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 group-hover:text-primary-container transition-colors">
          Route Finder
        </span>
        <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
          <LucideRoute size={20} />
        </div>
      </button>

      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
});

const MapControlButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="group relative flex items-center justify-end">
    <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-surface-container-highest text-[10px] font-black uppercase tracking-widest text-on-surface opacity-0 group-hover:opacity-100 transition-opacity border border-white/5 whitespace-nowrap">
      {label}
    </span>
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 ${
        active
          ? "bg-primary-container text-on-primary-container shadow-[0_0_30px_rgba(0,245,160,0.4)]"
          : "bg-surface-container-high/80 backdrop-blur-xl text-slate-400 border border-white/5 hover:text-on-surface hover:border-white/20"
      }`}
    >
      {icon}
    </button>
  </div>
);
