"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Loader } from "@/components/ui/loader";
import { ResponseStream } from "@/components/ui/response-stream";
import { Button } from "@/components/ui/button";
import { ArrowUp, Bot } from "lucide-react";
import { useAssistant } from "../../hooks/useAssistant";

type MessageType = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

export default function Dashboard() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { sendMessage, loading, error } = useAssistant();

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage: MessageType = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const result = await sendMessage(currentInput);
      const assistantMessage: MessageType = {
        role: "assistant",
        content: result.text,
        id: (Date.now() + 1).toString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  const suggestions = [
    "Search for domain names",
    "Check domain statistics",
    "View marketplace listings",
    "Analyze domain trends",
    "Get domain details",
  ];

  const userName = user?.firstName || user?.fullName || "User";
  const userAvatar = user?.imageUrl || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-gray-50gray-50 sticky top-0 z-40">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-bold text-black ml-2">Doma Agent</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <Avatar className="h-20 w-20 border-2 border-gray-200">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-black text-white text-xl font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-4xl font-bold text-black mb-4">
                Welcome, {userName}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Ask me anything about domain analysis, trading insights, or
                market trends.
              </p>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {suggestions.map((suggestion, index) => (
                  <PromptSuggestion
                    key={index}
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </PromptSuggestion>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="w-full max-w-4xl">
              <PromptInput
                value={input}
                onValueChange={setInput}
                onSubmit={handleSubmit}
                isLoading={loading}
                className="border border-gray-200 rounded-2xl bg-white shadow-lg"
              >
                <PromptInputTextarea
                  placeholder="Type your message here..."
                  className="min-h-[60px] text-base text-black border border-gray-200 rounded-lg"
                />
                <PromptInputActions className="justify-end pt-2">
                  <Button
                    size="sm"
                    className="h-10 w-10 rounded-full bg-black hover:bg-gray-800"
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                  >
                    <ArrowUp className="h-4 w-4 text-white" />
                  </Button>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        ) : (
          /* Chat Messages View */
          <div className="flex-1 flex flex-col bg-white">
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    className={
                      message.role === "user" ? "justify-end" : "justify-start"
                    }
                  >
                    {message.role === "assistant" && (
                      <MessageAvatar
                        src="/ai-avatar.png"
                        alt="AI Assistant"
                        fallback="AI"
                      />
                    )}

                    <MessageContent
                      className={`max-w-[85%] ${
                        message.role === "user"
                          ? "bg-black text-white"
                          : "bg-gray-50 text-black"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <ResponseStream
                          textStream={message.content}
                          mode="typewriter"
                          speed={30}
                        />
                      ) : (
                        message.content
                      )}
                    </MessageContent>

                    {message.role === "user" && (
                      <MessageAvatar
                        src={userAvatar}
                        alt={userName}
                        fallback={userInitials}
                      />
                    )}
                  </Message>
                ))}

                {loading && (
                  <Message className="justify-start">
                    <MessageAvatar
                      src="/ai-avatar.png"
                      alt="AI Assistant"
                      fallback="AI"
                    />
                    <MessageContent className="bg-gray-50">
                      <Loader variant="typing" />
                    </MessageContent>
                  </Message>
                )}

                {error && (
                  <Message className="justify-start">
                    <MessageAvatar
                      src="/error-avatar.png"
                      alt="Error"
                      fallback="!"
                    />
                    <MessageContent className="bg-red-50 text-red-600">
                      Error: {error}
                    </MessageContent>
                  </Message>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input for Messages View */}
            <div className="bg-white p-6">
              <div className="max-w-4xl mx-auto">
                <PromptInput
                  value={input}
                  onValueChange={setInput}
                  onSubmit={handleSubmit}
                  isLoading={loading}
                  className="border border-gray-200 rounded-2xl bg-white"
                >
                  <PromptInputTextarea
                    placeholder="Continue the conversation..."
                    className="min-h-[50px] text-black border border-gray-200 rounded-lg"
                  />
                  <PromptInputActions className="justify-end pt-2">
                    <Button
                      size="sm"
                      className="h-10 w-10 rounded-full bg-black hover:bg-gray-800"
                      onClick={handleSubmit}
                      disabled={loading || !input.trim()}
                    >
                      <ArrowUp className="h-4 w-4 text-white" />
                    </Button>
                  </PromptInputActions>
                </PromptInput>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
