import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../../components/Dashboard/HeroSection';
import type { VenueEvent } from '../../types';

// Simplified mock
vi.mock('../../store/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    user: { name: 'Test User' }
  }))
}));

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    setActiveTab: vi.fn()
  }))
}));

describe('HeroSection Component', () => {
  const mockEvent: VenueEvent = {
    id: 'e1',
    name: 'Champion Finals',
    startTime: Date.now() + 100000,
    activeUsers: 15000,
    rushHour: false,
    teams: {
      home: { name: 'Lions', logo: 'lions-logo', winProb: 60 },
      away: { name: 'Titans', logo: 'titans-logo', winProb: 40 }
    },
    weather: { temp: 22, condition: 'Sunny' }
  };

  it('renders event name and user name', () => {
    render(<HeroSection event={mockEvent} />);
    expect(screen.getByText(/Champion Finals/i)).toBeDefined();
    expect(screen.getByText(/Test User/i)).toBeDefined();
  });

  it('renders "Loading Event..." when event is null', () => {
    render(<HeroSection event={null} />);
    expect(screen.getByText(/Loading Event\.\.\./i)).toBeDefined();
  });
});
