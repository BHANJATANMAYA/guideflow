import type { DataService } from "./dataService";
import { MockDataService } from "./mockDataService";
import { FirebaseService } from "./firebaseService";

// We use Vite's import.meta.env for environment variable access
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";

let serviceInstance: DataService | null = null;

export const getDataService = (): DataService => {
  if (!serviceInstance) {
    if (useMockData) {
      console.log("Initialize Mock Data Service");
      serviceInstance = new MockDataService();
    } else {
      console.log("Initialize Firebase Service");
      serviceInstance = new FirebaseService();
    }
  }
  return serviceInstance;
};
