import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../../components/Profile/UserProfile';
import React from 'react';

const mockSignOutSession = vi.fn();
const mockResetAuthSession = vi.fn();
const mockUpdatePreference = vi.fn();

vi.mock('../../services/authService', () => ({
  signOutSession: () => mockSignOutSession()
}));

vi.mock('../../store/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    authProvider: 'google',
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
    resetAuthSession: mockResetAuthSession
  }))
}));

describe('UserProfile Component', () => {
  it('renders user details', () => {
    render(<UserProfile />);
    expect(screen.getByText(/John Doe/i)).toBeDefined();
    expect(screen.getByText(/john@example\.com/i)).toBeDefined();
  });

  it('handles sign out', async () => {
    render(<UserProfile />);
    const logoutBtn = screen.getByLabelText(/Sign Out/i);
    fireEvent.click(logoutBtn);
    
    await waitFor(() => {
      expect(mockSignOutSession).toHaveBeenCalled();
      expect(mockResetAuthSession).toHaveBeenCalled();
    });
  });
});
