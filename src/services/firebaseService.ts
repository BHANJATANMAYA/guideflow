import type { DataService, Unsubscribe } from "./dataService";
import type {
  Zone,
  VenueEvent,
  Recommendation,
  Notification,
} from "../types";

export class FirebaseService implements DataService {
  subscribeToZones(
    _venueId: string,
    callback: (zones: Zone[]) => void,
  ): Unsubscribe {
    // Uncomment and fill in to use live Firestore:
    // const q = query(collection(db, `venues/${venueId}/zones`));
    // return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Zone))));
    callback([]);
    return () => {};
  }

  subscribeToEvent(
    _eventId: string,
    callback: (event: VenueEvent | null) => void,
  ): Unsubscribe {
    callback(null);
    return () => {};
  }

  subscribeToRecommendations(
    _userId: string,
    callback: (recs: Recommendation[]) => void,
  ): Unsubscribe {
    callback([]);
    return () => {};
  }

  subscribeToNotifications(
    _userId: string,
    callback: (notifications: Notification[]) => void,
  ): Unsubscribe {
    callback([]);
    return () => {};
  }

  async toggleRushHour(eventId: string, isRushHour: boolean): Promise<void> {
    void eventId;
    void isRushHour;
  }

  async updateUserLocation(userId: string, zoneId: string): Promise<void> {
    void userId;
    void zoneId;
  }
}
