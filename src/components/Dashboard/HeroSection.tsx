import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideTimer, LucideCloudSun, LucideZap } from "lucide-react";
import type { VenueEvent } from "../../types";
import { useUserStore } from "../../store/useUserStore";
import { useAppStore } from "../../store/useAppStore";

interface HeroSectionProps {
  event: VenueEvent | null;
}

export const HeroSection = React.memo(({ event }: HeroSectionProps) => {
  const [now, setNow] = useState<number | null>(null);
  
  // This UI consumes real-time event data from Firestore
  const { user } = useUserStore();
  const { setActiveTab } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = () => {
    if (!event || now === null) {
      return { min: "00", sec: "00" };
    }

    const diff = Math.max(0, event.startTime - now);
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      min: minutes.toString().padStart(2, "0"),
      sec: seconds.toString().padStart(2, "0"),
    };
  };

  const { min, sec } = getCountdown();
  const homeTeamName = event?.teams?.home.name ?? "Lions";
  const awayTeamName = event?.teams?.away.name ?? "Titans";

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <p className="text-primary-container font-headline text-[10px] tracking-[0.4em] uppercase font-black">
              LIVE EVENT ENVIRONMENT • PULSE SYNC ACTIVE
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter text-on-surface leading-none">
            Ready for <span className="text-slate-500">Kickoff,</span>
            <br />
            <span className="bg-gradient-to-r from-primary-container via-secondary-container to-primary-container bg-[length:200%_auto] animate-text-gradient bg-clip-text text-transparent">
              {user.name}
            </span>
          </h1>
        </div>

        <div className="glass-panel rounded-3xl p-6 flex items-center gap-6 min-w-[280px] border-l-4 border-primary-container shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container">
            <LucideTimer size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">
              Match Starts In
            </p>
            <div
              aria-live="polite"
              className="text-4xl font-headline font-black text-on-surface tracking-tighter"
            >
              {min}
              <span className="text-slate-600 mx-1">:</span>
              <span className="text-primary-container">{sec}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
        <div className="md:col-span-8 md:row-span-2 group">
          <div className="h-full glass-card rounded-[2.5rem] p-10 relative overflow-hidden border border-white/5 transition-all duration-500 hover:neon-glow-primary">
            <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none transform rotate-12">
              <svg
                width="400"
                height="400"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                />
                <path
                  d="M100 20V180M20 100H180"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="relative h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                  <span className="text-[10px] font-black text-primary-container uppercase tracking-[0.2em]">
                    {event?.name ?? "Loading Event..."} • Stadium Arena C
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    <MockTeamLogo color="#00f5a0" />
                    <MockTeamLogo color="#00d9ff" />
                  </div>
                  <div className="h-8 w-px bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <LucideZap className="text-amber-400" size={16} />
                    <span className="text-xs font-headline font-bold text-on-surface tracking-widest uppercase">
                      Live Odds
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h3 className="text-6xl md:text-8xl font-headline font-black mb-4 uppercase tracking-tighter leading-none">
                    {homeTeamName} <span className="text-slate-700">VS</span>
                    <br />
                    {awayTeamName}
                  </h3>
                  <div className="flex gap-12 mt-6">
                    <StatsDetail
                      label="Win Prob"
                      value={`${event?.teams?.home.winProb ?? 64}%`}
                      color="text-primary-container"
                    />
                    <StatsDetail
                      label="Atmosphere"
                      value="98dB"
                      color="text-secondary-container"
                    />
                    <StatsDetail
                      label="Weather"
                      value={`${event?.weather?.temp ?? 18}°C ${event?.weather?.condition ?? "Clear"}`}
                      icon={
                        <LucideCloudSun size={14} className="text-slate-400" />
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("assistant")}
                  className="bg-primary-container text-on-primary-container px-8 py-4 rounded-2xl font-headline font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary-container/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Open AI Briefing
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between group hover:border-primary-container/30 transition-all">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-3xl">
                confirmation_number
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Price Multiplier
              </p>
              <p className="text-2xl font-headline font-black text-on-surface">
                1.2x
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-headline font-bold text-on-surface uppercase tracking-tight">
              VIP Ticket Hub
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Instant upgrades & marketplace
            </p>
            <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                className="h-full bg-primary-container"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between group hover:border-secondary-container/30 transition-all">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-secondary-container">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Live Users
              </p>
              <p className="text-2xl font-headline font-black text-on-surface">
                {event?.activeUsers.toLocaleString() ?? "12.4k"}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-headline font-bold text-on-surface uppercase tracking-tight">
              Active Pulse
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Real-time stadium connections
            </p>
            <div className="flex -space-x-2 mt-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-surface-container-highest bg-slate-800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const MockTeamLogo = ({ color }: { color: string }) => (
  <div className="w-14 h-14 rounded-full bg-surface-container-high border-4 border-surface-container flex items-center justify-center shadow-2xl relative overflow-hidden">
    <div className="absolute inset-0 opacity-20" style={{ background: color }}></div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill={color} />
      <path
        d="M2 17L12 22L22 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const StatsDetail = ({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1.5 flex items-center gap-2">
      {icon} {label}
    </p>
    <p
      className={`text-2xl font-headline font-black ${color || "text-on-surface"}`}
    >
      {value}
    </p>
  </div>
);
