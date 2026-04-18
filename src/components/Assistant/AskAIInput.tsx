import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideSend, LucideMic, LucideSparkles, LucideUser } from "lucide-react";
import { sendMessageToGemini } from "../../services/aiService";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  streaming?: boolean;
}

// This feature is powered by Google Gemini API via Firebase AI Logic
export const AskAIInput = () => {
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isGenerating) return;

    const userMessage = query.trim();
    setQuery("");
    setError(null);
    setIsGenerating(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    // Add empty AI message that will stream in
    setMessages((prev) => [...prev, { role: "ai", text: "", streaming: true }]);

    try {
      console.log("Google Gemini API via Firebase AI Logic executing...");

      await sendMessageToGemini(userMessage, (chunk) => {
        // Append each streamed chunk to the last AI message
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "ai") {
            updated[updated.length - 1] = {
              ...last,
              text: last.text + chunk,
            };
          }
          return updated;
        });
      });

      // Mark streaming done
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "ai") {
          updated[updated.length - 1] = { ...last, streaming: false };
        }
        return updated;
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Gemini is unavailable.";
      setError(errMsg);
      // Remove the empty streaming message
      setMessages((prev) => prev.filter((m) => m.text !== "" || m.role !== "ai"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30 pointer-events-none">
      <motion.div
        drag
        dragConstraints={{ left: -400, right: 400, top: -500, bottom: 50 }}
        dragElastic={0.05}
        dragMomentum={false}
        className="w-full flex flex-col items-end gap-2 pointer-events-auto"
      >
        {/* Drag Handle Indicator */}
        <div className="w-full flex justify-center mb-1 opacity-20 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pb-2">
          <div className="w-12 h-1.5 bg-white rounded-full" />
        </div>

        {/* Chat History Panel — with opaque backdrop to prevent CardDeck bleed-through */}
      {messages.length > 0 && (
        <div className="w-full relative">
          {/* Top fade gradient */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#090e1a] to-transparent z-10 pointer-events-none rounded-t-2xl" />
          <div
            ref={scrollRef}
            className="w-full max-h-64 overflow-y-auto space-y-3 py-4 px-4 pr-3 rounded-2xl bg-[#0d1424]/98 backdrop-blur-xl border border-white/10 shadow-[0_-20px_40px_-5px_rgba(0,0,0,0.8)]"
          >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-primary-container/20 border border-primary-container/30 flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                    <LucideSparkles size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium ${
                    msg.role === "user"
                      ? "bg-primary-container/20 text-on-surface rounded-tr-sm border border-primary-container/20"
                      : "glass-panel border border-white/10 text-on-surface rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                  {msg.streaming && (
                    <span className="inline-block ml-1 w-1 h-4 bg-primary-container animate-pulse rounded-full align-middle" />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                    <LucideUser size={14} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="w-full text-[10px] text-red-400 font-bold px-2">
          ⚠ {error}
        </div>
      )}

      {/* Gemini Badge */}
      <span className="text-[10px] font-black uppercase tracking-widest text-primary-container/70 flex items-center gap-1 self-start">
        <LucideSparkles size={10} />
        Powered by Google Gemini AI
      </span>

      {/* Input Bar */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel w-full p-2 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex items-center gap-2 transition-all hover:border-white/20"
      >
        <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
          {isGenerating
            ? <div className="animate-spin w-4 h-4 border-2 border-primary-container border-t-transparent rounded-full" />
            : <LucideSparkles size={20} />
          }
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isGenerating ? "Generating response via Gemini..." : "Ask GuideFlow anything..."}
          disabled={isGenerating}
          className="flex-grow bg-transparent border-none outline-none text-on-surface placeholder:text-slate-600 font-headline font-bold text-sm px-2 uppercase tracking-tight disabled:opacity-50"
        />

        <div className="flex items-center gap-1 pr-2">
          <button aria-label="Voice input" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <LucideMic size={20} />
          </button>
          <button
            aria-label="Send message"
            disabled={!query.trim() || isGenerating}
            onClick={handleSend}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              query.trim() && !isGenerating
                ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20"
                : "bg-white/5 text-slate-700 translate-x-2 opacity-50"
            }`}
          >
            <LucideSend size={20} />
          </button>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
};
