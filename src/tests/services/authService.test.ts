import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../../services/authService';

// Mock Firebase dependencies
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, _callback) => {
    // We'll trigger this manually in tests
    return vi.fn(); // unsubscribe
  }),
  signInWithPopup: vi.fn(),
  signInAnonymously: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../../services/firebaseClient', () => ({
  getFirebaseApp: vi.fn().mockReturnValue({}),
  getFirebaseAuth: vi.fn().mockReturnValue({}),
  getFirestoreDb: vi.fn(),
  isFirebaseConfigured: true
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('subscribeToAuthSession should defined', () => {
    expect(authService.subscribeToAuthSession).toBeDefined();
  });
});
