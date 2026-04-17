import { motion } from "framer-motion";
import type { Route } from "../../types";

interface RouteOverlayProps {
  selectedRoute: Route | null;
}

export const RouteOverlay = ({ selectedRoute }: RouteOverlayProps) => {
  if (!selectedRoute) return null;

  // Convert normalized coordinates to SVG coordinates (800x600)
  const points = selectedRoute.path
    .map((p) => `${(p.x / 100) * 800},${(p.y / 100) * 600}`)
    .join(" ");

  return (
    <g>
      <defs>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Path Underglow */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={selectedRoute.type === "fastest" ? "#00f5a0" : "#00d9ff"}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
        filter="url(#routeGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Main Path Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={selectedRoute.type === "fastest" ? "#00f5a0" : "#00d9ff"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8,8"
        initial={{ pathLength: 0, strokeDashoffset: 0 }}
        animate={{
          pathLength: 1,
          strokeDashoffset: -100,
        }}
        transition={{
          pathLength: { duration: 1, ease: "easeInOut" },
          strokeDashoffset: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      />

    </g>
  );
};
