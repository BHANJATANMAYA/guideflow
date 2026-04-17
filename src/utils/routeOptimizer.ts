import type { Zone, Coordinates, Route } from "../types";

export const calculateRoutes = (
  startZone: Zone,
  endZone: Zone,
  allZones: Zone[],
): Route[] => {
  // In a real app, this would use A* on a graph with weights for distance and density.
  // For this demo, we'll generate two distinct paths: Fastest and Least Crowded.

  const start = startZone.coordinates;
  const end = endZone.coordinates;

  // Generating a "Fastest" route (direct-ish)
  const fastestPath: Coordinates[] = [
    start,
    { x: (start.x + end.x) / 2, y: start.y }, // Midpoint 1
    { x: (start.x + end.x) / 2, y: end.y }, // Midpoint 2
    end,
  ];

  // Generating a "Least Crowded" route (divergent path through low-density zones)
  const safeZone =
    allZones.find(
      (z) =>
        z.id !== startZone.id &&
        z.id !== endZone.id &&
        z.currentCount / z.capacity < 0.4,
    ) || allZones[Math.floor(allZones.length / 2)];

  const safePath: Coordinates[] = [start, safeZone.coordinates, end];

  const distance =
    Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) * 10; // Mock distance

  return [
    {
      id: "route-fast",
      name: "Fastest Route",
      path: fastestPath,
      distance: Math.round(distance),
      estimatedTime: Math.round(distance / 5),
      densityScore: 0.7,
      type: "fastest",
    },
    {
      id: "route-safe",
      name: "Least Crowded",
      path: safePath,
      distance: Math.round(distance * 1.4),
      estimatedTime: Math.round((distance * 1.4) / 5) + 2,
      densityScore: 0.2,
      type: "least_crowded",
    },
  ];
};
