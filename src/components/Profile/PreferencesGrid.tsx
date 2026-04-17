import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  LucideBell,
  LucideEye,
  LucideWaves,
  LucideSmartphone,
  LucideType,
  LucideMic,
} from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import type { UserPreferenceKey } from "../../store/useUserStore";

interface PreferenceSetting {
  key: UserPreferenceKey;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const PreferencesGrid = () => {
  const { preferences, updatePreference } = useUserStore();

  const settings: PreferenceSetting[] = [
    {
      key: "notificationsEnabled",
      label: "Live Notifications",
      description: "Keeps event alerts and reroutes visible in real time.",
      icon: LucideBell,
      color: "text-primary-container",
    },
    {
      key: "crowdAvoidanceMode",
      label: "Crowd Avoidance",
      description: "Prioritizes safer lanes and lower-density recommendations.",
      icon: LucideWaves,
      color: "text-secondary-container",
    },
    {
      key: "arDirectionsEnabled",
      label: "AR Directions",
      description: "Prepares the experience for guided overlays on device.",
      icon: LucideSmartphone,
      color: "text-amber-400",
    },
    {
      key: "highContrastMode",
      label: "High Contrast",
      description: "Boosts contrast for brighter stadium conditions.",
      icon: LucideEye,
      color: "text-rose-400",
    },
    {
      key: "largeTextEnabled",
      label: "Large Text",
      description: "Improves readability across labels, cards, and panels.",
      icon: LucideType,
      color: "text-blue-400",
    },
    {
      key: "soundEffectsEnabled",
      label: "Voice Commands",
      description: "Keeps hands-free prompts available during navigation.",
      icon: LucideMic,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {settings.map((item) => (
        <div
          key={item.key}
          className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col justify-between gap-4 group hover:border-white/10 transition-all"
        >
          <div className="flex justify-between items-start">
            <div
              className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}
            >
              <item.icon size={18} />
            </div>
            <Switch
              checked={preferences[item.key]}
              label={item.label}
              onChange={(value) => updatePreference(item.key, value)}
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-headline font-bold text-on-surface uppercase tracking-widest">
              {item.label}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Switch = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full p-1 transition-colors relative ${checked ? "bg-primary-container" : "bg-white/10"}`}
  >
    <motion.div
      animate={{ x: checked ? 24 : 0 }}
      className={`w-4 h-4 rounded-full shadow-lg ${checked ? "bg-on-primary-container" : "bg-slate-500"}`}
    />
  </button>
);
