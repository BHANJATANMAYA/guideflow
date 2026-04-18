import { startTransition, useState, useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  LucideArrowRight,
  LucideLogIn,
  LucideMapPinned,
  LucideShieldCheck,
  LucideSparkles,
  LucideUsers,
  LucideZap
} from "lucide-react";

import { useAppStore } from "../../store/useAppStore";
import { useUserStore } from "../../store/useUserStore";
import {
  continueAsGuest,
  isGoogleSignInAvailable,
  signInWithGoogle,
} from "../../services/authService";

export const LandingPage = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setActiveTab } = useAppStore();
  const { applyAuthSession } = useUserStore();

  // Parallax Ambient Orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map to roughly -50 to 50 based on screen percentage
      const percentX = (e.clientX / window.innerWidth) - 0.5;
      const percentY = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(percentX * 100);
      mouseY.set(percentY * 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const enterDemo = async () => {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Enter designation so GuideFlow can personalize the terminal.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const session = await continueAsGuest(trimmedName);
      startTransition(() => {
        applyAuthSession(session);
        setActiveTab("dashboard");
      });
    } catch {
      setError("GuideFlow could not initialize local sandbox. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const enterWithGoogle = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const session = await signInWithGoogle();
      startTransition(() => {
        applyAuthSession(session);
        setActiveTab("dashboard");
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Secure access failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-surface-container-lowest text-on-surface relative">
      <div className="absolute inset-0 dynamic-mesh opacity-80" />
      
      {/* Decorative Interactive Focus Orbs */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/10 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        style={{ x: useTransform(springX, (v) => -v), y: useTransform(springY, (v) => -v) }}
        className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/10 blur-[150px] pointer-events-none" 
      />
      
      {/* Subtle overlay grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10 lg:px-10 z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.3fr_1fr]">
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <p className="text-primary-container font-headline text-[10px] tracking-[0.4em] uppercase font-black">
                SMART EVENT NAVIGATION • KINETIC PULSE ACTIVE
              </p>
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-6xl md:text-8xl font-headline font-black tracking-tighter text-on-surface leading-[0.95]">
                Enter the Venue. <br />
                <span className="bg-gradient-to-r from-primary-container via-secondary-container to-primary-container bg-[length:200%_auto] animate-text-gradient bg-clip-text text-transparent">
                  Beat the Crowd.
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-400 font-medium">
                GuideFlow turns static venues into living networks. Experience real-time heatmaps, live routing, and intelligent queue management at your fingertips.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 pt-4">
              <FeatureCard
                icon={<LucideMapPinned size={22} />}
                title="Live routing"
                color="text-primary-container"
                bgColor="bg-primary-container/10"
                borderColor="border-primary-container/20"
              />
              <FeatureCard
                icon={<LucideUsers size={22} />}
                title="Crowd insights"
                color="text-secondary-container"
                bgColor="bg-secondary-container/10"
                borderColor="border-secondary-container/20"
              />
              <FeatureCard
                icon={<LucideZap size={22} />}
                title="Real-time Pulse"
                color="text-amber-400"
                bgColor="bg-amber-400/10"
                borderColor="border-amber-400/20"
              />
              <FeatureCard
                icon={<LucideShieldCheck size={22} />}
                title="Secure Identity"
                color="text-emerald-400"
                bgColor="bg-emerald-400/10"
                borderColor="border-emerald-400/20"
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-500 hover:neon-glow-primary border border-white/5 shadow-2xl">
              
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-10 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-headline font-black tracking-tight text-on-surface uppercase">
                      Access Terminal
                    </h2>
                    <p className="mt-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary-container">
                      Initialize GuideFlow
                    </p>
                  </div>
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-primary-container border border-primary-container/20 shadow-[0_0_15px_rgba(0,245,160,0.2)]">
                    <LucideSparkles size={28} />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block space-y-3">
                    <span className="text-xs font-headline font-black uppercase tracking-[0.24em] text-slate-400">
                      Display Identity
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter designation..."
                      className="w-full rounded-2xl border border-white/10 bg-surface-container-highest/80 px-6 py-5 text-lg font-bold text-on-surface outline-none transition focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 focus:bg-surface-container-highest placeholder:text-slate-600 shadow-inner"
                    />
                  </label>

                  <div className="flex flex-col gap-4">
                    <MagneticWrapper>
                      <button
                        type="button"
                        onClick={enterDemo}
                        disabled={isSubmitting}
                        className="group/btn flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-container px-6 py-5 text-sm font-headline font-black uppercase tracking-[0.2em] text-on-primary-container transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(0,245,160,0.4)] disabled:opacity-70 disabled:pointer-events-none"
                      >
                        <span className="relative z-10">Launch Dashboard</span>
                        <LucideArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </MagneticWrapper>

                    <MagneticWrapper>
                      <button
                        type="button"
                        onClick={enterWithGoogle}
                        disabled={isSubmitting || !isGoogleSignInAvailable}
                        className="group/btn flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm font-headline font-black uppercase tracking-[0.2em] text-on-surface transition-all hover:bg-white/10 hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50 hover:text-white"
                      >
                        <LucideLogIn size={20} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                        {isGoogleSignInAvailable
                          ? "Authenticate via Google"
                          : "Google Auth Locked"}
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/5 bg-surface-container-high/30 p-5 flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-secondary-container mt-1.5 animate-pulse shrink-0" />
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {isGoogleSignInAvailable
                      ? "System online. Secure Firebase connection established."
                      : "Operating in standalone demo sandbox. Connect Firebase config to enable persistent Google authentication."}
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 flex items-center gap-3 text-sm font-bold text-rose-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  color,
  bgColor,
  borderColor,
}: {
  icon: ReactNode;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) => (
  <div className="glass-panel group rounded-[1.25rem] border border-white/5 p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgColor} ${color} border ${borderColor} shadow-inner`}>
      {icon}
    </div>
    <h3 className="text-sm font-headline font-black uppercase tracking-[0.05em] text-slate-200">
      {title}
    </h3>
  </div>
);

const MagneticWrapper = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.2); // 20% pull
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};
