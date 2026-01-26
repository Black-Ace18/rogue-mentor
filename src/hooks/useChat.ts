import { useState, useEffect, useCallback } from "react";
import { getGeminiResponse } from "@/lib/gemini";
import { 
  ChatMessage, 
  AppState, 
  loadState, 
  saveState, 
  generateId, 
  addXP 
} from "@/lib/storage";

export const useChat = () => {
  const [state, setState] = useState<AppState>(loadState);
  const [isLoading, setIsLoading] = useState(false);

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setIsLoading(true);

    try {
      const allMessages = [...state.messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await getGeminiResponse(allMessages);

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "model",
        content: response,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        xp: addXP(prev.xp, 5),
        missionsCompleted: prev.messages.length % 10 === 0 
          ? Math.min(prev.missionsCompleted + 1, prev.totalMissions)
          : prev.missionsCompleted,
      }));
    } catch (error) {
      console.error("Failed to get response:", error);
      
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "model",
        content: "⚠️ TRANSMISSION ERROR: Unable to process. Retry your query, Operator.",
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [state.messages, isLoading]);

  const clearHistory = useCallback(() => {
    setState({
      messages: [],
      xp: 0,
      missionsCompleted: 0,
      totalMissions: 10,
    });
  }, []);

  return {
    messages: state.messages,
    xp: state.xp,
    missionsCompleted: state.missionsCompleted,
    totalMissions: state.totalMissions,
    isLoading,
    sendMessage,
    clearHistory,
  };
};
