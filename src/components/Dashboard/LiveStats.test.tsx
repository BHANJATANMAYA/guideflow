import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LiveStats } from './LiveStats';
import type { Zone } from '../../types';

// Mock the AppStore
vi.mock('../../store/useAppStore', () => ({
  useAppStore: () => ({
    setActiveTab: vi.fn(),
  }),
}));

const mockZones: Zone[] = [
  {
    id: 'z1',
    name: 'Gate Alpha',
    type: 'gate',
    capacity: 100,
    currentCount: 80,
    waitTime: 5,
    status: 'open',
    coordinates: { x: 0, y: 0 },
    lastUpdated: Date.now(),
  },
];

describe('LiveStats Component', () => {
  it('renders correctly with given zones', () => {
    render(<LiveStats zones={mockZones} />);
    
    // Check if the density reaches Global Density text
    expect(screen.getByText('Global Density')).toBeInTheDocument();
    
    // Check if density is calculated properly (80 / 100 = 80%)
    expect(screen.getByText('80%')).toBeInTheDocument();
    
    // Check Trending Zones renders
    expect(screen.getByText('Trending Zones')).toBeInTheDocument();
    expect(screen.getByText('Gate Alpha')).toBeInTheDocument();
  });
});
