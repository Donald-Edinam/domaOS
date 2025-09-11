"use client";

import { useState, useRef, memo } from "react";
import { useAssistant } from "../hooks/useAssistant";
import { Button } from "./ui/button";
import { ChatContainerContent, ChatContainerRoot } from "./ui/chat-container";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "./ui/message";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "./ui/prompt-input";
import { Tool } from "./ui/tool";
import type { ToolPart } from "./ui/tool";
import { useTextStream } from "./ui/response-stream";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  Copy,
  ThumbsDown,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { Markdown } from "./ui/markdown";

// Exact streaming component as you provided
function UseTextStreamExample({ content }: { content: string }) {
  const text = content;

  const { segments } = useTextStream({
    textStream: text,
    mode: "fade",
    speed: 100,
  });

  // For fade mode, we need to manually create the CSS and render the segments.
  const fadeStyle = `
    @keyframes fadeIn {
      from { opacity: 0; filter: blur(2px); }
      to { opacity: 1; filter: blur(0px); }
    }

    .custom-fade-segment {
      display: inline-block;
      opacity: 0;
      animation: fadeIn 1000ms ease-out forwards;
    }

    .custom-fade-segment-space {
      white-space: pre;
    }
  `;

  return (
    <div className="w-full min-w-full">
      <style>{fadeStyle}</style>

      <div className="min-h-[100px] rounded-md p-4 text-sm">
        <div className="relative">
          <div>
            {segments.map((segment, idx) => {
              const isWhitespace = /^\s+$/.test(segment.text);

              return (
                <span
                  key={`${segment.text}-${idx}`}
                  className={cn(
                    "custom-fade-segment",
                    isWhitespace && "custom-fade-segment-space",
                  )}
                  style={{
                    animationDelay: `${idx * 2}ms`,
                  }}
                >
                  {segment.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tool states component as you provided
function ToolStates({ toolParts }: { toolParts: ToolPart[] }) {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-2">
      {toolParts.map((toolPart, index) => (
        <Tool key={index} className="w-full max-w-md" toolPart={toolPart} />
      ))}
    </div>
  );
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolParts?: ToolPart[];
  isStreaming?: boolean;
}

const renderToolPart = (part: ToolPart, index: number): React.ReactNode => {
  return <Tool key={`${part.type}-${index}`} toolPart={part} />;
};

export const MessageComponent = memo(
  ({
    message,
    isLastMessage,
  }: {
    message: ChatMessage;
    isLastMessage: boolean;
  }) => {
    const isAssistant = message?.role === "assistant";

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end",
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0 space-y-2">
            <div className="w-full">
              {message?.toolParts?.map((part: ToolPart, index: number) =>
                renderToolPart(part, index),
              )}
            </div>
            <MessageContent
              markdown={false}
              className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0"
            >
              {message.isStreaming ? (
                <UseTextStreamExample content={message.content} />
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </MessageContent>

            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100",
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Upvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsUp />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Downvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsDown />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
              {message.content}
            </MessageContent>
            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    );
  },
);

MessageComponent.displayName = "MessageComponent";

const ErrorMessage = memo(({ error }: { error: string }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  </Message>
));

ErrorMessage.displayName = "ErrorMessage";

// Exact chat implementation as you provided
export function AssistantChat() {
  const [input, setInput] = useState("");
  const { sendMessage, loading, error } = useAssistant();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");

    // Add assistant message with tools
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      isStreaming: false,
      toolParts: [
        {
          type: "file_search",
          state: "input-streaming",
          input: {
            pattern: "*.tsx",
            directory: "/components",
          },
        },
      ],
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Simulate API call
    sendMessage(userInput)
      .then((result) => {
        // Update with streaming response and tool progression
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: result.text,
                  isStreaming: true,
                  toolParts: [
                    {
                      type: "api_call",
                      state: "input-available",
                      input: {
                        endpoint: "/api/users",
                        method: "GET",
                      },
                    },
                    {
                      type: "database_query",
                      state: "output-available",
                      input: {
                        table: "users",
                        limit: 10,
                      },
                      output: {
                        count: 42,
                        data: [
                          { id: 1, name: "John Doe" },
                          { id: 2, name: "Jane Smith" },
                        ],
                      },
                    },
                  ],
                }
              : msg,
          ),
        );

        // Stop streaming after delay
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, isStreaming: false }
                : msg,
            ),
          );
        }, 3000);
      })
      .catch(() => {
        // Show error tool state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: "Sorry, there was an error processing your request.",
                  toolParts: [
                    {
                      type: "email_send",
                      state: "output-error",
                      output: {
                        to: "user@example.com",
                        subject: "Welcome!",
                      },
                      errorText: "Failed to connect to SMTP server",
                    },
                  ],
                }
              : msg,
          ),
        );
      });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">
        <ChatContainerContent className="space-y-12 px-4 py-12">
          {messages.length === 0 && (
            <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
              <div className="text-foreground mb-2 font-medium">
                Try asking:
              </div>
              <ul className="list-inside list-disc space-y-1">
                <li>what's the current date?</li>
                <li>what time is it in Tokyo?</li>
                <li>give me the current time in Europe/Paris</li>
              </ul>
            </div>
          )}

          {messages?.map((message, index) => {
            const isLastMessage = index === messages.length - 1;

            return (
              <MessageComponent
                key={message.id}
                message={message}
                isLastMessage={isLastMessage}
              />
            );
          })}

          {error && <ErrorMessage error={error} />}
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <PromptInput
          isLoading={loading}
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 p-2">
              <div />
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  disabled={!input.trim() || loading}
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {!loading ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
