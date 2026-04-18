import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { sendMessageToGemini, resetChatSession } from '../../services/aiService';
import { getGenerativeModel } from 'firebase/ai';

// Mock Firebase AI
vi.mock('firebase/ai', () => ({
  getAI: vi.fn(),
  GoogleAIBackend: vi.fn(),
  getGenerativeModel: vi.fn(),
}));

// Mock Firebase Client Setup
vi.mock('../../services/firebaseClient', () => ({
  getFirebaseApp: vi.fn().mockReturnValue({}),
}));

describe('aiService', () => {
  let mockGenModel: { startChat: Mock };
  let mockChatSession: { sendMessageStream: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    resetChatSession();

    mockChatSession = {
      sendMessageStream: vi.fn(),
    };

    mockGenModel = {
      startChat: vi.fn().mockReturnValue(mockChatSession),
    };

    (getGenerativeModel as Mock).mockReturnValue(mockGenModel);
  });

  describe('sendMessageToGemini', () => {
    it('initializes a chat session if none exists and streams chunks', async () => {
      // Mock the stream result manually
      const mockStreamResult = {
        stream: [
          { text: () => 'Hello ' },
          { text: () => 'World!' }
        ]
      };
      
      mockChatSession.sendMessageStream.mockResolvedValue(mockStreamResult);

      const onChunk = vi.fn();

      await sendMessageToGemini('Say hello', onChunk);

      expect(getGenerativeModel).toHaveBeenCalled();
      expect(mockGenModel.startChat).toHaveBeenCalled();
      expect(mockChatSession.sendMessageStream).toHaveBeenCalledWith('Say hello');
      
      // Because we mocked a stream array, it should iterate and hit onChunk twice
      expect(onChunk).toHaveBeenCalledWith('Hello ');
      expect(onChunk).toHaveBeenCalledWith('World!');
    });
  });

  describe('resetChatSession', () => {
    it('should allow a clean restart of chat', async () => {
      mockChatSession.sendMessageStream.mockResolvedValue({ stream: [] });
      
      await sendMessageToGemini('Msg 1', vi.fn());
      expect(mockGenModel.startChat).toHaveBeenCalledTimes(1);

      resetChatSession();

      await sendMessageToGemini('Msg 2', vi.fn());
      // Since it was reset, startChat should be called a SECOND time
      expect(mockGenModel.startChat).toHaveBeenCalledTimes(2);
    });
  });
});
