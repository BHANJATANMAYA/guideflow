import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../components/Layout/Header';

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    notifications: []
  }))
}));

describe('Header Component', () => {
  it('renders branding', () => {
    render(<Header />);
    expect(screen.getAllByText(/GuideFlow/i).length).toBeGreaterThan(0);
  });
});
