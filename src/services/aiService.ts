/**
 * Firebase AI Logic Service
 * This module uses Google Gemini API via Firebase AI Logic (client-side, no backend needed).
 * Uses the free Gemini Developer API tier.
 */

import { getFunctions, httpsCallable } from "firebase/functions";
import { getAI, getGenerativeModel, GoogleAIBackend, type ChatSession } from "firebase/ai";
import { getFirebaseApp } from "./firebaseClient";

const SYSTEM_PROMPT = `You are GuideFlow AI, a premium stadium navigation assistant.
Your goal is to provide elite crowd-avoidance routing, find the shortest wait times for food/restrooms, and offer safety-first guidance.
Keep responses concise (2-3 sentences), helpful, and high-energy 🏟️.
Refer to specific zones and real-time density scores when available.`;

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

/**
 * Call the Firebase Cloud Function for a structured Tour Night Plan.
 * This demonstrates adoption of Google Cloud Functions & Gemini integration.
 */
export async function generateTourPlan(userPrompt: string, eventData: unknown) {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase not configured");

  const functions = getFunctions(app);
  const generatePlan = httpsCallable(functions, "generateTourNightPlan");

  console.log("[GuideFlow] Calling Cloud Function: generateTourNightPlan...");
  const result = await generatePlan({ userPrompt, eventData });
  return result.data as { recommendation: string; status: string };
}
