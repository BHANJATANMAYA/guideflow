import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideCompass, LucideSparkles, LucideX, LucideArrowRight } from "lucide-react";
import { generateTourPlan } from "../../services/aiService";
import { useAppStore } from "../../store/useAppStore";

export const TourAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const { event, zones } = useAppStore();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = "Plan my night to avoid crowds and see the best parts of the event.";
      const data = {
        eventName: event?.name,
        zones: zones.map(z => ({ name: z.name, waitTime: z.waitTime, status: z.status })),
        isRushHour: event?.rushHour
      };
      
      const result = await generateTourPlan(prompt, data);
      setItinerary(result.recommendation);
    } catch (error) {
      console.error("Tour Advisor Error:", error);
      setItinerary("Unable to generate a tour plan right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container hover:bg-primary-container/20 transition-all text-sm font-bold"
      >
        <LucideCompass size={18} />
        Plan My Night
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-lg p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-secondary-container" />
              
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <LucideX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                  <LucideSparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">AI Tour Advisor</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Powered by Google Gemini</p>
                </div>
              </div>

              {!itinerary ? (
                <div className="space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Let GuideFlow's AI analyze the real-time crowd data and venue layout to build you a personalized path
                    of least resistance.
                  </p>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-primary-container text-on-primary-container font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Scan Live Conditions
                        <LucideArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-slate-200 text-sm leading-relaxed font-medium">
                    {itinerary}
                  </div>
                  
                  <button
                    onClick={() => setItinerary(null)}
                    className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Generate New Plan
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
