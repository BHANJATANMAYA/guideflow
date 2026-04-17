import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import {
  LucideLayoutDashboard,
  LucideMap,
  LucideCpu,
  LucideUser,
} from "lucide-react";

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useAppStore();

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: <LucideLayoutDashboard size={20} />,
    },
    { id: "map", label: "Map", icon: <LucideMap size={20} /> },
    { id: "assistant", label: "AI", icon: <LucideCpu size={20} /> },
    { id: "profile", label: "User", icon: <LucideUser size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full z-50 px-6 pb-8 pt-4 bg-surface-container-lowest/80 backdrop-blur-3xl border-t border-white/5 flex justify-between items-center">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() =>
              setActiveTab(
                item.id as "dashboard" | "map" | "assistant" | "profile",
              )
            }
            className="relative flex flex-col items-center gap-1 group"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute -top-4 w-12 h-1 bg-primary-container rounded-full blur-sm"
              />
            )}
            <div
              className={`transition-all duration-300 ${isActive ? "text-primary-container scale-110" : "text-slate-500"}`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[10px] font-headline font-bold uppercase tracking-tighter transition-all duration-300 ${
                isActive
                  ? "text-on-surface opacity-100"
                  : "text-slate-500 opacity-60"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
