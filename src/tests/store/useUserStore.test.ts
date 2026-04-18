import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../../store/useUserStore';

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state manually
    useUserStore.getState().resetAuthSession();
  });

  it('should initialize with default guest user', () => {
    const state = useUserStore.getState();
    // In our implementation, default state has a hardcoded profile but isAuthenticated is false initially
    expect(state.isAuthenticated).toBe(false);
    expect(state.user.name).toBe('Alex Johnson');
  });

  it('should apply auth session correctly', () => {
    const mockSession = {
      uid: 'u123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://test.url',
      provider: 'google'
    } as const;
    
    useUserStore.getState().applyAuthSession(mockSession as any);
    
    const state = useUserStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.uid).toBe('u123');
    expect(state.user.name).toBe('Test User');
    expect(state.user.vipLevel).toBe('Pro');
  });

  it('should update preferences', () => {
    useUserStore.getState().updatePreference('notificationsEnabled', false);
    
    const state = useUserStore.getState();
    expect(state.preferences.notificationsEnabled).toBe(false);
  });
});
