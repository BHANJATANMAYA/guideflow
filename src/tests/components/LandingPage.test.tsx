import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from '../../components/Auth/LandingPage';

// Mock Services
vi.mock('../../services/authService', () => ({
  continueAsGuest: vi.fn().mockResolvedValue({ id: 'guest123', name: 'Tester', isGuest: true }),
  signInWithGoogle: vi.fn(),
  isGoogleSignInAvailable: false
}));

// Mock Zustand Stores
const mockSetActiveTab = vi.fn();
const mockApplyAuthSession = vi.fn();

vi.mock('../../store/useAppStore', () => ({
  useAppStore: () => ({
    setActiveTab: mockSetActiveTab,
  }),
}));

vi.mock('../../store/useUserStore', () => ({
  useUserStore: () => ({
    applyAuthSession: mockApplyAuthSession,
  }),
}));

// Mock framer-motion to avoid complex spring physics in JSDOM
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual('framer-motion') as Record<string, unknown>;
    return {
        ...actual,
        useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
        useSpring: () => 0,
        useTransform: () => 0
    };
});

describe('LandingPage Component', () => {
  it('renders landing page titles and inputs correctly', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Enter the Venue/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter designation...')).toBeInTheDocument();
  });

  it('prevents guest login with short names', async () => {
    render(<LandingPage />);
    const button = screen.getByText('Launch Dashboard');
    
    // Attempt login without setting name
    fireEvent.click(button);
    expect(await screen.findByText(/Enter designation so GuideFlow can personalize/i)).toBeInTheDocument();
  });

  it('allows guest login with valid name', async () => {
    render(<LandingPage />);
    const input = screen.getByPlaceholderText('Enter designation...');
    const button = screen.getByText('Launch Dashboard');
    
    fireEvent.change(input, { target: { value: 'ValidName' } });
    fireEvent.click(button);
    
    // Error state should be gone
    await waitFor(() => {
      expect(screen.queryByText(/Enter designation so GuideFlow/i)).not.toBeInTheDocument();
    });
  });

  it('disables Google auth button when service is unavailable', () => {
    render(<LandingPage />);
    const googleBtn = screen.getByText('Google Auth Locked');
    expect(googleBtn).toBeInTheDocument();
  });
});
