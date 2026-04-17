// GuideFlow domain types — v3
export type ZoneType =
  | "gate"
  | "food"
  | "washroom"
  | "exit"
  | "parking"
  | "merch"
  | "viewing"
  | "medical";
export type ZoneStatus = "open" | "closed" | "limited" | "crowded";

export interface Coordinates {
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  capacity: number;
  currentCount: number;
  waitTime: number; // minutes
  status: ZoneStatus;
  coordinates: Coordinates;
  lastUpdated: number;
  description?: string;
  amenities?: string[];
}

/** Renamed to VenueEvent to avoid clash with the global DOM Event type */
export interface VenueEvent {
  id: string;
  name: string;
  startTime: number;
  rushHour: boolean;
  activeUsers: number;
  teams?: {
    home: { name: string; logo: string; winProb: number };
    away: { name: string; logo: string; winProb: number };
  };
  weather?: {
    temp: number;
    condition: string;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "urgent" | "recommended" | "tip" | "opportunity" | "navigation";
  priority: "high" | "medium" | "low";
  icon?: string;
  action?: "navigate" | "dismiss" | "remind" | "show_seat";
  actionLabel?: string;
  targetZoneId?: string;
  timestamp: number;
}

export interface Route {
  id: string;
  name: string;
  path: Coordinates[];
  distance: number; // meters
  estimatedTime: number; // minutes
  densityScore: number; // 0-1
  type: "fastest" | "least_crowded" | "accessible";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "update" | "system";
  timestamp: number;
  read: boolean;
}
