import { useState } from "react";
import { motion } from "framer-motion";
import type { Zone } from "../../types";

interface HeatmapOverlayProps {
  zones: Zone[];
  enabled: boolean;
}

export const HeatmapOverlay = ({ zones, enabled }: HeatmapOverlayProps) => {
  const [particles] = useState(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      r: Math.random() * 2 + 1,
      initCx: Math.random() * 800,
      initCy: Math.random() * 600,
      animCx: Math.random() * 800,
      animCy: Math.random() * 600,
      duration: Math.random() * 10 + 10,
    }));
  });

  if (!enabled) return null;

  return (
    <g
      className="pointer-events-none overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      <defs>
        <filter id="heatmapBlur">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      {zones.map((zone) => {
        const density = zone.currentCount / zone.capacity;
        if (density < 0.3) return null;

        const color =
          density > 0.8 ? "#ff4757" : density > 0.6 ? "#ffb800" : "#00f5a0";
        const x = (zone.coordinates.x / 100) * 800;
        const y = (zone.coordinates.y / 100) * 600;

        return (
          <motion.circle
            key={`heat-${zone.id}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            cx={x}
            cy={y}
            r={density * 150}
            fill={color}
            filter="url(#heatmapBlur)"
          />
        );
      })}

      {/* Flowing Particles */}
      {particles.map((p) => (
        <motion.circle
          key={`particle-${p.id}`}
          r={p.r}
          fill="#00f5a0"
          initial={{
            cx: p.initCx,
            cy: p.initCy,
            opacity: 0,
          }}
          animate={{
            cx: p.animCx,
            cy: p.animCy,
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </g>
  );
};
