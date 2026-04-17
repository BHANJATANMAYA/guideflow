import React from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { FloatingActions } from "./FloatingActions";
import { useUserStore } from "../../store/useUserStore";

// Modals
import { VIPUpgradeModal } from "../Modals/VIPUpgradeModal";
import { NotificationsPanel } from "../Modals/NotificationsPanel";
import { HelpDrawer } from "../Modals/HelpDrawer";

interface ShellProps {
  children: React.ReactNode;
}

export const Shell = ({ children }: ShellProps) => {
  const { preferences } = useUserStore();

  return (
    <div
      className={[
        "bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col",
        preferences.highContrastMode ? "guideflow-high-contrast" : "",
        preferences.largeTextEnabled ? "guideflow-large-text" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a
        href="#main-content"
        className="absolute left-6 top-4 z-[90] -translate-y-20 rounded-full bg-primary-container px-5 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-on-primary-container transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow pt-24 pb-24 md:pb-12 dynamic-mesh relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[150px] animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 min-h-[calc(100vh-16rem)] flex flex-col">
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </main>

      <FloatingActions />
      <BottomNav />

      <VIPUpgradeModal />
      <NotificationsPanel />
      <HelpDrawer />

      <footer className="hidden md:flex w-full border-t border-white/5 bg-surface-container-lowest/50 backdrop-blur-xl justify-between items-center px-12 py-8 mt-auto">
        <div className="text-slate-600 font-headline text-[10px] uppercase tracking-[0.3em] font-bold">
          © 2026 GUIDEFLOW SYSTEMS • PULSE CORE v3.0
        </div>
        <div className="flex gap-8">
          <FooterLink label="Accessibility" />
          <FooterLink label="Language" />
          <FooterLink label="Privacy" />
        </div>
      </footer>
    </div>
  );
};

const FooterLink = ({ label }: { label: string }) => (
  <button
    type="button"
    className="text-slate-600 hover:text-primary-container transition-colors font-headline text-[10px] uppercase tracking-widest font-bold"
  >
    {label}
  </button>
);
