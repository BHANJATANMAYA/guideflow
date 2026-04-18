import { useState, useEffect } from "react";
import type { Zone, VenueEvent, Recommendation } from "../types";
import { getDataService } from "../services";

export const useCrowdData = (venueId: string) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = getDataService().subscribeToZones(venueId, (z) => {
      console.log("React Hook received data:", z);
      setZones(z);
      setLoading(false);
    });
    return unsub;
  }, [venueId]);

  return { zones, loading };
};

export const useEventData = (eventId: string) => {
  const [event, setEvent] = useState<VenueEvent | null>(null);

  useEffect(() => {
    const unsub = getDataService().subscribeToEvent(eventId, setEvent);
    return unsub;
  }, [eventId]);

  const toggleRushHour = (isRushHour: boolean) =>
    getDataService().toggleRushHour(eventId, isRushHour);

  return { event, toggleRushHour };
};

export const useRecommendations = (userId: string) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const unsub = getDataService().subscribeToRecommendations(
      userId,
      setRecommendations,
    );
    return unsub;
  }, [userId]);

  return { recommendations };
};
