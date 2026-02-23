import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 11);
const generateSessionId = () => `session_${Date.now()}_${generateId()}`;

// Fix: use window.location to build API base instead of import.meta.env
// which requires vite's env type declarations
const API_BASE = '';

export function useChat(apiKey: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    sessionId: generateSessionId(),
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          session_id: state.sessionId,
          openrouter_key: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json() as { detail?: string };
        throw new Error(err.detail ?? 'Failed to get response');
      }

      const data = await response.json() as { response: string };

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the backend is running on port 8000 and your OpenRouter API key is set.`,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  }, [state.isLoading, state.sessionId, apiKey]);

  const clearChat = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/chat/${state.sessionId}`, { method: 'DELETE' });
    } catch (_e) { /* ignore */ }

    setState({
      messages: [],
      isLoading: false,
      sessionId: generateSessionId(),
    });
  }, [state.sessionId]);

  return { ...state, sendMessage, clearChat };
}