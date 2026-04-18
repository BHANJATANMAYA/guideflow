import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreferencesGrid } from '../../components/Profile/PreferencesGrid';

const mockUpdatePreference = vi.fn();
vi.mock('../../store/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    preferences: {
      notificationsEnabled: true,
      soundEffectsEnabled: true,
      vibrationEnabled: false,
      crowdAvoidanceMode: true,
      arDirectionsEnabled: false,
      highContrastMode: false,
      largeTextEnabled: false
    },
    updatePreference: mockUpdatePreference
  }))
}));

describe('PreferencesGrid Component', () => {
  it('renders all preference settings', () => {
    render(<PreferencesGrid />);
    expect(screen.getByText(/Live Notifications/i)).toBeDefined();
    expect(screen.getByText(/Crowd Avoidance/i)).toBeDefined();
    expect(screen.getByText(/AR Directions/i)).toBeDefined();
  });

  it('triggers updatePreference', () => {
    render(<PreferencesGrid />);
    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]);
    expect(mockUpdatePreference).toHaveBeenCalled();
  });
});
