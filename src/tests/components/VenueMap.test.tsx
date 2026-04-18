import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Zone } from '../../types';
import { VenueMap } from '../../components/Map/VenueMap';

const mockZones = [
  {
    id: 'z1',
    name: 'Gate Alpha',
    type: 'gate',
    capacity: 100,
    currentCount: 50,
    waitTime: 2,
    status: 'open',
    coordinates: { x: 50, y: 50 },
    lastUpdated: Date.now(),
  },
] as Zone[];

describe('VenueMap Component', () => {
  it('renders SVG map wrapper', () => {
    const { container } = render(<VenueMap zones={mockZones} />);
    // Testing DOM svg structures from the component directly
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('renders zone names according to props', () => {
    render(<VenueMap zones={mockZones} />);
    expect(screen.getAllByText('Gate Alpha')[0]).toBeInTheDocument();
  });

  it('handles empty zones prop smoothly without blowing up', () => {
    const { container } = render(<VenueMap zones={[]} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});
