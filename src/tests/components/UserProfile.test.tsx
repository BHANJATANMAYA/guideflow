import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../../components/Profile/UserProfile';
import React from 'react';

const mockSignOut = vi.fn();
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
    const logoutBtn = screen.getByText(/Sign Out/i);
    fireEvent.click(logoutBtn);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
