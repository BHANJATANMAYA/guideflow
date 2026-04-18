import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { initializeApp } from "firebase/app";
import { doc, writeBatch, getFirestore } from "firebase/firestore";

const rootDir = resolve(process.cwd());
const envPath = resolve(rootDir, ".env");

const parseEnvFile = (filePath) => {
  const raw = readFileSync(filePath, "utf8");

  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");
      accumulator[key] = value;
      return accumulator;
    }, {});
};

const env = parseEnvFile(envPath);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const requiredKeys = Object.entries(firebaseConfig).filter(([, value]) => !value);
if (requiredKeys.length > 0) {
  throw new Error(
    `Missing Firebase config values in .env: ${requiredKeys.map(([key]) => key).join(", ")}`,
  );
}

const args = process.argv.slice(2).reduce((accumulator, argument) => {
  const normalized = argument.replace(/^--/, "");
  const [key, value = ""] = normalized.split("=");
  accumulator[key] = value;
  return accumulator;
}, {});

const userId = args.userId || "";
const userName = args.userName || "GuideFlow Fan";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const now = Date.now();

const zones = [
  {
    id: "z1",
    name: "Gate Alpha",
    type: "gate",
    capacity: 5000,
    currentCount: 2100,
    waitTime: 12,
    status: "open",
    coordinates: { x: 20, y: 30 },
    lastUpdated: now,
  },
  {
    id: "z2",
    name: "Gate Bravo",
    type: "gate",
    capacity: 3000,
    currentCount: 2800,
    waitTime: 35,
    status: "crowded",
    coordinates: { x: 80, y: 30 },
    lastUpdated: now,
  },
  {
    id: "z3",
    name: "Food North",
    type: "food",
    capacity: 1500,
    currentCount: 1350,
    waitTime: 45,
    status: "crowded",
    coordinates: { x: 50, y: 15 },
    lastUpdated: now,
  },
  {
    id: "z4",
    name: "Washrooms East",
    type: "washroom",
    capacity: 200,
    currentCount: 50,
    waitTime: 2,
    status: "open",
    coordinates: { x: 85, y: 50 },
    lastUpdated: now,
  },
  {
    id: "z5",
    name: "Washrooms West",
    type: "washroom",
    capacity: 200,
    currentCount: 150,
    waitTime: 8,
    status: "open",
    coordinates: { x: 15, y: 50 },
    lastUpdated: now,
  },
  {
    id: "z6",
    name: "Merch Plaza",
    type: "merch",
    capacity: 1000,
    currentCount: 200,
    waitTime: 5,
    status: "open",
    coordinates: { x: 50, y: 85 },
    lastUpdated: now,
  },
  {
    id: "z7",
    name: "VIP Deck",
    type: "viewing",
    capacity: 800,
    currentCount: 750,
    waitTime: 0,
    status: "open",
    coordinates: { x: 70, y: 15 },
    lastUpdated: now,
  },
  {
    id: "z8",
    name: "Parking A",
    type: "parking",
    capacity: 2000,
    currentCount: 1950,
    waitTime: 25,
    status: "limited",
    coordinates: { x: 10, y: 10 },
    lastUpdated: now,
  },
  {
    id: "z9",
    name: "Medical Center",
    type: "medical",
    capacity: 100,
    currentCount: 10,
    waitTime: 0,
    status: "open",
    coordinates: { x: 90, y: 10 },
    lastUpdated: now,
  },
  {
    id: "z10",
    name: "Exit South",
    type: "exit",
    capacity: 8000,
    currentCount: 0,
    waitTime: 0,
    status: "open",
    coordinates: { x: 50, y: 95 },
    lastUpdated: now,
  },
];

const event = {
  id: "e1",
  name: "Champion's League Final",
  startTime: now + 1000 * 60 * 45,
  rushHour: false,
  activeUsers: 42560,
  teams: {
    home: { name: "Lions", logo: "", winProb: 64 },
    away: { name: "Titans", logo: "", winProb: 36 },
  },
  weather: {
    temp: 18,
    condition: "Clear Sky",
  },
};

const notifications = [
  {
    id: "n1",
    title: "Gate B Alert",
    message:
      "Gate B is experiencing high traffic. Redirecting to Gate A for faster entry.",
    type: "alert",
    timestamp: now - 1000 * 60 * 5,
    read: false,
  },
  {
    id: "n2",
    title: "Merch Discount",
    message: "VIP Members get 20% off at the Merch Plaza for the next 30 mins!",
    type: "update",
    timestamp: now - 1000 * 60 * 15,
    read: true,
  },
];

const recommendations = [
  {
    id: "rec-nav-gate",
    title: "Better Entry Route",
    description: "Gate Alpha is much faster right now. Move there for quicker entry.",
    type: "navigation",
    priority: "medium",
    action: "navigate",
    actionLabel: "Show Route",
    targetZoneId: "z1",
    timestamp: now,
  },
  {
    id: "rec-food-window",
    title: "Snack Window Open",
    description: "Merch Plaza and Food North are both quieter than usual right now.",
    type: "opportunity",
    priority: "low",
    action: "navigate",
    actionLabel: "Open Map",
    targetZoneId: "z6",
    timestamp: now - 1000 * 60 * 3,
  },
];

const batch = writeBatch(db);

batch.set(doc(db, "events", event.id), event);

for (const zone of zones) {
  batch.set(doc(db, "venues", "v1", "zones", zone.id), zone);
}

if (userId) {
  batch.set(
    doc(db, "users", userId),
    {
      displayName: userName,
      email: "",
      provider: "seed-script",
      avatar: "",
      lastLogin: now,
    },
    { merge: true },
  );

  for (const notification of notifications) {
    batch.set(
      doc(db, "users", userId, "notifications", notification.id),
      notification,
    );
  }

  for (const recommendation of recommendations) {
    batch.set(
      doc(db, "users", userId, "recommendations", recommendation.id),
      recommendation,
    );
  }
}

await batch.commit();

console.log("Seed complete.");
console.log(`Project: ${firebaseConfig.projectId}`);
console.log(`Public data: events/e1 and venues/v1/zones seeded`);
if (userId) {
  console.log(`User data seeded for: ${userId}`);
} else {
  console.log("No userId supplied, so notifications/recommendations were skipped.");
}
