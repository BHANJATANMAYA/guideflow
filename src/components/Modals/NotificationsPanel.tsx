import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import {
  LucideX,
  LucideBell,
  LucideCheckCheck,
  LucideTrash2,
} from "lucide-react";

export const NotificationsPanel = () => {
  const {
    isNotificationsPanelOpen,
    toggleModal,
    notifications,
    setNotifications,
  } = useAppStore();

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <AnimatePresence>
      {isNotificationsPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleModal("notifications")}
            className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-low border-l border-white/5 shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <LucideBell className="text-primary-container" size={24} />
                <h2 className="text-2xl font-headline font-black text-on-surface uppercase tracking-tight">
                  Notifications
                </h2>
              </div>
              <button
                onClick={() => toggleModal("notifications")}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <LucideX size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      n.read
                        ? "bg-white/5 border-white/5 opacity-60"
                        : "bg-primary-container/5 border-primary-container/20 ring-1 ring-primary-container/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-headline font-bold text-on-surface uppercase tracking-tight">
                        {n.title}
                      </h4>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {new Date(n.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <LucideBell size={64} className="mb-4" />
                  <p className="font-headline font-black uppercase tracking-widest text-xs">
                    No notifications yet
                  </p>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <button
                onClick={markAllRead}
                className="py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <LucideCheckCheck size={14} /> Mark all read
              </button>
              <button
                onClick={clearAll}
                className="py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
              >
                <LucideTrash2 size={14} /> Clear list
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
