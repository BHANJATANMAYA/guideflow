# GuideFlow — Smart Event Navigation Companion

Built for high-energy environments like stadiums and convention centers, GuideFlow uses **Kinetic Pulse** design and real-time data intelligence to optimize the visitor experience.

![GuideFlow Demo](https://placehold.co/1200x600/080c25/00f5a0?text=GuideFlow+Pulse+Core+v3.0)

## 🎯 Chosen Vertical
**Smart Venue & Mega-Event Navigation**
GuideFlow is designed for large-scale venues (stadiums, arenas, festivals) where complex crowd dynamics, high-density traffic, and time-sensitive movement are critical challenges. It bridges the gap between venue operations and attendee experience through live spatial intelligence.

## 🧠 Approach & Logic

### Intelligent Logic Layer
GuideFlow utilizes a rule-based engine to process environmental data and provide proactive assistance:
- **Congestion Detection**: Monitors zone density in real-time. If occupancy exceeds 80%, the system automatically flags the area as "Crowded" and begins searching for lower-density alternatives.
- **Dynamic Rerouting**: When a primary goal (e.g., washroom, gate) is congested, the algorithm identifies the nearest "Open" alternative of the same type to redirect traffic.
- **Predictive Tips**: Analyzes event timing (e.g., minutes until kickoff) to trigger priority alerts, encouraging users to find their seats before the "Rush Hour" bias kicks in.

### Technical Approach
- **Atomic State Management**: Uses **Zustand** to handle high-frequency data updates without UI lag, ensuring the "Kinetic Pulse" remains smooth.
- **Mock-First Architecture**: Built around a robust `MockDataService` that simulates real-world sensors, crowd flux, and unpredictable event changes.
- **Vector-First Visualization**: Entire venue maps are built using procedurally managed SVG paths, allowing for infinite zoom and real-time heatmap overlays without heavy asset loads.

## 🛠️ How it Works

1. **The Pulse (Data Source)**: Every 5 seconds, the `MockDataService` simulates a new update for each venue zone. It introduces random fluctuations (±4%) and applies "Rush Hour" biases to simulate realistic attendee behavior.
2. **The Brain (Logic)**: The `crowdAlgorithm` processes the raw zone data, calculating wait times based on density/capacity and generating prioritized recommendations (Urgent, Opportunity, Tip).
3. **The Interface (UI)**: The Bento-style dashboard and interactive map render these insights using Framer Motion for micro-interactions, providing users with instant situational awareness.

## 📝 Assumptions Made

- **Coordinate System**: Assumes the venue can be represented on a simplified 2D coordinate grid for distance and routing calculations.
- **Linear Density/Wait Model**: The wait time for any zone is assumed to be a linear function of its current density relative to its capacity.
- **Static Infrastructure**: Assumes the physical layout of the venue (gates, food courts, zones) is fixed during the event duration.
- **Uniform User Response**: Assumes users will prioritize shorter wait times and follow recommendations when presented with "Urgent" alerts.

---

## 🚀 Key Features

- **Dynamic Dashboard**: Live match tracking, atmosphere analysis, and trending zones.
- **Interactive Arena Map**: Procedurally generated SVG stadium with real-time crowd heatmap overlays.
- **AI Assistant**: Smart recommendation engine with a card-deck interface.
- **Command Center**: User profile with hardware sync (Watches, AR glasses).

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **State**: Zustand
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React + Material Symbols

## 📦 Quick Start

```bash
npm install
npm run dev
```

© 2026 GUIDEFLOW SYSTEMS • PULSE CORE v3.0
