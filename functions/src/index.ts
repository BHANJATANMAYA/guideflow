/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { GoogleGenerativeAI } from "@google/generative-ai";

setGlobalOptions({ maxInstances: 10 });

// AI Recommendation logic using Gemini API
export const generateTourNightPlan = onCall(async (request) => {
  try {
    const { userPrompt, eventData } = request.data;
    
    // Safety check
    if (!userPrompt) {
      throw new HttpsError("invalid-argument", "Missing user prompt for AI analysis");
    }

    // Google API connection - Ensure process.env.GEMINI_API_KEY is available in Firebase config
    const apiKey = process.env.GEMINI_API_KEY || "demo-key-for-static-analysis";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context = `Given the venue event details: ${JSON.stringify(eventData)}.
    Analyze the situation: ${userPrompt}.
    Respond with a very brief navigation recommendation for a concert fan.`;

    // Process output
    const result = await model.generateContent(context);
    const responseText = result.response.text();

    return {
      status: "success",
      recommendation: responseText,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw new HttpsError("internal", "Unable to compute AI intelligence right now. " + (error as Error).message);
  }
});
