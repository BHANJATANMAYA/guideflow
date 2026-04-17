import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { useUserStore } from "../../store/useUserStore";
import { LucideBell, LucideZap, LucideCrown } from "lucide-react";

export const Header = () => {
  const { activeTab, setActiveTab, toggleModal } = useAppStore();
  const { user } = useUserStore();

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "map", label: "Arena Map" },
    { id: "assistant", label: "AI Assistant" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/60 backdrop-blur-3xl border-b border-white/5 flex justify-between items-center px-6 h-20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setActiveTab("dashboard")}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
          <span className="material-symbols-outlined text-on-primary-container font-bold">
            navigation
          </span>
        </div>
        <span className="text-2xl font-headline font-black bg-gradient-to-r from-primary-container via-secondary-container to-primary-container bg-[length:200%_auto] animate-text-gradient bg-clip-text text-transparent tracking-tighter uppercase">
          GuideFlow
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-surface-container-low/50 p-1.5 rounded-2xl border border-white/5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActiveTab(
                item.id as "dashboard" | "map" | "assistant" | "profile",
              )
            }
            className={`px-6 py-2.5 rounded-xl font-headline text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              activeTab === item.id
                ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleModal("vip")}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black font-headline font-bold text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-orange-500/20 uppercase"
        >
          <LucideCrown size={14} />
          Upgrade Access
        </button>

        <div className="flex items-center gap-1.5 bg-surface-container-high/40 p-1 rounded-xl border border-white/5">
          <HeaderIconButton
            icon={<LucideBell size={18} />}
            onClick={() => toggleModal("notifications")}
            badge
          />
          <HeaderIconButton icon={<LucideZap size={18} />} onClick={() => {}} />
        </div>

        <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

        <motion.div
          onClick={() => setActiveTab("profile")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-11 h-11 rounded-full border-2 p-0.5 cursor-pointer transition-all shadow-lg ${
            activeTab === "profile"
              ? "border-primary-container shadow-primary-container/20"
              : "border-white/10 hover:border-white/30"
          }`}
        >
          <img
            alt="User"
            className="w-full h-full rounded-full object-cover"
            src={user.avatar}
          />
        </motion.div>
      </div>
    </header>
  );
};

const HeaderIconButton = ({
  icon,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  badge?: boolean;
}) => (
  <button
    onClick={onClick}
    className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
  >
    {icon}
    {badge && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full ring-2 ring-surface-container-lowest"></span>
    )}
  </button>
);
