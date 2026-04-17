import { motion } from "framer-motion";

export const AIAvatar = () => {
  return (
    <div className="flex flex-col items-center gap-6 mb-12">
      <div className="relative">
        {/* Outer Glows */}
        <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute inset-0 bg-secondary-container/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* SVG Mascot */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-32 h-32 bg-surface-container-high rounded-[2.5rem] border-2 border-primary-container/30 flex items-center justify-center p-6 shadow-2xl"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5a0" />
                <stop offset="100%" stopColor="#00d9ff" />
              </linearGradient>
            </defs>
            {/* AI Core */}
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="15"
              fill="none"
              stroke="url(#aiGrad)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="10"
              fill="url(#aiGrad)"
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Eyes */}
            <motion.rect
              x="35"
              y="40"
              width="8"
              height="2"
              rx="1"
              fill="#fff"
              animate={{ height: [2, 8, 2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.rect
              x="57"
              y="40"
              width="8"
              height="2"
              rx="1"
              fill="#fff"
              animate={{ height: [2, 8, 2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Status indicator */}
        <div className="absolute -bottom-2 -right-2 bg-surface-container-high px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="text-[8px] font-black text-on-surface uppercase tracking-widest">
            GuideFlow AI
          </span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter">
          Smart Companion
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Adaptive recommendations based on your location and stadium load.
        </p>
      </div>
    </div>
  );
};
