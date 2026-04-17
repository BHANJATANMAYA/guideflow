import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import {
  LucideX,
  LucideCheck,
  LucideCrown,
  LucideZap,
  LucideShieldCheck,
} from "lucide-react";

export const VIPUpgradeModal = () => {
  const { isVIPModalOpen, toggleModal } = useAppStore();

  const tiers = [
    {
      name: "Basic",
      price: "Free",
      desc: "Foundation event access",
      features: ["Live Crowd Map", "Standard Routes", "Utility Search"],
      color: "border-white/10",
      btn: "Current Plan",
      active: true,
    },
    {
      name: "Pro",
      price: "$9.99",
      desc: "Advanced event navigation",
      features: [
        "Real-time Heatmaps",
        "Least-Crowded Routes",
        "AI Smart Alerts",
        "Priority Support",
      ],
      color: "border-primary-container/30",
      btn: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "VIP",
      price: "$24.99",
      desc: "The ultimate elite experience",
      features: [
        "AR Navigation",
        "Pre-emptive Entry",
        "Private Lounge Access",
        "VIP Parking Sync",
        "Dedicated AI Agent",
      ],
      color: "border-amber-400/30",
      btn: "Go Elite",
    },
  ];

  return (
    <AnimatePresence>
      {isVIPModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleModal("vip")}
            className="absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-surface-container-low rounded-[3rem] border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left: Branding/Hero */}
            <div className="md:w-1/3 bg-gradient-to-br from-primary-container/20 to-secondary-container/20 p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-[2rem] bg-on-surface text-surface-container-lowest flex items-center justify-center mb-8 shadow-2xl">
                  <LucideCrown size={32} />
                </div>
                <h2 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tight leading-none mb-4">
                  Elite
                  <br />
                  Level
                  <br />
                  Access
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed uppercase tracking-widest font-black opacity-60">
                  Unlock the full power of GuideFlow
                </p>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex gap-2">
                  <LucideZap size={16} className="text-primary-container" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">
                    99.9% Route Precision
                  </span>
                </div>
                <div className="flex gap-2">
                  <LucideShieldCheck
                    size={16}
                    className="text-secondary-container"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">
                    Priority Safety Sync
                  </span>
                </div>
              </div>

              {/* BG Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Right: Pricing Tiers */}
            <div className="md:w-2/3 p-8 lg:p-12 bg-surface-container-low overflow-y-auto max-h-[80vh] md:max-h-none">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Membership Tiers
                </h3>
                <button
                  onClick={() => toggleModal("vip")}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <LucideX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`glass-card rounded-3xl p-6 border ${tier.color} flex flex-col relative transition-all hover:scale-[1.02]`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h4 className="text-lg font-headline font-black text-on-surface uppercase tracking-tight">
                        {tier.name}
                      </h4>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-headline font-black text-on-surface">
                          {tier.price}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          /mo
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">
                        {tier.desc}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8 flex-grow">
                      {tier.features.map((f) => (
                        <div key={f} className="flex gap-2">
                          <LucideCheck
                            size={12}
                            className="text-primary-container shrink-0"
                          />
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full py-3 rounded-2xl font-headline font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl ${
                        tier.active
                          ? "bg-white/5 text-slate-500 cursor-default"
                          : "bg-on-surface text-surface-container-lowest hover:bg-primary-container hover:text-on-primary-container hover:shadow-primary-container/20"
                      }`}
                    >
                      {tier.btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
