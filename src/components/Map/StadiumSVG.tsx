
import { motion, AnimatePresence } from "framer-motion";
import type { Zone } from "../../types";
import { useMapStore } from "../../store/useMapStore";

interface StadiumSVGProps {
  zones: Zone[];
}

export const StadiumSVG = ({ zones }: StadiumSVGProps) => {
  const { activeZoneId, setActiveZone, heatmapEnabled } = useMapStore();

  const getZoneColor = (zone: Zone) => {
    const density = zone.currentCount / zone.capacity;
    if (density > 0.8) return "#ff4757"; // Red
    if (density > 0.5) return "#ffb800"; // Yellow
    return "#00f5a0"; // Green
  };

  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-full drop-shadow-[0_0_50px_rgba(0,245,160,0.1)]"
    >
      <defs>
        <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient
          id="fieldGradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#00f5a022" />
          <stop offset="100%" stopColor="#0d112a00" />
        </radialGradient>
      </defs>

      {/* Stadium Structure (Procedural) */}
      <path
        d="M100,200 Q400,50 700,200 Q780,300 700,400 Q400,550 100,400 Q20,300 100,200 Z"
        fill="rgba(13,17,42,0.9)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="40"
      />
      <path
        d="M110,210 Q400,70 690,210 Q760,300 690,390 Q400,530 110,390 Q40,300 110,210 Z"
        fill="none"
        stroke="rgba(0,245,160,0.2)"
        strokeWidth="2"
      />

      {/* Field / Stage */}
      <motion.rect
        x="280"
        y="200"
        width="240"
        height="150"
        rx="20"
        fill="url(#fieldGradient)"
        stroke="rgba(0,245,160,0.3)"
        strokeWidth="2"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <circle
        cx="400"
        cy="275"
        r="40"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      {/* Zones / Sectors */}
      {zones.map((zone) => {
        const isActive = activeZoneId === zone.id;
        const color = getZoneColor(zone);
        const x = (zone.coordinates.x / 100) * 800;
        const y = (zone.coordinates.y / 100) * 600;

        return (
          <g
            key={zone.id}
            className="cursor-pointer group"
            onClick={() => setActiveZone(zone.id)}
          >
            {/* Heatmap Layer */}
            <AnimatePresence>
              {heatmapEnabled && (
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 100, opacity: 0.15 }}
                  exit={{ r: 0, opacity: 0 }}
                  cx={x}
                  cy={y}
                  fill={color}
                  filter="url(#mapGlow)"
                />
              )}
            </AnimatePresence>

            {/* Pulse Indicator */}
            <motion.circle
              cx={x}
              cy={y}
              r={15}
              fill={color}
              opacity={0.3}
              animate={{ scale: [1, 2], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Zone Marker */}
            <motion.circle
              cx={x}
              cy={y}
              r={isActive ? 12 : 8}
              fill={color}
              stroke="#fff"
              strokeWidth={isActive ? 3 : 0}
              className="transition-all duration-300"
              filter={isActive ? "url(#mapGlow)" : "none"}
            />

            {/* Floating Name (Desktop Hover/Active) */}
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : 10,
              }}
              className="pointer-events-none"
            >
              <rect
                x={x - 50}
                y={y - 50}
                width="100"
                height="24"
                rx="8"
                fill="rgba(13,17,42,0.95)"
                stroke="rgba(255,255,255,0.1)"
              />
              <text
                x={x}
                y={y - 34}
                textAnchor="middle"
                fill="#fff"
                className="text-[10px] font-headline font-black uppercase tracking-widest"
              >
                {zone.name}
              </text>
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
};
