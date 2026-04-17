import { motion, useMotionValue, useTransform } from "framer-motion";
import type { Recommendation } from "../../types";
import {
  LucideAlertCircle,
  LucideStar,
  LucideLightbulb,
  LucideNavigation,
  LucideChevronRight,
} from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction: (rec: Recommendation) => void;
  onDismiss: (id: string) => void;
}

export const RecommendationCard = ({
  recommendation,
  onAction,
  onDismiss,
}: RecommendationCardProps) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const getStyle = () => {
    switch (recommendation.type) {
      case "urgent":
        return {
          border: "border-rose-500/30",
          bg: "bg-rose-500/5",
          icon: <LucideAlertCircle className="text-rose-500" />,
        };
      case "opportunity":
        return {
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/5",
          icon: <LucideStar className="text-emerald-500" />,
        };
      case "tip":
        return {
          border: "border-blue-500/30",
          bg: "bg-blue-500/5",
          icon: <LucideLightbulb className="text-blue-500" />,
        };
      default:
        return {
          border: "border-white/10",
          bg: "bg-white/5",
          icon: <LucideNavigation className="text-slate-400" />,
        };
    }
  };

  const style = getStyle();

  return (
    <motion.div
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 80) onDismiss(recommendation.id);
      }}
      whileHover={{ scale: 1.02 }}
      className={`glass-panel rounded-[2rem] p-8 border ${style.border} ${style.bg} relative overflow-hidden group cursor-grab active:cursor-grabbing`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
            {style.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {recommendation.type}
            </p>
            <h4 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">
              {recommendation.title}
            </h4>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
            recommendation.priority === "high"
              ? "bg-rose-500 text-white"
              : "bg-white/5 text-slate-500"
          }`}
        >
          {recommendation.priority}
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-8">
        {recommendation.description}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => onAction(recommendation)}
          className="flex-grow py-4 rounded-2xl bg-on-surface text-surface-container-lowest font-headline font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          {recommendation.actionLabel || "Check it out"}
          <LucideChevronRight size={16} />
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none" />
    </motion.div>
  );
};
