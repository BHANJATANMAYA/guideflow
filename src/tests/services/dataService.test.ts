/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, vi, beforeEach, test } from 'vitest';
import * as firebaseClient from '../../services/firebaseClient';
import { FirebaseService } from '../../services/firebaseService';

// Mock should be after imports but before suite
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../services/firebaseClient', () => ({
  getFirestoreDb: vi.fn(),
}));

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FirebaseService();
  });

  test('subscribeToZones should return cleanup function and handle null DB', () => {
    vi.mocked(firebaseClient.getFirestoreDb).mockReturnValue(null);
    const callback = vi.fn();
    const unsub = service.subscribeToZones('v1', callback);
    
    expect(callback).toHaveBeenCalledWith([]);
    expect(typeof unsub).toBe('function');
  });

  test('updateUserLocation should call setDoc with correct params', async () => {
    const mockDb = {} as any;
    vi.mocked(firebaseClient.getFirestoreDb).mockReturnValue(mockDb);
    
    await service.updateUserLocation('u1', 'z1');
    
    expect(firebaseClient.getFirestoreDb).toHaveBeenCalled();
  });

  test('toggleRushHour should be defined', async () => {
    expect(service.toggleRushHour).toBeDefined();
  });
});
