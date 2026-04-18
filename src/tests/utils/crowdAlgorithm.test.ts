import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../../utils/crowdAlgorithm';
import type { Zone } from '../../types';

describe('crowdAlgorithm - generateRecommendations', () => {
  it('should generate urgent priority when congestion is high (> 80%)', () => {
    const zones: Zone[] = [
      {
        id: 'z1',
        name: 'Gate Alpha',
        type: 'gate',
        capacity: 100,
        currentCount: 90, // 90%
        waitTime: 20,
        status: 'crowded',
        coordinates: { x: 0, y: 0 },
        lastUpdated: Date.now(),
      },
    ];

    const recs = generateRecommendations(zones, Date.now(), Date.now() + 3600000);
    expect(recs).toHaveLength(1);
    expect(recs[0]?.type).toBe('urgent');
    expect(recs[0]?.priority).toBe('high');
  });

  it('should generate an opportunity recommendation when food zone is empty', () => {
    const zones: Zone[] = [
      {
        id: 'z2',
        name: 'Food North',
        type: 'food',
        capacity: 100,
        currentCount: 10, // 10%
        waitTime: 2,
        status: 'open',
        coordinates: { x: 0, y: 0 },
        lastUpdated: Date.now(),
      },
    ];

    const recs = generateRecommendations(zones, Date.now(), Date.now() + 3600000);
    expect(recs).toHaveLength(1);
    expect(recs[0]?.type).toBe('opportunity');
  });

  it('should handle empty input zones gracefully', () => {
    const recs = generateRecommendations([], Date.now(), Date.now() + 3600000);
    expect(recs).toHaveLength(0);
  });
});
