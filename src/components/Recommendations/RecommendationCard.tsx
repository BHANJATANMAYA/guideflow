import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recommendation } from "../../types";

interface RecommendationDeckProps {
  recommendations: Recommendation[];
}

export const RecommendationDeck = ({
  recommendations: initial,
}: RecommendationDeckProps) => {
  const [recs] = useState(initial);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % recs.length);
  const prev = () => setIndex((prev) => (prev - 1 + recs.length) % recs.length);

  return (
    <div className="space-y-12">
      {/* --- AI Assistant Row --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <AIAssistantCard />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold uppercase tracking-tight text-on-surface">
              Smart Recommendations
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-white/5"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-white/5"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-hidden relative p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full flex gap-6"
              >
                {recs.slice(index, index + 2).map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    urgent={rec.type === "urgent"}
                  />
                ))}
                {recs.length === 1 && <div className="min-w-[320px] w-1/2" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Live Queue Predictor --- */}
      <LiveQueuePredictor />
    </div>
  );
};

export const AIAssistantCard = () => (
  <div className="glass-panel p-8 rounded-[2rem] neon-border-primary flex flex-col items-center text-center group">
    <div className="relative w-32 h-32 mb-6">
      <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-2xl animate-pulse group-hover:bg-primary-container/40 transition-colors"></div>
      <div className="relative w-full h-full bg-surface-container-high rounded-full flex items-center justify-center border-2 border-primary-container/40 p-2 overflow-hidden shadow-2xl">
        <img
          alt="Smart Companion"
          className="w-full h-full object-cover rounded-full"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWTNeTcjd3T0-lAo-PTS4gYO2gYvYFp3eKQMVJm12nppEhuTzpLXJ08mhPtRH5Ey6OUfATrnlDUU1GvsUp3QzcmKYTpn3K9BHrmYSJAzF2u9spaUTFz5ZR3RqSwm2LHQZo7JPz0ewt_L27Sg-jcETVrnfJdjsAliQw1u6Azuid4OfEbjzbPjRt8h_VFisIp7TIIuF6f9BeoocLy2BRFu7gxMQ5_tRX6HZjxYIkCSZ6wvIt1Px58cjLp29Zdtc3e1SxU7Ik7I1enWc"
        />
      </div>
      <div className="absolute bottom-1 right-1 w-6 h-6 bg-primary-container rounded-full border-4 border-surface-container-lowest flex items-center justify-center shadow-lg">
        <span
          className="material-symbols-outlined text-[12px] text-on-primary-container font-bold"
          style={{ fontSize: "12px" }}
        >
          bolt
        </span>
      </div>
    </div>

    <div className="relative bg-surface-container-high/80 p-6 rounded-2xl rounded-tl-none neumorphic-inset text-left">
      <p className="text-secondary-fixed font-headline font-medium text-lg leading-snug">
        "Gate 4 is less crowded right now! I recommend heading there within the
        next 8 minutes to avoid the halftime rush."
      </p>
      <div className="absolute -top-3 left-0 w-6 h-6 bg-surface-container-high/80 transform -skew-x-12 origin-bottom-left"></div>
    </div>

    <div className="mt-8 grid grid-cols-2 gap-4 w-full">
      <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex flex-col items-center shadow-inner">
        <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">
          Fan Zone
        </span>
        <span className="text-secondary-container font-headline font-bold text-xl">
          ACTIVE
        </span>
      </div>
      <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex flex-col items-center shadow-inner">
        <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">
          Safety Lock
        </span>
        <span className="text-emerald-400 font-headline font-bold text-xl uppercase">
          Secure
        </span>
      </div>
    </div>
  </div>
);

