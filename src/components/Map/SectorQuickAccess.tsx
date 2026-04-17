import { motion } from "framer-motion";
import type { Zone } from "../../types";
import { useMapStore } from "../../store/useMapStore";
import { LucideClock, LucideUsers } from "lucide-react";

interface SectorQuickAccessProps {
  zones: Zone[];
}

export const SectorQuickAccess = ({ zones }: SectorQuickAccessProps) => {
  const { activeZoneId, setActiveZone } = useMapStore();

  const getStatusColor = (zone: Zone) => {
    const density = zone.currentCount / zone.capacity;
    if (density > 0.8) return "bg-rose-500";
    if (density > 0.5) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="absolute bottom-10 left-6 right-6 z-10">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
        {zones.map((zone) => (
          <motion.button
            key={zone.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveZone(zone.id)}
            className={`flex-shrink-0 w-64 p-5 rounded-[2rem] glass-panel border transition-all flex flex-col gap-4 ${
              activeZoneId === zone.id
                ? "border-primary-container bg-primary-container/10 ring-4 ring-primary-container/5 scale-105"
                : "border-white/5 bg-surface-container-low/40 hover:bg-white/5"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(zone)} animate-pulse`}
                />
                <h4 className="text-sm font-headline font-black text-on-surface uppercase tracking-tighter">
                  {zone.name}
                </h4>
              </div>
              <div className="px-2 py-0.5 rounded-lg bg-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                Sector {zone.id.replace("z", "")}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center gap-1">
                  <LucideClock size={10} /> Wait Time
                </p>
                <p className="text-lg font-headline font-black text-primary-container">
                  {zone.waitTime}m
                </p>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="space-y-1 text-right">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center justify-end gap-1">
                  Capacity <LucideUsers size={10} />
                </p>
                <p className="text-lg font-headline font-black text-on-surface">
                  {Math.round((zone.currentCount / zone.capacity) * 100)}%
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
