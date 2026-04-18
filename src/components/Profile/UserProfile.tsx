import { useState, type ReactNode } from "react";
import {
  LucideCalendar,
  LucideLogOut,
  LucideSettings,
  LucideTrophy,
  LucideUserCheck,
} from "lucide-react";

import { signOutSession } from "../../services/authService";
import { useAppStore } from "../../store/useAppStore";
import { useUserStore } from "../../store/useUserStore";
import { ActivityTimeline } from "./ActivityTimeline";
import { ConnectedDevices } from "./ConnectedDevices";
import { PreferencesGrid } from "./PreferencesGrid";

export const UserProfile = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { setActiveTab } = useAppStore();
  const { authProvider, resetAuthSession, user } = useUserStore();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutSession();
      resetAuthSession();
      setActiveTab("dashboard");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <p className="text-primary-container font-headline text-[10px] tracking-[0.4em] uppercase font-black">
              SECURE COMMAND CENTER • ENCRYPTED SESSION
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter text-on-surface leading-none">
            User{" "}
            <span className="bg-gradient-to-r from-primary-container via-secondary-container to-primary-container bg-[length:200%_auto] animate-text-gradient bg-clip-text text-transparent">
              Identity
            </span>
          </h1>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-black">
            {authProvider === "google" ? user.email || "Google session" : "Demo session active"}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="p-4 rounded-2xl bg-surface-container-high border border-white/5 text-slate-400 hover:text-white transition-all"
          >
            <LucideSettings size={20} />
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
          >
            <LucideLogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group hover:neon-glow-primary transition-all duration-500">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-[3rem] border-4 border-primary-container/30 p-1.5 mb-6 shadow-2xl">
                <img
                  alt="User Avatar"
                  className="w-full h-full rounded-[2.5rem] object-cover"
                  src={user.avatar}
                />
              </div>

              <h2 className="text-3xl font-headline font-black text-on-surface uppercase tracking-tight mb-2">
                {user.name}
              </h2>
              <p className="text-sm text-slate-400 mb-4 break-all">{user.email || "demo@guideflow.local"}</p>
              <p className="text-[10px] font-black text-primary-container uppercase tracking-[0.3em] bg-primary-container/10 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                {user.vipLevel} ACCESS LEVEL
              </p>

              <div className="grid grid-cols-3 gap-8 w-full mt-10 pt-10 border-t border-white/5">
                <ProfileStat
                  label="Points"
                  value={user.fanPoints.toLocaleString()}
                  icon={<LucideTrophy size={14} />}
                />
                <ProfileStat
                  label="Missions"
                  value={user.missionsCompleted.toString()}
                  icon={<LucideUserCheck size={14} />}
                />
                <ProfileStat
                  label="Events"
                  value={user.eventsAttended.toString()}
                  icon={<LucideCalendar size={14} />}
                />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>

          <ConnectedDevices />
        </div>

        <div className="lg:col-span-8 space-y-8">
          <PreferencesGrid />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
};

const ProfileStat = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => (
  <div className="space-y-1 text-center">
    <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1">
      {icon}
      <span className="text-[8px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-xl font-headline font-black text-on-surface">{value}</p>
  </div>
);

