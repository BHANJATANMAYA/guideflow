import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNav } from '../../components/Layout/BottomNav';
import React from 'react';

const mockSetActiveTab = vi.fn();
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    activeTab: 'dashboard',
    setActiveTab: mockSetActiveTab
  }))
}));

describe('BottomNav Component', () => {
  it('renders navigation tabs with correct labels', () => {
    render(<BottomNav />);
    
    expect(screen.getByText(/Home/i)).toBeDefined();
    expect(screen.getByText(/Map/i)).toBeDefined();
    expect(screen.getByText(/AI/i)).toBeDefined();
    expect(screen.getByText(/User/i)).toBeDefined();
  });

  it('triggers setActiveTab on click', () => {
    render(<BottomNav />);
    const mapTab = screen.getByText(/Map/i);
    fireEvent.click(mapTab);
    expect(mockSetActiveTab).toHaveBeenCalledWith('map');
  });
});
