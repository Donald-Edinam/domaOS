"use client";

import { useState } from "react";
import { useAssistant } from "../hooks/useAssistant";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

export function AssistantChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const { sendMessage, loading, error } = useAssistant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const result = await sendMessage(input);
      setMessages(prev => [...prev, { role: "assistant", content: result.text }]);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="h-96 overflow-y-auto border rounded p-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-muted-foreground text-center space-y-2">
              <p>Ask me anything about domains on Doma Protocol...</p>
              <div className="text-xs space-y-1 mt-4">
                <p className="font-semibold">Try asking:</p>
                <p>• "Search for .com domains"</p>
                <p>• "Show me details about example.com"</p>
                <p>• "What domains are listed for sale?"</p>
                <p>• "Show recent activities for a domain"</p>
                <p>• "Get market statistics for a token"</p>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                msg.role === "user" 
                  ? "bg-blue-50 dark:bg-blue-950 ml-auto max-w-[80%]" 
                  : "bg-gray-50 dark:bg-gray-900 mr-auto max-w-[80%]"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {msg.role === "user" ? "You" : "Assistant"}
              </p>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded mr-auto max-w-[80%]">
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-950 p-2 rounded">
              <p className="text-sm text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </Card>
  );
}