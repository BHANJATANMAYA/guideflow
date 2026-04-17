import type { Zone, Recommendation } from "../types";

const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

export const generateRecommendations = (
  zones: Zone[],
  currentTime: number,
  eventStartTime: number,
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Rule 1: High Congestion Alerts
  zones.forEach((zone) => {
    const density = zone.currentCount / zone.capacity;
    if (density > 0.8) {
      // Find a nearby alternative of the same type if possible
      const alternative = zones.find(
        (z) =>
          z.type === zone.type &&
          z.id !== zone.id &&
          z.currentCount / z.capacity < 0.6,
      );

      recommendations.push({
        id: `rec-alert-${zone.id}`,
        title: `Avoid ${zone.name}`,
        description: `High congestion detected (${Math.round(density * 100)}%). ${alternative ? `Try ${alternative.name} instead.` : "Expect delays."}`,
        type: "urgent",
        priority: "high",
        icon: "warning",
        action: "navigate",
        actionLabel: alternative ? `Go to ${alternative.name}` : "Show Map",
        targetZoneId: alternative?.id || zone.id,
        timestamp: currentTime,
      });
    }
  });

  // Rule 2: Food/Merch Opportunities
  const foodZones = zones.filter(
    (z) => z.type === "food" && z.currentCount / z.capacity < 0.4,
  );
  if (foodZones.length > 0) {
    const bestFood = foodZones.sort((a, b) => a.waitTime - b.waitTime)[0];
    recommendations.push({
      id: "rec-opp-food",
      title: "Food Court is Empty!",
      description: `${bestFood.name} has only a ${bestFood.waitTime} min wait. Perfect time for a snack!`,
      type: "opportunity",
      priority: "medium",
      icon: "restaurant",
      action: "navigate",
      actionLabel: "Order Food",
      targetZoneId: bestFood.id,
      timestamp: currentTime,
    });
  }

  // Rule 3: Event Timing Tips
  const minsUntilEvent = Math.floor(
    (eventStartTime - currentTime) / (1000 * 60),
  );
  if (minsUntilEvent > 0 && minsUntilEvent <= 20) {
    recommendations.push({
      id: "rec-tip-start",
      title: "Event Starts Soon",
      description: `Only ${minsUntilEvent} minutes until kickoff. Head to your seat now to avoid the rush.`,
      type: "tip",
      priority: "high",
      icon: "schedule",
      action: "show_seat",
      actionLabel: "Find My Seat",
      timestamp: currentTime,
    });
  }

  // Rule 4: Navigation Optimization
  const busyGates = zones.filter(
    (z) => z.type === "gate" && z.status === "crowded",
  );
  if (busyGates.length > 0) {
    const betterGate = zones.find(
      (z) => z.type === "gate" && z.status === "open",
    );
    if (betterGate) {
      recommendations.push({
        id: "rec-nav-gate",
        title: "Better Entry Route",
        description: `Gates are busy. ${betterGate.name} is much faster right now.`,
        type: "navigation",
        priority: "medium",
        icon: "map",
        action: "navigate",
        actionLabel: "Show Route",
        targetZoneId: betterGate.id,
        timestamp: currentTime,
      });
    }
  }

  return recommendations.sort(
    (a, b) => PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority],
  );
};
