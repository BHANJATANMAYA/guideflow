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
  /**
   * Subscribes to real-time updates for venue zones.
   * @param venueId The unique identifier for the venue
   * @param callback Function to execute with the updated list of zones
   */
  subscribeToZones(
    venueId: string,
    callback: (zones: Zone[]) => void,
  ): Unsubscribe {
    const db = getFirestoreDb();

    if (!db) {
      console.warn("[FirebaseService] Firestore DB not initialized.");
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
        callback(zones);
      },
      (error) => {
        console.error(`[FirebaseService] Error subscribing to zones for ${venueId}:`, error);
        callback([]);
      },
    );
  }

  /**
   * Subscribes to real-time updates for a specific event.
   * @param eventId The event identifier
   * @param callback Function to execute with the updated event data
   */
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
      (error) => {
        console.error(`[FirebaseService] Error subscribing to event ${eventId}:`, error);
        callback(null);
      },
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

  /**
   * Set the rush hour status of an event.
   */
  async toggleRushHour(eventId: string, isRushHour: boolean): Promise<void> {
    const db = getFirestoreDb();
    if (!db) return;

    try {
      await updateDoc(doc(db, "events", eventId), {
        rushHour: isRushHour,
      });
    } catch (error) {
      console.error(`[FirebaseService] Failed to toggle rush hour for ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Update the user's current location in Firestore.
   */
  async updateUserLocation(userId: string, zoneId: string): Promise<void> {
    const db = getFirestoreDb();
    if (!db) return;

    try {
      await setDoc(
        doc(db, "users", userId),
        {
          currentZoneId: zoneId,
          lastSeen: Date.now(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error(`[FirebaseService] Failed to update location for user ${userId}:`, error);
      throw error;
    }
  }
}
