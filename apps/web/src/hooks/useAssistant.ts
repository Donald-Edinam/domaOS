"use client";

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { callAssistant, type AssistantMessage } from "../lib/assistantClient";

export function useAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const { user } = useUser();

  // Generate unique IDs on mount
  useEffect(() => {
    // Use Clerk user ID if available, otherwise generate a unique user ID
    if (user?.id) {
      setUserId(user.id);
    } else {
      const storedUserId = localStorage.getItem("assistant-user-id");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("assistant-user-id", newUserId);
        setUserId(newUserId);
      }
    }

    // Generate thread ID for this session (this maintains conversation continuity)
    const storedThreadId = sessionStorage.getItem("current-thread-id");
    if (storedThreadId) {
      setThreadId(storedThreadId);
    } else {
      const newThreadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("current-thread-id", newThreadId);
      setThreadId(newThreadId);
    }
  }, [user]);

  const sendMessage = useCallback(
    async (input: string | AssistantMessage[]) => {
      if (!userId || !threadId) {
        throw new Error("User ID or Thread ID not initialized");
      }

      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        const payload =
          typeof input === "string"
            ? { prompt: input, userId, threadId }
            : { messages: input, userId, threadId };

        const result = await callAssistant(payload);
        setResponse(result.text);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to call assistant";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, threadId],
  );

  const startNewThread = useCallback(() => {
    const newThreadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("current-thread-id", newThreadId);
    setThreadId(newThreadId);
    setError(null);
    setResponse(null);
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResponse(null);
  }, []);

  return {
    sendMessage,
    startNewThread,
    loading,
    error,
    response,
    reset,
    userId,
    threadId,
  };
}
