import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecommendationCard } from "./RecommendationCard";
import { useAppStore } from "../../store/useAppStore";
import { useMapStore } from "../../store/useMapStore";
import { generateRecommendations } from "../../utils/crowdAlgorithm";
import type { Recommendation } from "../../types";

export const CardDeck = () => {
  const { zones, event, setActiveTab } = useAppStore();
  const { setActiveZone } = useMapStore();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const recommendations = useMemo(() => {
    if (zones.length === 0 || !event) {
      return [];
    }

    const currentTime = zones.reduce(
      (latestTimestamp, zone) => Math.max(latestTimestamp, zone.lastUpdated),
      0,
    );

    return generateRecommendations(zones, currentTime, event.startTime).filter(
      (recommendation) => !dismissedIds.includes(recommendation.id),
    );
  }, [dismissedIds, event, zones]);

  const handleAction = (recommendation: Recommendation) => {
    if (recommendation.targetZoneId) {
      setActiveZone(recommendation.targetZoneId);
      setActiveTab("map");
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((previousIds) => [...previousIds, id]);
  };

  const dismissAll = () => {
    setDismissedIds((previousIds) => [
      ...previousIds,
      ...recommendations.map((recommendation) => recommendation.id),
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Priority Priority
        </span>
        <button
          type="button"
          onClick={dismissAll}
          className="text-[10px] font-black text-primary-container uppercase tracking-widest hover:underline"
        >
          Mark all read
        </button>
      </div>
      <div className="relative space-y-4">
        <AnimatePresence mode="popLayout">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <motion.div
                key={recommendation.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <RecommendationCard
                  recommendation={recommendation}
                  onAction={handleAction}
                  onDismiss={handleDismiss}
                />
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center glass-panel rounded-[2rem] border border-dashed border-white/10">
              <p className="text-slate-500 font-headline uppercase tracking-widest font-bold">
                All clear! No urgent suggestions.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="pt-20"></div>
    </div>
  );
};
