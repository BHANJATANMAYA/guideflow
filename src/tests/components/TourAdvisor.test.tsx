import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TourAdvisor } from '../../components/Assistant/TourAdvisor';
import React from 'react';

// Explicitly mock aiService first
vi.mock('../../services/aiService', () => ({
  generateTourPlan: vi.fn()
}));

// Mock app store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    event: { name: 'Test Event', rushHour: false },
    zones: [{ name: 'A1', waitTime: 5, status: 'Clear' }]
  }))
}));

import * as aiService from '../../services/aiService';

describe('TourAdvisor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TourAdvisor />);
    expect(screen.getByText(/Plan My Night/i)).toBeDefined();
  });

  it('handles result correctly', async () => {
    vi.mocked(aiService.generateTourPlan).mockResolvedValue({
      recommendation: 'Test Rec',
      status: 'success'
    });

    render(<TourAdvisor />);
    fireEvent.click(screen.getByText(/Plan My Night/i));
    fireEvent.click(screen.getByText(/Scan Live Conditions/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Test Rec/i)).toBeDefined();
    });
  });
});
