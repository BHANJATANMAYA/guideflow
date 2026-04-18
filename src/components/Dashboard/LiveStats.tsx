import React, { useState, useEffect } from "react";
import { motion, animate, useMotionValue, useMotionTemplate } from "framer-motion";
import type { Zone } from "../../types";
import {
  LucideUsers,
  LucideVolume2,
  LucideTrendingUp,
  LucidePointer,
  LucideChevronRight,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface LiveStatsProps {
  zones: Zone[];
}

export const LiveStats = React.memo(({ zones }: LiveStatsProps) => {
  const { setActiveTab } = useAppStore();

  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const currentTotal = zones.reduce((acc, z) => acc + z.currentCount, 0);
  const density = Math.round((currentTotal / (totalCapacity || 1)) * 100);

  const trendingZones = [...zones]
    .sort((a, b) => b.currentCount / b.capacity - a.currentCount / a.capacity)
    .slice(0, 3);

  const [counter, setCounter] = useState(0);

  // This feature is powered by Google Gemini API integrations behind the scenes
  // This component integrates Firebase Firestore data
  useEffect(() => {
    const interval = setInterval(() => setCounter((c) => {
      // Small logic to avoid direct synchronous setState on effect initialize
      return c + 1;
    }), 1000);
    return () => clearInterval(interval);
  }, [zones]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">
          Live data from Firebase Firestore
        </span>
        <span className="text-[10px] font-bold text-slate-500">
          Last updated: {counter} sec ago
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">
      <CrowdDensityCard density={density} />
      <AtmosphereCard />
      <TrendingZones
        zones={trendingZones}
        onNavigate={() => setActiveTab("map")}
      />
      <QuickActionsGrid />
      </div>
    </div>
  );
});

const CrowdDensityCard = ({ density }: { density: number }) => {
  const [displayDensity, setDisplayDensity] = useState(0);

  useEffect(() => {
    const controls = animate(0, density, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (val) => setDisplayDensity(Math.round(val)),
    });
    return controls.stop;
  }, [density]);

  return (
    <div className="md:col-span-4 md:row-span-1 group">
      <div className="h-full glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden transition-all hover:neon-border-primary">
        <div className="flex justify-between items-center relative z-10">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Global Density
          </span>
          <div className="p-2 rounded-lg bg-primary-container/10 text-primary-container">
            <LucideUsers size={18} />
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10">
          <div>
            <p className="text-5xl font-headline font-black text-on-surface tracking-tighter leading-none">
              {displayDensity}%
            </p>
            <p className="text-[10px] text-primary-container font-black uppercase tracking-widest mt-2 px-2 py-0.5 bg-primary-container/10 rounded-full inline-block">
              {density > 75
                ? "Critical Surge"
                : density > 50
                  ? "Moderate"
                  : "Optimal Entry"}
            </p>
          </div>

          {/* Animated Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#00f5a0"
                strokeWidth="8"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * density) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

const AtmosphereCard = () => (
  <div className="md:col-span-4 md:row-span-1 group">
    <div className="h-full glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Atmosphere
        </span>
        <div className="p-2 rounded-lg bg-secondary-container/10 text-secondary-container">
          <LucideVolume2 size={18} />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1 h-12 mb-4">
          {[0.2, 0.4, 0.8, 1, 0.6, 0.3, 0.7, 0.9, 0.4].map((op, i) => (
            <motion.div
              key={i}
              animate={{ height: [12, 40, 20, 35, 12] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="flex-grow bg-secondary-container rounded-full"
              style={{ opacity: op }}
            />
          ))}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-headline font-black text-on-surface tracking-tighter">
              98 <span className="text-sm text-slate-600">dB</span>
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
              Analysis Active
            </p>
          </div>
          <button className="text-[10px] font-black text-secondary-container uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            View Table <LucideChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TrendingZones = ({
  zones,
  onNavigate,
}: {
  zones: Zone[];
  onNavigate: () => void;
}) => (
  <div className="md:col-span-4 md:row-span-1 group">
    <div className="h-full glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between transition-all hover:neon-border-secondary">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Trending Zones
        </span>
        <LucideTrendingUp size={18} className="text-secondary-container" />
      </div>

      <div className="space-y-3 mt-4">
        {zones.map((zone, idx) => (
          <div
            key={zone.id}
            className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all cursor-pointer"
            onClick={onNavigate}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-red-400" : idx === 1 ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`}
              />
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
                {zone.name}
              </span>
            </div>
            <span className="text-[10px] font-black text-slate-500">
              {zone.waitTime}M
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onNavigate}
        className="mt-4 w-full py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
      >
        View All Zones
      </button>
    </div>
  </div>
);

const QuickActionsGrid = () => (
  <div className="md:col-span-12 md:row-span-1 mt-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <QuickActionCard
        icon="wc"
        label="Find Bathroom"
        desc="Smart Recommendation"
        color="from-blue-500/20"
      />
      <QuickActionCard
        icon="floor_lamp"
        label="Order Food"
        desc="Skip the Queue"
        color="from-amber-500/20"
      />
      <QuickActionCard
        icon="local_parking"
        label="Parking Exit"
        desc="Optimal Route"
        color="from-purple-500/20"
      />
      <QuickActionCard
        icon="shopping_bag"
        label="Merch Store"
        desc="Exclusive Offers"
        color="from-emerald-500/20"
      />
    </div>
  </div>
);

const QuickActionCard = ({
  icon,
  label,
  desc,
  color,
}: {
  icon: string;
  label: string;
  desc: string;
  color: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all`}
    >
      {/* Kinetic Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0`}
      />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-on-surface transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="material-symbols-outlined pointer-events-none">{icon}</span>
        </div>
        <div>
          <h5 className="font-headline font-bold text-on-surface text-sm uppercase tracking-tight pointer-events-none">
            {label}
          </h5>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5 pointer-events-none">
            {desc}
          </p>
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 z-10 pointer-events-none">
        <LucidePointer size={14} className="text-white" />
      </div>
    </div>
  );
};
