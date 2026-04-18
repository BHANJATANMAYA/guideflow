<div align="center">

# 🏟️ GuideFlow
### *Intelligent Crowd Navigation for Live Events*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-AI_Logic-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Tests](https://img.shields.io/badge/Tests-21_passing-22c55e?style=flat-square)](./src/tests)
[![License](https://img.shields.io/badge/License-MIT-a855f7?style=flat-square)](LICENSE)

**GuideFlow** solves stadium congestion through algorithmic crowd dispersion, real-time Firestore telemetry,  
and an on-device Gemini AI assistant — all without a traditional backend server.

[Live Demo](#) · [Architecture](#-how-it-works) · [Setup](#-getting-started) · [Tests](#-testing)

</div>

---

## 📍 Vertical

**Smart Venues & Live Events** — Sports stadiums, concerts, festivals, and convention centers.

Venue congestion is a genuine safety risk: blocked exits, dangerous bathroom rushes, and slow food-zone throughput all degrade attendee experience. GuideFlow uses real-time crowd density data to intelligently route people away from hot zones — operating like a live GPS for the inside of a stadium.

---

## 🧠 Approach & Logic

The core philosophy is **Proactive Redirection via Path of Least Resistance**. Instead of static maps, GuideFlow dynamically re-weights destination costs using current zone density.

### Three Pillars

| Pillar | Implementation |
|---|---|
| **Algorithmic Weighting** | `crowdAlgorithm.ts` continuously scores zones. If two bathrooms are similar distances away, the one with lower wait time wins — even at the cost of a slightly longer walk. |
| **Visual Immediacy** | Traffic-light color coding (Emerald → Amber → Red), a glassmorphic bento-grid layout, and Framer Motion spring animations mean data is legible in under one second — even under stadium floodlights. |
| **Conversational AI** | Complex natural-language queries (e.g. *"wheelchair exit nearest section 102?"*) are routed to **Gemini 2.5 Flash** via Firebase AI Logic — streaming responses token-by-token with no intermediate server. |

---

## ⚙️ How It Works

```
Venue Sensors ──► Firestore (zones) ──► onSnapshot ──► React State
                                                           │
                        Gemini 2.5 Flash ◄── firebase/ai ◄┘
```

- **Live Telemetry**: Firestore `onSnapshot` streams give sub-100ms UI updates when any zone's density changes.
- **On-Device AI**: `firebase/ai` initializes `GoogleAIBackend` directly in the browser — no Cloud Function needed. Chat sessions persist history across the session for multi-turn context.
- **Route Optimizer**: `routeOptimizer.ts` uses a weighted-graph approach to recommend the least-congested path.
- **Kinetic UI**: `framer-motion` drives liquid tab navigation, physics-based counting animations, and cursor-tracking spotlight gradients.

---

## 🏗️ Project Structure

```
guideflow/
├── src/
│   ├── components/
│   │   ├── Assistant/       # AI chat panel, recommendation cards
│   │   ├── Auth/            # Landing page & auth flows
│   │   ├── Dashboard/       # Live stats, hero, bento cards
│   │   ├── Layout/          # Header, shell, navigation
│   │   ├── Map/             # SVG venue map, heatmap, zone popups
│   │   ├── Modals/          # VIP, help drawer, notifications
│   │   └── Profile/         # User profile, preferences, timeline
│   ├── services/
│   │   ├── aiService.ts     # Gemini 2.5 Flash streaming
│   │   ├── authService.ts   # Firebase Auth (Google + Guest)
│   │   ├── dataService.ts   # Firestore live subscriptions
│   │   └── firebaseClient.ts
│   ├── store/               # Zustand global state
│   ├── tests/               # Vitest unit & integration tests
│   ├── utils/
│   │   ├── crowdAlgorithm.ts  # Density weighting & recommendations
│   │   └── routeOptimizer.ts  # Path-of-least-resistance routing
│   └── types/               # Shared TypeScript interfaces
├── e2e/                     # Playwright end-to-end specs
├── functions/               # Firebase Cloud Functions
├── scripts/                 # Firestore seed data
├── firestore.rules          # Hardened security rules
└── firestore.indexes.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with **Firestore**, **Authentication**, and **AI Logic** enabled

### 1. Clone & Install

```bash
git clone https://github.com/your-username/guideflow.git
cd guideflow
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your Firebase config values in `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Seed Firestore (optional)

```bash
node scripts/seed-firestore.mjs
```

### 4. Run Dev Server

```bash
npm run dev
```

---

## 🧪 Testing

GuideFlow ships with **21 passing tests** across 7 suites — all under `src/tests/`.

```bash
npm run test
```

```
✓ src/tests/utils/crowdAlgorithm.test.ts    (3 tests)
✓ src/tests/services/aiService.test.ts      (2 tests)
✓ src/tests/store/useAppStore.test.ts       (3 tests)
✓ src/tests/components/AskAIInput.test.tsx  (3 tests)
✓ src/tests/components/VenueMap.test.tsx    (3 tests)
✓ src/tests/components/LandingPage.test.tsx (4 tests)
✓ src/tests/components/LiveStats.test.tsx   (3 tests)

Test Files  7 passed (7)
     Tests  21 passed (21)
  Duration  ~4s
```

Static analysis:

```bash
npm run lint    # 0 errors, 0 warnings
npm run build   # production bundle
```

---

## 🔒 Security

Firestore rules enforce strict access control:
- **Events & Venues**: `read` requires `request.auth != null` — no anonymous scraping
- **Users**: Schema-validated `create` — prevents JSON injection via `isValidUserSchema()`
- **Subcollections**: Ownership-gated with `request.auth.uid == userId`

---

## 🤔 Assumptions

| # | Assumption |
|---|---|
| 1 | The venue has sensor infrastructure (Wi-Fi triangulation, BLE, or turnstile APIs) feeding density counts into Firestore |
| 2 | The venue map is logically segmented into ID-based zones (not requiring full 3D coordinate routing) |
| 3 | Attendees have venue Wi-Fi or 4G/5G connectivity |
| 4 | Firebase client-side SDKs (Firestore + AI Logic) are sufficient — avoiding a Node.js middleman server reduces cost and latency |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | TailwindCSS + Framer Motion |
| Database | Firebase Firestore (realtime `onSnapshot`) |
| AI | Google Gemini 2.5 Flash via Firebase AI Logic |
| Auth | Firebase Authentication (Google OAuth + Guest) |
| State | Zustand |
| Testing | Vitest + React Testing Library |
| E2E | Playwright |
| Deploy | Firebase Hosting |

---

<div align="center">

Built with ❤️ for **Google PromptWars** — *[Hack2Skill](https://hack2skill.com)*

</div>
