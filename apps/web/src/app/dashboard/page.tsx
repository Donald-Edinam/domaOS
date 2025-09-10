"use client";

import { useState, useEffect, useRef } from "react";
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
import { Message, MessageAvatar } from "@/components/ui/message";
import { Loader } from "@/components/ui/loader";
import { ResponseStream } from "@/components/ui/response-stream";
import { Button } from "@/components/ui/button";
import { ArrowUp, Bot, Heart, Brain } from "lucide-react";
import { useAssistant } from "../../hooks/useAssistant";
import { DomainAnalysis } from "@/components/domain-analysis";

type MessageType = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

export default function Dashboard() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [domainAnalysisResults, setDomainAnalysisResults] = useState<any[]>([]);
  const [isAnalyzingDomains, setIsAnalyzingDomains] = useState(false);
  const [showDomainAnalysis, setShowDomainAnalysis] = useState(false);
  const { sendMessage, loading, error } = useAssistant();

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // Scroll when messages change or loading state changes

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

  const handleDomainAnalysis = async () => {
    // Extract potential domains from the input or use example domains
    const domains = input.trim()
      ? extractDomainsFromText(input)
      : [
          "techstartup.com",
          "ai-platform.io",
          "cryptoexchange.net",
          "webdev123.org",
        ];

    if (domains.length === 0) {
      return;
    }

    setIsAnalyzingDomains(true);
    setShowDomainAnalysis(true);

    try {
      const response = await fetch("/api/analyze-domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domains }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setDomainAnalysisResults(result.analysis);
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Domain analysis error:", err);
    } finally {
      setIsAnalyzingDomains(false);
    }
  };

  const extractDomainsFromText = (text: string): string[] => {
    const domainRegex =
      /[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.([a-zA-Z]{2,})/g;
    const matches = text.match(domainRegex);
    return matches ? [...new Set(matches)] : [];
  };

  const suggestions = [
    "Analyze domain trends",
    "Search domains",
    "Check statistics",
    "View listings",
    "Get insights",
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
      {/* Header matching sidebar */}
      <header
        className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 sticky top-0 z-40"
        style={{ backgroundColor: "#F4F4F5" }}
      >
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 text-cyan-600 hover:text-cyan-700 transition-colors duration-200" />
          <h1 className="text-xl font-bold text-cyan-600 ml-2">Doma Agent</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        {messages.length === 0 ? (
          /* Modern Landing Page Design */
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gray-900">
            {/* Gradient overlay starting from middle */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, transparent 40%, #1e3a8a 60%, #0891b2 80%, #06b6d4 100%)",
              }}
            ></div>

            {/* Glowing orb background effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-96 h-96 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, #06b6d4 0%, #0891b2 30%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center mb-12 max-w-4xl">
              {/* Main ORB Logo */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div
                    className="h-32 w-32 rounded-full overflow-hidden shadow-2xl border-2 border-cyan-300/30"
                    style={{
                      boxShadow:
                        "0 0 60px rgba(6, 182, 212, 0.4), 0 0 120px rgba(6, 182, 212, 0.2)",
                    }}
                  >
                    <img
                      src="/orbf.png"
                      alt="ORB"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Glowing ring animation */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-cyan-300/50 animate-pulse"
                    style={{
                      boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)",
                    }}
                  ></div>
                </div>
              </div>

              {/* Headlines */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                Chat with DomaOs
                <Heart className="inline-block w-8 h-8 ml-3 text-cyan-300 animate-pulse" />
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                AI-powered domain intelligence at your fingertips
              </p>

              {/* Futuristic suggestion chips */}
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-6 py-3 bg-gray-800/60 hover:bg-gray-700/80 text-cyan-300 rounded-full border border-cyan-300/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-300/20 backdrop-blur-sm"
                  >
                    {suggestion}
                  </button>
                ))}
                {/* Domain Analysis Button */}
                <button
                  onClick={handleDomainAnalysis}
                  disabled={isAnalyzingDomains}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full border border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/30 backdrop-blur-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain
                    className={`h-4 w-4 ${isAnalyzingDomains ? "animate-pulse" : ""}`}
                  />
                  {isAnalyzingDomains ? "Analyzing..." : "Analyze Domains"}
                </button>
              </div>
            </div>

            {/* Restored PromptInput */}
            <div className="relative z-10 w-full max-w-4xl">
              <div
                className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/30 transition-all duration-200"
                style={{
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.1)",
                }}
              >
                <PromptInput
                  value={input}
                  onValueChange={setInput}
                  onSubmit={handleSubmit}
                  isLoading={loading}
                >
                  <PromptInputTextarea
                    placeholder="Ask me anything about domains..."
                    className="min-h-[60px] text-lg text-white placeholder-gray-400 bg-transparent border-0"
                  />
                  <PromptInputActions className="justify-end pt-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !input.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white h-12 w-12 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 border-2 border-cyan-800"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </PromptInputActions>
                </PromptInput>
              </div>
            </div>

            {/* Domain Analysis Results */}
            {showDomainAnalysis && (
              <div className="relative z-10 w-full max-w-6xl mt-8">
                <DomainAnalysis
                  results={domainAnalysisResults}
                  isAnalyzing={isAnalyzingDomains}
                  onClose={() => setShowDomainAnalysis(false)}
                />
              </div>
            )}
          </div>
        ) : (
          /* Chat Messages View with Dark Theme */
          <div className="flex-1 flex flex-col bg-gray-900 relative">
            {/* Gradient overlay starting from middle */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, transparent 40%, #1e3a8a 60%, #0891b2 80%, #06b6d4 100%)",
              }}
            ></div>
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
                        src="/orbf.png"
                        alt="ORB Assistant"
                        fallback="ORB"
                        className="ring-2 ring-cyan-300/30"
                      />
                    )}

                    <div
                      className={`max-w-[85%] rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal ${
                        message.role === "user"
                          ? "bg-cyan-500 text-black"
                          : "bg-gray-800/80 text-white border border-gray-700/50 backdrop-blur-sm"
                      } shadow-lg`}
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
                    </div>

                    {message.role === "user" && (
                      <MessageAvatar
                        src={userAvatar}
                        alt={userName}
                        fallback={userInitials}
                        className="ring-2 ring-cyan-300/30"
                      />
                    )}
                  </Message>
                ))}

                {loading && (
                  <Message className="justify-start">
                    <MessageAvatar
                      src="/orbf.png"
                      alt="ORB Assistant"
                      fallback="ORB"
                      className="ring-2 ring-cyan-300/30"
                    />
                    <div className="rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal bg-gray-800/80 text-white border border-gray-700/50 backdrop-blur-sm">
                      <Loader variant="typing" />
                    </div>
                  </Message>
                )}

                {error && (
                  <Message className="justify-start">
                    <MessageAvatar
                      src="/orbf.png"
                      alt="ORB Assistant"
                      fallback="!"
                      className="ring-2 ring-red-300/30"
                    />
                    <div className="rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal bg-red-900/80 text-red-100 border border-red-700/50 backdrop-blur-sm">
                      Error: {error}
                    </div>
                  </Message>
                )}
                {/* Auto-scroll target */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input for Messages View - Restored PromptInput */}
            <div
              className="p-6 border-t border-gray-700/30"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, #0f172a 100%)",
              }}
            >
              <div className="max-w-4xl mx-auto">
                <div
                  className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/30 transition-all duration-200"
                  style={{
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <PromptInput
                    value={input}
                    onValueChange={setInput}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                  >
                    <PromptInputTextarea
                      placeholder="Continue the conversation..."
                      className="min-h-[50px] text-white placeholder-gray-400 bg-transparent border-0"
                    />
                    <PromptInputActions className="justify-end pt-2">
                      <Button
                        onClick={handleSubmit}
                        disabled={loading || !input.trim()}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white h-10 w-10 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 border-2 border-cyan-800"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </PromptInputActions>
                  </PromptInput>
                </div>
              </div>

              {/* Domain Analysis in Chat View */}
              {showDomainAnalysis && (
                <div className="max-w-4xl mx-auto mt-6">
                  <DomainAnalysis
                    results={domainAnalysisResults}
                    isAnalyzing={isAnalyzingDomains}
                    onClose={() => setShowDomainAnalysis(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
