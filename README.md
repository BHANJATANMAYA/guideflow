# 💠 GuideFlow — Intelligent Event Navigation Pulse

[![License: MIT](https://img.shields.io/badge/License-MIT-00f5a0.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232a?style=flat&logo=react&logoColor=61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

GuideFlow is a premium, real-time spatial intelligence platform designed for high-density environments. It transforms static venue maps into living networks using **Kinetic Pulse** design and proactive AI assistance.

![GuideFlow Dashboard Mockup](https://placehold.co/1200x640/04101a/00f5a0?text=GUIDEFLOW+COMMAND+CENTER+v3.1)

---

## 🎯 Project Overview

### Chosen Vertical
**Smart Venue & Mega-Event Navigation**
GuideFlow targets the "Last Mile" of the attendee experience at large-scale physical events (stadiums, festivals, international summits). In these environments, traditional GPS often fails, and static signage cannot adapt to sudden crowd surges or security incidents. GuideFlow acts as a digital nervous system for the venue, providing attendees with a real-time "Pulse" of their environment.

### Approach and Logic
Our approach prioritizes **Proactive Navigation over Reactive Searching**.
- **The Kinetic Pulse**: Instead of static status indicators, we use a continuous data stream that "pulses" through the UI, indicating high-energy zones and movement trends.
- **Cognitive Load Reduction**: The UI uses a "Bento Grid" layout to surface only the most critical information (wait times, seat location, AI alerts) at a glance.
- **Logic Engine**: 
  - **Threshold Monitoring**: Zones are continuously evaluated against their capacity. Reaching 75% capacity triggers "Crowded" status; 90% triggers automatic "Redirect" logic.
  - **Type-Matching**: When a specific zone (e.g., Washroom East) is blocked, the engine searches for the nearest alternative with the same `type` attribute.

---

## 🛠️ How the Solution Works

GuideFlow operates on a tri-layer architecture that combines real-time data with premium visual fidelity.

### 1. Data Ingestion (The Source)
The system supports two modes of operation:
- **Live Mode**: Subscribes to **Firebase Firestore** collections. Real-time snapshots update the state whenever crowd levels, event scores, or security statuses change.
- **Mock Mode**: A high-fidelity simulation engine that replicates crowd flux, random incidents, and gate fluctuations for testing and offline demos.

### 2. State Orchestration (The Brain)
Using **Zustand**, GuideFlow maintains a centralized "Pulse Store."
- **Atomic Updates**: Only specific components (like a single sector on the map) re-render when their underlying data changes, maintaining 60fps even with complex SVG animations.
- **AI Recommendation Engine**: Filters current environmental conditions through a set of priority rules to surface Urgent (Red), Opportunity (Gold), and Informational (Blue) cards.

### 3. Kinetic Interface (The Pulse)
- **SVG Heatmaps**: A procedurally managed stadium map where each sector is a dynamic component that changes color and opacity based on real-time density.
- **Glassmorphic UI**: High-end visual effects using Tailwind CSS and Framer Motion to create a "Tactile Command Center" feel.

---

## 📝 Assumptions Made

To ensure a robust and performant demo, the following technical assumptions were integrated:
- **Zonal Resolution**: We assume the venue is divided into discrete "Zones" (segments) rather than tracking individual point coordinates, which optimizes Firebase bandwidth and battery life.
- **Linear Congestion**: Wait times are calculated as a linear function of `(CurrentCount / Capacity) * BaseMetric`.
- **Infrastructure Persistence**: The physical coordinates of gates and facilities are assumed to be fixed, though their *status* (Open/Closed) is dynamic.
- **Connectivity Model**: The system is designed with an "Optimistic UI" approach, assuming intermittent connectivity common in crowded stadiums; the last known pulse is cached locally.

---

## 🚀 Technical Implementation

### Tech Stack
- **Framework**: React 19 + TypeScript 5.7
- **Database**: Firebase (Firestore + Authentication)
- **State**: Zustand (Atomic State Orchestration)
- **Animation**: Framer Motion (Kinetic Micro-interactions)
- **Styling**: Tailwind CSS 4.0 (Modern Design System)
- **Icons**: Lucide React + Google Material Symbols

### Getting Started

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Copy `.env.example` to `.env` and add your Firebase credentials.
3.  **Database Seeding**:
    ```bash
    npm run seed:firebase
    ```
4.  **Run Development**:
    ```bash
    npm run dev
    ```

[**View Firebase Setup Guide**](file:///x:/Dev/googlevwars/guideflow/FIREBASE_SETUP.md)

---

© 2026 GUIDEFLOW SYSTEMS • PULSE CORE v3.1
