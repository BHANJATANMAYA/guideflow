import { motion, AnimatePresence } from "framer-motion";
import type { Zone } from "../../types";
import { useMapStore } from "../../store/useMapStore";
import {
  LucideX,
  LucideNavigation2,
  LucideShieldAlert,
  LucideInfo,
} from "lucide-react";

interface ZoneDetailPopupProps {
  zone: Zone | null;
}

export const ZoneDetailPopup = ({ zone }: ZoneDetailPopupProps) => {
  const { setActiveZone } = useMapStore();

  if (!zone) return null;

  const density = zone.currentCount / zone.capacity;
  const isCrowded = density > 0.8;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="absolute top-32 left-10 w-80 z-20"
      >
        <div className="glass-panel rounded-[2rem] p-8 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">
                  location_on
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {zone.type}
                </span>
              </div>
              <h3 className="text-2xl font-headline font-black text-on-surface uppercase tracking-tight leading-none">
                {zone.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveZone(null)}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <LucideX size={16} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card rounded-2xl p-4 border border-white/5">
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                Density
              </p>
              <p
                className={`text-xl font-headline font-black ${isCrowded ? "text-rose-500" : "text-on-surface"}`}
              >
                {Math.round(density * 100)}%
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-white/5">
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                Wait Time
              </p>
              <p className="text-xl font-headline font-black text-primary-container">
                {zone.waitTime}m
              </p>
            </div>
          </div>

          {/* Alert / Info */}
          {isCrowded ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex gap-3 mb-6">
              <LucideShieldAlert className="text-rose-500 shrink-0" size={18} />
              <p className="text-[10px] text-rose-200 font-medium leading-relaxed">
                High congestion detected. We recommend avoiding this area for
                the next 15 minutes.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex gap-3 mb-6">
              <LucideInfo
                className="text-primary-container shrink-0"
                size={18}
              />
              <p className="text-[10px] text-primary-container font-medium leading-relaxed">
                Status: Optimal. This sector has the fastest transit speed right
                now.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button className="w-full py-4 rounded-2xl bg-primary-container text-on-primary-container font-headline font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-all">
              <LucideNavigation2 size={16} fill="currentColor" />
              Navigate Here
            </button>
            {isCrowded && (
              <button className="w-full py-3 rounded-2xl bg-white/5 text-slate-400 font-headline font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all">
                Find Alternative
              </button>
            )}
          </div>

          {/* Background Decor */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
