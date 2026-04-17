import type { DataService, Unsubscribe } from "./dataService";
import type { Zone, VenueEvent, Recommendation, Notification } from "../types";

const INITIAL_ZONES: Zone[] = [
  {
    id: "z1",
    name: "Gate Alpha",
    type: "gate",
    capacity: 5000,
    currentCount: 2100,
    waitTime: 12,
    status: "open",
    coordinates: { x: 20, y: 30 },
    lastUpdated: Date.now(),
  },
  {
    id: "z2",
    name: "Gate Bravo",
    type: "gate",
    capacity: 3000,
    currentCount: 2800,
    waitTime: 35,
    status: "crowded",
    coordinates: { x: 80, y: 30 },
    lastUpdated: Date.now(),
  },
  {
    id: "z3",
    name: "Food North",
    type: "food",
    capacity: 1500,
    currentCount: 1350,
    waitTime: 45,
    status: "crowded",
    coordinates: { x: 50, y: 15 },
    lastUpdated: Date.now(),
  },
  {
    id: "z4",
    name: "Washrooms East",
    type: "washroom",
    capacity: 200,
    currentCount: 50,
    waitTime: 2,
    status: "open",
    coordinates: { x: 85, y: 50 },
    lastUpdated: Date.now(),
  },
  {
    id: "z5",
    name: "Washrooms West",
    type: "washroom",
    capacity: 200,
    currentCount: 150,
    waitTime: 8,
    status: "open",
    coordinates: { x: 15, y: 50 },
    lastUpdated: Date.now(),
  },
  {
    id: "z6",
    name: "Merch Plaza",
    type: "merch",
    capacity: 1000,
    currentCount: 200,
    waitTime: 5,
    status: "open",
    coordinates: { x: 50, y: 85 },
    lastUpdated: Date.now(),
  },
  {
    id: "z7",
    name: "VIP Deck",
    type: "viewing",
    capacity: 800,
    currentCount: 750,
    waitTime: 0,
    status: "open",
    coordinates: { x: 70, y: 15 },
    lastUpdated: Date.now(),
  },
  {
    id: "z8",
    name: "Parking A",
    type: "parking",
    capacity: 2000,
    currentCount: 1950,
    waitTime: 25,
    status: "limited",
    coordinates: { x: 10, y: 10 },
    lastUpdated: Date.now(),
  },
  {
    id: "z9",
    name: "Medical Center",
    type: "medical",
    capacity: 100,
    currentCount: 10,
    waitTime: 0,
    status: "open",
    coordinates: { x: 90, y: 10 },
    lastUpdated: Date.now(),
  },
  {
    id: "z10",
    name: "Exit South",
    type: "exit",
    capacity: 8000,
    currentCount: 0,
    waitTime: 0,
    status: "open",
    coordinates: { x: 50, y: 95 },
    lastUpdated: Date.now(),
  },
];

const INITIAL_EVENT: VenueEvent = {
  id: "e1",
  name: "Champion's League Final",
  startTime: Date.now() + 1000 * 60 * 45, // 45 mins from now
  rushHour: false,
  activeUsers: 42560,
  teams: {
    home: { name: "Lions", logo: "", winProb: 64 },
    away: { name: "Titans", logo: "", winProb: 36 },
  },
  weather: {
    temp: 18,
    condition: "Clear Sky",
  },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Gate B Alert",
    message:
      "Gate B is experiencing high traffic. Redirecting to Gate A for faster entry.",
    type: "alert",
    timestamp: Date.now() - 1000 * 60 * 5,
    read: false,
  },
  {
    id: "n2",
    title: "Merch Discount",
    message: "VIP Members get 20% off at the Merch Plaza for the next 30 mins!",
    type: "update",
    timestamp: Date.now() - 1000 * 60 * 15,
    read: true,
  },
];

export class MockDataService implements DataService {
  private zones: Zone[] = [...INITIAL_ZONES];
  private event: VenueEvent = { ...INITIAL_EVENT };
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  private zoneListeners: ((zones: Zone[]) => void)[] = [];
  private eventListeners: ((event: VenueEvent | null) => void)[] = [];
  private notificationListeners: ((notifications: Notification[]) => void)[] =
    [];

  constructor() {
    this.startSimulation();
  }

  private startSimulation() {
    setInterval(() => {
      // Simulate crowd movement
      this.zones = this.zones.map((zone) => {
        const fluctuation = Math.floor(
          zone.capacity * (Math.random() * 0.08 - 0.04),
        );
        let newCount = zone.currentCount + fluctuation;

        // Influence by rush hour
        if (this.event.rushHour && zone.type === "gate")
          newCount += Math.floor(zone.capacity * 0.03);
        if (this.event.rushHour && zone.type === "exit")
          newCount -= Math.floor(zone.capacity * 0.02);

        newCount = Math.max(0, Math.min(newCount, zone.capacity));
        const density = newCount / zone.capacity;
        const waitTime = Math.floor(density * 45) + (density > 0.8 ? 15 : 0);

        let status: Zone["status"] = "open";
        if (density > 0.85) status = "crowded";
        else if (density > 0.7) status = "limited";

        return {
          ...zone,
          currentCount: newCount,
          waitTime,
          status,
          lastUpdated: Date.now(),
        };
      });

      // Update listeners
      this.zoneListeners.forEach((l) => l(this.zones));

      // Occasionally update user count
      this.event = {
        ...this.event,
        activeUsers:
          this.event.activeUsers + Math.floor(Math.random() * 100 - 45),
      };
      this.eventListeners.forEach((l) => l(this.event));
    }, 5000);
  }

  subscribeToZones(_venueId: string, cb: (zones: Zone[]) => void): Unsubscribe {
    this.zoneListeners.push(cb);
    cb(this.zones);
    return () => {
      this.zoneListeners = this.zoneListeners.filter((l) => l !== cb);
    };
  }

  subscribeToEvent(
    _eventId: string,
    cb: (event: VenueEvent | null) => void,
  ): Unsubscribe {
    this.eventListeners.push(cb);
    cb(this.event);
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== cb);
    };
  }

  subscribeToRecommendations(
    _userId: string,
    cb: (recs: Recommendation[]) => void,
  ): Unsubscribe {
    // This is now handled by the crowdAlgorithm.ts utility in real-time
    cb([]);
    return () => {};
  }

  subscribeToNotifications(
    _userId: string,
    cb: (notifications: Notification[]) => void,
  ): Unsubscribe {
    this.notificationListeners.push(cb);
    cb(this.notifications);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(
        (l) => l !== cb,
      );
    };
  }

  async toggleRushHour(_eventId: string, isRushHour: boolean): Promise<void> {
    this.event.rushHour = isRushHour;
    this.eventListeners.forEach((l) => l(this.event));
  }

  async updateUserLocation(_userId: string, _zoneId: string): Promise<void> {}

  async markNotificationRead(notificationId: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n,
    );
    this.notificationListeners.forEach((l) => l(this.notifications));
  }
}
