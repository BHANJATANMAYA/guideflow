import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { LucidePlus, LucideHelpCircle } from "lucide-react";

export const FloatingActions = () => {
  const { toggleModal, activeTab } = useAppStore();

  return (
    <div className="hidden md:flex fixed bottom-10 right-10 flex-col gap-4 z-40">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleModal("help")}
        className="w-14 h-14 rounded-2xl bg-surface-container-high/80 backdrop-blur-xl text-slate-300 border border-white/5 shadow-2xl flex items-center justify-center hover:bg-emerald-400/10 hover:text-emerald-400 transition-all group"
      >
        <LucideHelpCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {activeTab !== "profile" && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {}}
            className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-container to-secondary-container text-on-primary-container shadow-[0_12px_40px_rgba(0,245,160,0.3)] flex items-center justify-center transition-all"
          >
            <LucidePlus size={32} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
