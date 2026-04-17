import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shell } from "./components/Layout/Shell";

// Store
import { useAppStore } from "./store/useAppStore";

// Components
import { HeroSection } from "./components/Dashboard/HeroSection";
import { LiveStats } from "./components/Dashboard/LiveStats";
import { VenueMap } from "./components/Map/VenueMap";
import { AIAvatar } from "./components/Assistant/AIAvatar";
import { CardDeck } from "./components/Assistant/CardDeck";
import { AskAIInput } from "./components/Assistant/AskAIInput";
import { UserProfile } from "./components/Profile/UserProfile";

// Services
import { getDataService } from "./services";

function App() {
  const {
    activeTab,
    setEvent,
    setZones,
    setNotifications,
    loading,
    setLoading,
    event,
    zones,
  } = useAppStore();

  useEffect(() => {
    const dataService = getDataService();

    const unsubZones = dataService.subscribeToZones("v1", (nextZones) => {
      setZones(nextZones);
      setLoading(false);
    });
    const unsubEvent = dataService.subscribeToEvent("e1", (nextEvent) =>
      setEvent(nextEvent),
    );
    const unsubNotify = dataService.subscribeToNotifications(
      "u1",
      (nextNotifications) => setNotifications(nextNotifications),
    );

    return () => {
      unsubZones();
      unsubEvent();
      unsubNotify();
    };
  }, [setEvent, setLoading, setNotifications, setZones]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full border-[6px] border-white/5 border-t-primary-container rounded-full animate-spin"></div>
        </div>
        <div className="text-primary-container font-headline font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">
          Synchronizing GuideFlow
        </div>
      </div>
    );
  }

  return (
    <Shell>
      {activeTab === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          <HeroSection event={event} />
          <LiveStats zones={zones} />
        </motion.div>
      )}

      {activeTab === "map" && (
        <motion.div
          key="map"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100vh-12rem)]"
        >
          <VenueMap zones={zones} />
        </motion.div>
      )}

      {activeTab === "assistant" && (
        <motion.div
          key="assistant"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <AIAvatar />
          <CardDeck />
          <AskAIInput />
        </motion.div>
      )}

      {activeTab === "profile" && (
        <motion.div
          key="profile"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.4 }}
        >
          <UserProfile />
        </motion.div>
      )}
    </Shell>
  );
}

export default App;
