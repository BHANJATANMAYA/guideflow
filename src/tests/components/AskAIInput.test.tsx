import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { AskAIInput } from '../../components/Assistant/AskAIInput';
import * as aiService from '../../services/aiService';

// Mock AI Service completely
vi.mock('../../services/aiService', () => ({
  sendMessageToGemini: vi.fn(),
  resetChatSession: vi.fn(),
}));

// Mock scrollIntoView which is missing in JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('AskAIInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input field correctly', () => {
    render(<AskAIInput />);
    expect(screen.getByPlaceholderText(/Ask GuideFlow anything.../i)).toBeInTheDocument();
  });

  it('allows user to type a message and tracks input state', () => {
    render(<AskAIInput />);
    const input = screen.getByPlaceholderText(/Ask GuideFlow anything.../i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Where is the bathroom?' } });
    expect(input.value).toBe('Where is the bathroom?');
  });

  it('blocks sending a message if input is empty', () => {
    const mockSend = aiService.sendMessageToGemini as Mock;
    render(<AskAIInput />);
    const button = screen.getByLabelText('Send message');
    
    fireEvent.click(button);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
