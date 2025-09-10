"use client";

import { useState, useCallback, useEffect } from "react";
import { callAssistant, type AssistantMessage } from "../lib/assistantClient";

export function useAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");

  // Generate unique IDs on mount
  useEffect(() => {
    // Generate or retrieve user ID (could be from auth context in real app)
    const storedUserId = localStorage.getItem("assistant-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("assistant-user-id", newUserId);
      setUserId(newUserId);
    }

    // Generate thread ID for this session
    setThreadId(`thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const sendMessage = useCallback(async (
    input: string | AssistantMessage[]
  ) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload = typeof input === "string"
        ? { prompt: input, userId, threadId }
        : { messages: input, userId, threadId };
      
      const result = await callAssistant(payload);
      setResponse(result.text);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to call assistant";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, threadId]);

  const reset = useCallback(() => {
    setError(null);
    setResponse(null);
  }, []);

  return {
    sendMessage,
    loading,
    error,
    response,
    reset,
  };
}