import { Suspense, lazy, useEffect } from "react";
import { motion } from "framer-motion";

import { Shell } from "./components/Layout/Shell";
import { getDataService } from "./services";
import { subscribeToAuthSession } from "./services/authService";
import { useAppStore } from "./store/useAppStore";
import { useUserStore } from "./store/useUserStore";

const LandingPage = lazy(() =>
  import("./components/Auth/LandingPage").then((module) => ({
    default: module.LandingPage,
  })),
);
const HeroSection = lazy(() =>
  import("./components/Dashboard/HeroSection").then((module) => ({
    default: module.HeroSection,
  })),
);
const LiveStats = lazy(() =>
  import("./components/Dashboard/LiveStats").then((module) => ({
    default: module.LiveStats,
  })),
);
const AIAvatar = lazy(() =>
  import("./components/Assistant/AIAvatar").then((module) => ({
    default: module.AIAvatar,
  })),
);
const AskAIInput = lazy(() =>
  import("./components/Assistant/AskAIInput").then((module) => ({
    default: module.AskAIInput,
  })),
);
const CardDeck = lazy(() =>
  import("./components/Assistant/CardDeck").then((module) => ({
    default: module.CardDeck,
  })),
);
const VenueMap = lazy(() =>
  import("./components/Map/VenueMap").then((module) => ({
    default: module.VenueMap,
  })),
);
const UserProfile = lazy(() =>
  import("./components/Profile/UserProfile").then((module) => ({
    default: module.UserProfile,
  })),
);

function App() {
  const {
    activeTab,
    event,
    loading,
    setEvent,
    setLoading,
    setNotifications,
    setZones,
    zones,
  } = useAppStore();
  const {
    applyAuthSession,
    authReady,
    isAuthenticated,
    setAuthReady,
    user,
  } = useUserStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthSession((session) => {
      applyAuthSession(session);
      setAuthReady(true);

      if (!session) {
        setEvent(null);
        setZones([]);
        setNotifications([]);
      }
    });

    return unsubscribe;
  }, [applyAuthSession, setAuthReady, setEvent, setNotifications, setZones]);

  useEffect(() => {
    if (!authReady || !isAuthenticated) {
      return;
    }

    const dataService = getDataService();
    setLoading(true);

    const unsubZones = dataService.subscribeToZones("v1", (nextZones) => {
      setZones(nextZones);
      setLoading(false);
    });
    const unsubEvent = dataService.subscribeToEvent("e1", (nextEvent) => {
      setEvent(nextEvent);
    });
    const unsubNotify = dataService.subscribeToNotifications(
      user.uid || "demo-user",
      (nextNotifications) => setNotifications(nextNotifications),
    );

    return () => {
      unsubZones();
      unsubEvent();
      unsubNotify();
    };
  }, [
    authReady,
    isAuthenticated,
    setEvent,
    setLoading,
    setNotifications,
    setZones,
    user.uid,
  ]);

  if (!authReady) {
    return <FullscreenState label="Restoring Session" />;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<FullscreenState label="Loading Landing Page" />}>
        <LandingPage />
      </Suspense>
    );
  }

  if (loading) {
    return <FullscreenState label="Synchronizing GuideFlow" />;
  }

  return (
    <Shell>
      <Suspense fallback={<InlineState label="Loading Interface" />}>
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
      </Suspense>
    </Shell>
  );
}

const FullscreenState = ({ label }: { label: string }) => (
  <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-6">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="relative w-full h-full border-[6px] border-white/5 border-t-primary-container rounded-full animate-spin"></div>
    </div>
    <div className="text-primary-container font-headline font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">
      {label}
    </div>
  </div>
);

const InlineState = ({ label }: { label: string }) => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="rounded-3xl border border-white/10 bg-surface-container-high/60 px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-primary-container">
      {label}
    </div>
  </div>
);

export default App;
