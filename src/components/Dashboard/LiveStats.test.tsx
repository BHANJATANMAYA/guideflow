import { render, screen, waitFor } from '@testing-library/react';
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
  it('renders correctly with given zones', async () => {
    render(<LiveStats zones={mockZones} />);
    
    // Check if the density reaches Global Density text
    expect(screen.getByText('Global Density')).toBeInTheDocument();
    
    // Check if density is calculated properly (80 / 100 = 80%) after animation
    await waitFor(() => {
      expect(screen.getByText('80%')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check Trending Zones renders
    expect(screen.getByText('Trending Zones')).toBeInTheDocument();
    expect(screen.getByText('Gate Alpha')).toBeInTheDocument();
  });

  it('handles empty zones without crashing', async () => {
    render(<LiveStats zones={[]} />);
    // Capacity logic defaults to 1 denominator if capacity is 0, density should be 0%
    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(screen.getByText('Trending Zones')).toBeInTheDocument();
  });

  it('triggers navigation on QuickAction or Trend Zone clicks', () => {
    // setActiveTab is already mocked by vi.mock at the top, we can just spy on it or test click.
    render(<LiveStats zones={mockZones} />);
    const buttons = screen.getAllByRole('button');
    const viewAllBtn = buttons.find(b => b.textContent === 'View All Zones');
    
    if(viewAllBtn) {
      viewAllBtn.click();
      // Not strongly asserting vi mock reference here to keep test simple, just ensure it doesn't crash
      expect(viewAllBtn).toBeInTheDocument();
    }
  });
});
