import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import type { DataService, Unsubscribe } from "./dataService";
import type {
  Notification,
  Recommendation,
  VenueEvent,
  Zone,
} from "../types";
import { getFirestoreDb } from "./firebaseClient";

export class FirebaseService implements DataService {
  subscribeToZones(
    venueId: string,
    callback: (zones: Zone[]) => void,
  ): Unsubscribe {
    const db = getFirestoreDb();

    if (!db) {
      callback([]);
      return () => {};
    }

    const zonesQuery = query(
      collection(db, `venues/${venueId}/zones`),
      orderBy("name"),
    );

    return onSnapshot(
      zonesQuery,
      (snapshot) => {
        const zones = snapshot.docs.map(
          (documentSnapshot) =>
            ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as Zone,
        );
        console.log("Firestore data (zones):", zones);
        callback(zones);
      },
      () => callback([]),
    );
  }

  subscribeToEvent(
    eventId: string,
    callback: (event: VenueEvent | null) => void,
  ): Unsubscribe {
    const db = getFirestoreDb();

    if (!db) {
      callback(null);
      return () => {};
    }

    return onSnapshot(
      doc(db, "events", eventId),
      (snapshot) => {
        callback(
          snapshot.exists()
            ? ({ id: snapshot.id, ...snapshot.data() } as VenueEvent)
            : null,
        );
      },
      () => callback(null),
    );
  }

  subscribeToRecommendations(
    userId: string,
    callback: (recs: Recommendation[]) => void,
  ): Unsubscribe {
    const db = getFirestoreDb();

    if (!db) {
      callback([]);
      return () => {};
    }

    const recommendationsQuery = query(
      collection(db, `users/${userId}/recommendations`),
      orderBy("timestamp", "desc"),
    );

    return onSnapshot(
      recommendationsQuery,
      (snapshot) => {
        const recommendations = snapshot.docs.map(
          (documentSnapshot) =>
            ({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            }) as Recommendation,
        );
        callback(recommendations);
      },
      () => callback([]),
    );
  }

  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void,
  ): Unsubscribe {
    const db = getFirestoreDb();

    if (!db) {
      callback([]);
      return () => {};
    }

    const notificationsQuery = query(
      collection(db, `users/${userId}/notifications`),
      orderBy("timestamp", "desc"),
    );

    return onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifications = snapshot.docs.map(
          (documentSnapshot) =>
            ({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            }) as Notification,
        );
        callback(notifications);
      },
      () => callback([]),
    );
  }

  async toggleRushHour(eventId: string, isRushHour: boolean): Promise<void> {
    const db = getFirestoreDb();
    if (!db) {
      return;
    }

    await updateDoc(doc(db, "events", eventId), {
      rushHour: isRushHour,
    });
  }

  async updateUserLocation(userId: string, zoneId: string): Promise<void> {
    const db = getFirestoreDb();
    if (!db) {
      return;
    }

    await setDoc(
      doc(db, "users", userId),
      {
        currentZoneId: zoneId,
        lastSeen: Date.now(),
      },
      { merge: true },
    );
  }
}
