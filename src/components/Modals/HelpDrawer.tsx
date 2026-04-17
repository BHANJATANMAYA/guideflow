import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import {
  LucideX,
  LucideSearch,
  LucideMessageSquare,
  LucideBookOpen,
  LucideChevronRight,
} from "lucide-react";

export const HelpDrawer = () => {
  const { isHelpDrawerOpen, toggleModal } = useAppStore();

  const helpLinks = [
    {
      title: "How to Navigate",
      icon: <span className="material-symbols-outlined">navigation</span>,
    },
    {
      title: "Crowd Data Logic",
      icon: <span className="material-symbols-outlined">analytics</span>,
    },
    {
      title: "Connecting Hardware",
      icon: <span className="material-symbols-outlined">devices</span>,
    },
    {
      title: "Report an Issue",
      icon: <span className="material-symbols-outlined">report</span>,
    },
  ];

  return (
    <AnimatePresence>
      {isHelpDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleModal("help")}
            className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface-container-lowest border-l border-white/5 shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                  <LucideBookOpen size={20} />
                </div>
                <h2 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">
                  Support
                </h2>
              </div>
              <button
                onClick={() => toggleModal("help")}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <LucideX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-grow overflow-y-auto">
              <div className="relative">
                <LucideSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 outline-none focus:border-primary-container/30 transition-all text-xs font-headline font-bold uppercase tracking-widest text-on-surface"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                  Quick Assistance
                </h3>
                {helpLinks.map((link) => (
                  <button
                    key={link.title}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-slate-500 group-hover:text-primary-container transition-colors">
                        {link.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-on-surface transition-colors">
                        {link.title}
                      </span>
                    </div>
                    <LucideChevronRight size={14} className="text-slate-700" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-white/5 space-y-3">
              <button className="w-full py-4 rounded-2xl bg-primary-container text-on-primary-container font-headline font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-lg shadow-primary-container/20 hover:scale-105 transition-all">
                <LucideMessageSquare size={18} strokeWidth={3} />
                Live Chat Support
              </button>
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                Contact Support
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
