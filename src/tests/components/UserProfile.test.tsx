import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../../components/Profile/UserProfile';
import React from 'react';

const mockSignOut = vi.fn();
const mockUpdatePreference = vi.fn();
vi.mock('../../store/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    user: { 
      name: 'John Doe', 
      email: 'john@example.com',
      avatar: 'https://avatar.url',
      vipLevel: 'Pro',
      fanPoints: 1000,
      missionsCompleted: 5,
      eventsAttended: 2
    },
    preferences: {
      notificationsEnabled: true,
      soundEffectsEnabled: true,
      vibrationEnabled: false,
      crowdAvoidanceMode: true,
      arDirectionsEnabled: false,
      highContrastMode: false,
      largeTextEnabled: false
    },
    updatePreference: mockUpdatePreference,
    signOut: mockSignOut
  }))
}));

describe('UserProfile Component', () => {
  it('renders user details', () => {
    render(<UserProfile />);
    expect(screen.getByText(/John Doe/i)).toBeDefined();
    expect(screen.getByText(/john@example\.com/i)).toBeDefined();
  });

  it('handles sign out', () => {
    render(<UserProfile />);
    const logoutBtn = screen.getByLabelText(/Sign Out/i);
    fireEvent.click(logoutBtn);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