const RecommendationCard = ({
  recommendation,
  urgent,
}: {
  recommendation: Recommendation;
  urgent: boolean;
}) => (
  <div
    className={`min-w-[320px] w-1/2 glass-panel p-6 rounded-[2rem] border-2 relative overflow-hidden flex-shrink-0 transition-all duration-300 hover:scale-[1.02] ${urgent ? "border-error/20" : "border-secondary-container/20"}`}
  >
    <div
      className={`absolute top-0 right-0 p-4 rounded-bl-2xl ${urgent ? "bg-error/10" : "bg-secondary-container/10"}`}
    >
      <span
        className={`material-symbols-outlined ${urgent ? "text-error" : "text-secondary-container"}`}
      >
        {urgent ? "warning" : "star"}
      </span>
    </div>

    <span
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 ${urgent ? "bg-error/20 text-error" : "bg-secondary-container/20 text-secondary-container"}`}
    >
      {urgent ? "🔥 Urgent" : "⭐ Recommended"}
    </span>

    <h3 className="text-2xl font-headline font-bold mb-3">
      {recommendation.title}
    </h3>
    <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">
      {recommendation.description}
    </p>

    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-2">
        <span
          className={`material-symbols-outlined text-sm ${urgent ? "text-error" : "text-secondary-container"}`}
        >
          schedule
        </span>
        <span
          className={`font-bold text-xs uppercase ${urgent ? "text-error" : "text-secondary-container"}`}
        >
          Expires in 12m
        </span>
      </div>
      <button
        className={`${urgent ? "text-error hover:underline" : "bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl"} font-bold text-[10px] uppercase tracking-widest transition-all`}
      >
        {urgent ? "View Map" : "Navigate"}
      </button>
    </div>
  </div>
);

export const LiveQueuePredictor = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-headline font-bold uppercase tracking-tight text-on-surface">
      Live Queue Predictor
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <QueueCard
        title="Dining Hub"
        icon="restaurant"
        time="04"
        color="secondary"
      />
      <QueueCard title="Washrooms" icon="wc" time="02" color="slate" />
      <GateComparisonCard />
    </div>
  </div>
);

const QueueCard = ({
  title,
  icon,
  time,
  color,
}: {
  title: string;
  icon: string;
  time: string;
  color: string;
}) => (
  <div
    className={`glass-panel p-6 rounded-3xl flex flex-col transition-all hover:bg-white/5 ${color === "secondary" ? "neon-border-secondary" : "border border-white/5"}`}
  >
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === "secondary" ? "bg-secondary-container/10 text-secondary-container" : "bg-slate-800 text-slate-400"}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h4 className="font-headline font-bold text-lg">{title}</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            Section 12-14
          </p>
        </div>
      </div>
      {color === "secondary" && (
        <span
          className="material-symbols-outlined text-primary-container text-lg"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
      )}
    </div>

    <div className="flex items-end gap-2 mb-4">
      <span
        className={`text-5xl font-headline font-bold tracking-tighter ${color === "secondary" ? "text-secondary-container" : "text-on-surface"}`}
      >
        {time}
      </span>
      <span className="text-sm text-slate-500 mb-1 font-bold uppercase">
        Mins
      </span>
    </div>

    <div className="h-12 w-full mb-6">
      <svg className="w-full h-full" viewBox="0 0 100 30">
        <path
          d="M0,25 Q10,20 20,22 T40,10 T60,18 T80,5 T100,15"
          fill="none"
          stroke={color === "secondary" ? "#00d9ff" : "#64748b"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        Best Time
      </span>
      <div
        className={`flex items-center gap-1 ${color === "secondary" ? "text-primary-container" : "text-slate-500"}`}
      >
        <span className="material-symbols-outlined text-xs">schedule</span>
        <span className="text-[10px] font-bold">14:20 - 15:00</span>
      </div>
    </div>
  </div>
);

const GateComparisonCard = () => (
  <div className="md:col-span-2 glass-panel p-6 rounded-3xl neon-border-primary relative overflow-hidden group">
    <div className="flex items-center justify-between mb-6">
      <h4 className="font-headline font-bold text-lg uppercase tracking-wider">
        Gate Comparison
      </h4>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Gate 1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Gate 3
          </span>
        </div>
      </div>
    </div>

    <div className="relative h-40 bg-surface-container-lowest/50 rounded-2xl flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full flex flex-col items-center justify-center p-4 bg-emerald-400/5">
          <span className="text-4xl font-headline font-bold text-emerald-400">
            12m
          </span>
          <span className="text-[10px] text-emerald-400/60 font-bold tracking-widest mt-2 uppercase">
            Moderate
          </span>
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center p-4 bg-secondary-container/5">
          <span className="text-4xl font-headline font-bold text-secondary-container">
            28m
          </span>
          <span className="text-[10px] text-secondary-container/60 font-bold tracking-widest mt-2 uppercase">
            Crowded
          </span>
        </div>
      </div>

      <div className="absolute inset-y-0 left-1/2 w-1 bg-primary-container z-10 transition-all duration-500 group-hover:left-[42%]">
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-container shadow-lg shadow-emerald-500/50 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-on-primary-container font-bold"
            style={{ transform: "rotate(90deg)" }}
          >
            unfold_more
          </span>
        </div>
      </div>
    </div>
    <p className="mt-4 text-[10px] text-slate-500 text-center italic uppercase tracking-wider">
      Live entry point analytics
    </p>
  </div>
);
