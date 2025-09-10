"use client";

import { useState, useEffect } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: number;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "doma-chat-history";

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      } catch (error) {
        console.error("Failed to parse chat history:", error);
      }
    }
  }, []);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = (): string => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const addMessageToSession = (sessionId: string, message: ChatMessage) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedSession = {
            ...session,
            messages: [...session.messages, message],
            updatedAt: Date.now(),
            // Update title based on first user message
            title: session.messages.length === 0 && message.role === "user"
              ? message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
              : session.title,
          };
          return updatedSession;
        }
        return session;
      })
    );
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  const clearAllHistory = () => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getCurrentSession = (): ChatSession | null => {
    if (!currentSessionId) return null;
    return sessions.find((session) => session.id === currentSessionId) || null;
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, title, updatedAt: Date.now() }
          : session
      )
    );
  };

  return {
    sessions,
    currentSessionId,
    currentSession: getCurrentSession(),
    createNewSession,
    addMessageToSession,
    switchToSession,
    deleteSession,
    clearAllHistory,
    updateSessionTitle,
  };
}
