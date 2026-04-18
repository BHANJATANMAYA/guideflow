# GuideFlow 🏟️
*Intelligent crowd dispersion and live event navigation.*

GuideFlow is a Next-Gen, live-event navigation system engineered to solve severe stadium and venue congestion through algorithmic crowd dispersion, real-time spatial intelligence, and **Google Gemini** integration.

---

## 📍 Chosen Vertical
**Smart Venues & Live Events (Sports, Concerts, Conventions)**
Stadiums and massive venues frequently suffer from dangerous user bottlenecks—whether it's post-event exits, halftime bathroom rushes, or overcrowded merchandise stands. GuideFlow operates in the Live Events vertical to maximize venue safety, improve attendee satisfaction, and increase vendor throughput by intelligently routing crowds *away* from congested zones.

---

## 🧠 Approach and Logic
The core philosophy of GuideFlow is **Proactive Redirection via Path of Least Resistance**. 
Instead of merely showing a user a static map, the application dynamically re-weights locations based on real-time density. 

**The logic follows three pillars:**
1. **Algorithmic Weighting:** The system continuously monitors zone capacities. If a user requests bathroom directions, GuideFlow calculates the closest bathroom *factoring in the current wait time*, sending them to a slightly further bathroom if the total trip time is shorter.
2. **Visual Immediacy:** Users at chaotic live events don't have time to read complex charts. We approached the UI using immediate traffic-light color coding (Emerald/Amber/Red) and a highly kinetic, glassmorphic layout so data is legible in bright or dark environments within a second.
3. **Conversational AI Assistance:** Complex distinct requests (e.g., "Where is the wheelchair accessible exit closest to section 102?") are offloaded to **Google Gemini** via a streaming client-side chat interface, preventing the need to build infinite hard-coded menus.

---

## ⚙️ How the Solution Works
GuideFlow is a React application deeply integrated with Google Cloud and Firebase services.

* **Live Telemetry:** The app relies on a Firebase Firestore backend. The map and dashboard components use extreme-low-latency `onSnapshot` listeners to subscribe to changes in the `zones` collection. When a zone fills up, the UI updates instantly without polling.
* **On-Device AI Logic:** We utilized the brand new `firebase/ai` module (Firebase AI Logic). By initializing the `GoogleAIBackend`, we successfully implemented `gemini-2.5-flash` natively on the client. This drives a multi-turn, streaming Chatbot capable of advising tourists on venue layouts with native typed chat history.
* **Performance Tier UI:** The frontend utilizes `framer-motion` for hardware-accelerated animations (liquid tab navigation, physics-based springs on numeric data, and tracking spotlights) to ensure the application feels like a native OS-level tool.

---

## 🤔 Assumptions Made
To scope this solution effectively, the following systemic assumptions were made:
1. **Sensor Integrations:** We assume the venue inherently possesses the hardware required to track crowd density (e.g., Wi-Fi triangulation, BLE beacons, or turnstile/camera counting APIs) and that this data is piped directly into our Firestore database.
2. **Pre-Mapped Zones:** We assume the venue map can be logically segmented into distinct ID-based "Zones" rather than requiring 3D coordinate-level routing (which drains mobile batteries).
3. **Connectivity:** We assume attendees have access to venue Wi-Fi or standard 4G/5G mobile connectivity. 
4. **Client-Side Scalability:** We assume relying on Firebase's client-side SDKs (Firestore streams and Firebase AI Logic) is sufficient and optimal compared to building an intermediate Node.js bottleneck server, severely reducing overhead costs per user.

---
*Built with ❤️ utilizing React, TailwindCSS, Firebase, and Google Gemini.*
