"use client";

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { callAssistantWithProgress, type AssistantMessage } from "../lib/assistantClientWithProgress";
import { useToolProgress } from "./useToolProgress";

export function useAssistantWithProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const { user } = useUser();

  const {
    steps,
    currentStep,
    addStep,
    startStep,
    completeStep,
    failStep,
    resetSteps,
    updateStepInput,
  } = useToolProgress();

  // Generate unique IDs on mount
  useEffect(() => {
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
      resetSteps();

      try {
        const payload =
          typeof input === "string"
            ? { prompt: input, userId, threadId }
            : { messages: input, userId, threadId };

        // Set up progress tracking
        const progressCallback = {
          onToolStart: (toolId: string, toolName: string, toolInput: Record<string, unknown>) => {
            const stepId = addStep({
              id: toolId,
              name: toolName,
              description: getToolDescription(toolId),
              input: toolInput
            });
            startStep(stepId);
          },
          onToolComplete: (toolId: string, output: unknown) => {
            completeStep(toolId, output);
          },
          onToolError: (toolId: string, errorMsg: string) => {
            failStep(toolId, errorMsg);
          },
          onThinking: (message: string) => {
            // Could add thinking steps here if needed
            console.log("AI thinking:", message);
          }
        };

        const result = await callAssistantWithProgress(payload, progressCallback);
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
    [userId, threadId, addStep, startStep, completeStep, failStep, resetSteps],
  );

  const startNewThread = useCallback(() => {
    const newThreadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("current-thread-id", newThreadId);
    setThreadId(newThreadId);
    setError(null);
    setResponse(null);
    resetSteps();
  }, [resetSteps]);

  const reset = useCallback(() => {
    setError(null);
    setResponse(null);
    resetSteps();
  }, [resetSteps]);

  return {
    sendMessage,
    startNewThread,
    loading,
    error,
    response,
    reset,
    userId,
    threadId,
    // Tool progress
    toolSteps: steps,
    currentStep,
  };
}

function getToolDescription(toolId: string): string {
  const descriptions: Record<string, string> = {
    "search-doma-names": "Searching for tokenized domain names",
    "get-doma-name-details": "Fetching detailed domain information",
    "get-doma-listings": "Looking up marketplace listings",
    "get-doma-offers": "Checking domain offers",
    "get-doma-name-activities": "Retrieving domain activity history",
    "get-doma-name-statistics": "Calculating domain statistics",
    "analyze-query": "Understanding your request",
  };
  return descriptions[toolId] || "Processing request";
}
