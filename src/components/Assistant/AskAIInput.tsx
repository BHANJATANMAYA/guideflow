import { useState } from "react";
import { motion } from "framer-motion";
import { LucideSend, LucideMic, LucideSparkles } from "lucide-react";

export const AskAIInput = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-2 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex items-center gap-2"
      >
        <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
          <LucideSparkles size={20} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask GuideFlow anything..."
          className="flex-grow bg-transparent border-none outline-none text-on-surface placeholder:text-slate-600 font-headline font-bold text-sm px-2 uppercase tracking-tight"
        />

        <div className="flex items-center gap-1 pr-2">
          <button aria-label="Voice input" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <LucideMic size={20} />
          </button>
          <button
            aria-label="Send message"
            disabled={!query}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              query
                ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20 translate-x-0"
                : "bg-white/5 text-slate-700 translate-x-2 opacity-50"
            }`}
          >
            <LucideSend size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
