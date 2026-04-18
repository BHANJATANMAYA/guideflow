/**
 * Firebase AI Logic Service
 * This module uses Google Gemini API via Firebase AI Logic (client-side, no backend needed).
 * Uses the free Gemini Developer API tier.
 */

import { getAI, getGenerativeModel, GoogleAIBackend, type ChatSession } from "firebase/ai";
import { getFirebaseApp } from "./firebaseClient";

const SYSTEM_PROMPT = `You are GuideFlow AI, a smart venue navigation assistant for live events and concerts.
You help fans navigate the stadium, find the shortest queues, avoid crowded zones, and get real-time recommendations.
Keep responses brief, friendly, and actionable — ideally 2-3 sentences max.
Use emojis sparingly for personality. Focus on navigation, crowd management, food, restrooms, parking, and event info.`;

// This feature is powered by Google Gemini API via Firebase AI Logic
let chatSession: ChatSession | null = null;

function getGeminiModel() {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase is not configured. Check your .env variables.");

  const ai = getAI(app, { backend: new GoogleAIBackend() });

  // Using gemini-2.5-flash — latest stable model (Gemini 2.0 Flash is deprecated Jun 2026)
  return getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7,
    },
  });
}

/**
 * Send a message to Gemini and stream the response chunk-by-chunk.
 * Maintains multi-turn chat history for the session.
 */
export async function sendMessageToGemini(
  userMessage: string,
  onChunk: (text: string) => void
): Promise<void> {
  const model = getGeminiModel();

  // Initialize chat session with GuideFlow system context on first call
  if (!chatSession) {
    chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Ready! I'm GuideFlow AI — ask me anything about navigating the event 🎶" }],
        },
      ],
    });
  }

  console.log("[GuideFlow] Google Gemini API via Firebase AI Logic executing...");

  // Stream the response token by token for a real-time typing effect
  const result = await chatSession.sendMessageStream(userMessage);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (chunkText) {
      onChunk(chunkText);
    }
  }
}

/** Reset the chat session (call on sign-out or new event) */
export function resetChatSession(): void {
  chatSession = null;
}
