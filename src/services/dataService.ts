import type {
  Zone,
  VenueEvent,
  Recommendation,
  Notification,
} from "../types";

export type Unsubscribe = () => void;

export interface DataService {
  subscribeToZones(
    venueId: string,
    callback: (zones: Zone[]) => void,
  ): Unsubscribe;
  subscribeToEvent(
    eventId: string,
    callback: (event: VenueEvent | null) => void,
  ): Unsubscribe;
  subscribeToRecommendations(
    userId: string,
    callback: (recs: Recommendation[]) => void,
  ): Unsubscribe;
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void,
  ): Unsubscribe;
  toggleRushHour(eventId: string, isRushHour: boolean): Promise<void>;
  updateUserLocation(userId: string, zoneId: string): Promise<void>;
}
