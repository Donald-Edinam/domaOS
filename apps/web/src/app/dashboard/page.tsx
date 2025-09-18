"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Message, MessageAvatar } from "@/components/ui/message";
import { Loader } from "@/components/ui/loader";
import { ResponseStream } from "@/components/ui/response-stream";
import { Button } from "@/components/ui/button";
import { ArrowUp, Brain } from "lucide-react";
import { useAssistant } from "../../hooks/useAssistant";
import { DomainAnalysis } from "@/components/domain-analysis";
import { ModeToggle } from "@/components/mode-toggle";

type MessageType = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

const MAX_CHARS = 20000;

export default function Dashboard() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [domainAnalysisResults, setDomainAnalysisResults] = useState<any[]>([]);
  const [isAnalyzingDomains, setIsAnalyzingDomains] = useState(false);
  const [showDomainAnalysis, setShowDomainAnalysis] = useState(false);
  const [source, setSource] = useState<string>(""); // "Select source" dropdown
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
    const domains = input.trim()
      ? extractDomainsFromText(input)
      : ["techstartup.com", "ai-platform.io", "cryptoexchange.net", "webdev123.org"];

    if (domains.length === 0) return;

    setIsAnalyzingDomains(true);
    setShowDomainAnalysis(true);

    try {
      const response = await fetch("/api/analyze-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains }),
      });

      if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);

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
    const domainRegex = /[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.([a-zA-Z]{2,})/g;
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
      {/* Header */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 sticky top-0 z-40">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" />
              <div className="flex items-center gap-2">
                <img src="/orbf.png" alt="ORB" className="h-6 w-6 rounded-sm" />
                <h1 className="text-base font-semibold text-gray-900 dark:text-white">Doma Agent</h1>
              </div>
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>
          </header>

  <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-neutral-950">
        {messages.length === 0 ? (
          /* Minimal Landing View (inspiration-based) */
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-3xl text-center">
              {/* Logo mark */}
              <div className="mx-auto mb-6 h-10 w-10 rounded-md bg-gray-900 dark:bg-white flex items-center justify-center">
                <img src="/orbf.png" alt="ORB" className="h-10 w-10 rounded-md" />
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
                Talk Domains to Me
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Choose a prompt below or write your own to start chatting with Doma.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={handleDomainAnalysis}
                  disabled={isAnalyzingDomains}
                  className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                >
                  <Brain className="h-4 w-4" />
                  {isAnalyzingDomains ? "Analyzing…" : "Analyze domains"}
                </button>
              </div>

              {/* Prompt card */}
              <div className="mx-auto w-full max-w-3xl">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                  <PromptInput
                    value={input}
                    onValueChange={(v) => {
                      if (v.length <= MAX_CHARS) setInput(v);
                    }}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                  >
                    <PromptInputTextarea
                      placeholder="Ask AI a question or make a request…"
                      className="min-h-[64px] resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent border-0"
                    />
                    <PromptInputActions className="justify-between items-center gap-2 border-t border-gray-100 px-2 py-2 dark:border-neutral-800">
                      {/* Left: source select */}
                      <div className="flex items-center gap-2">
                        <label htmlFor="source" className="sr-only">
                          Select source
                        </label>
                        <select
                          id="source"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          className="text-sm rounded-md border border-gray-200 bg-white text-gray-700 px-2 py-1.5 hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                        >
                          <option value="">{`Select source`}</option>
                          <option value="marketplaces">Marketplaces</option>
                          <option value="whois">WHOIS</option>
                          <option value="trends">Trends</option>
                          <option value="news">News</option>
                        </select>
                      </div>

                      {/* Right: counter + send */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {input.length}/{MAX_CHARS}
                        </span>
                        <Button
                          onClick={handleSubmit}
                          disabled={loading || !input.trim()}
                          className="h-9 w-9 rounded-lg bg-gray-900 hover:bg-black text-white"
                          title="Send"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </PromptInputActions>
                  </PromptInput>
                </div>
              </div>

              {/* Domain Analysis Results */}
              {showDomainAnalysis && (
                <div className="w-full max-w-5xl mx-auto mt-6">
                  <DomainAnalysis
                    results={domainAnalysisResults}
                    isAnalyzing={isAnalyzingDomains}
                    onClose={() => setShowDomainAnalysis(false)}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Minimal Chat View */
      <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    className={message.role === "user" ? "justify-end" : "justify-start"}
                  >
                    {message.role === "assistant" && (
                      <MessageAvatar
                        src="/orbf.png"
                        alt="ORB Assistant"
                        fallback="ORB"
                      />
                    )}

                    <div
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words ${
                        message.role === "user"
              ? "bg-blue-600 text-white dark:bg-blue-600"
              : "bg-gray-100 text-gray-900 border border-gray-200 dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-800"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <ResponseStream textStream={message.content} mode="typewriter" speed={30} />
                      ) : (
                        message.content
                      )}
                    </div>

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
                    <MessageAvatar src="/orbf.png" alt="ORB Assistant" fallback="ORB" />
          <div className="rounded-2xl px-3 py-2 bg-gray-100 text-gray-900 border border-gray-200 dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-800">
                      <Loader variant="typing" />
                    </div>
                  </Message>
                )}

        {error && (
                  <Message className="justify-start">
                    <MessageAvatar src="/orbf.png" alt="ORB Assistant" fallback="!" />
          <div className="rounded-2xl px-3 py-2 bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900">
                      Error: {error}
                    </div>
                  </Message>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="border-t border-gray-200 bg-white dark:bg-neutral-950 dark:border-neutral-800 p-4">
              <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                <PromptInput
                  value={input}
                  onValueChange={(v) => {
                    if (v.length <= MAX_CHARS) setInput(v);
                  }}
                  onSubmit={handleSubmit}
                  isLoading={loading}
                >
                  <PromptInputTextarea
                    placeholder="Ask AI a question or make a request…"
                    className="min-h-[56px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent border-0"
                  />
                  <PromptInputActions className="justify-between items-center gap-2 border-t border-gray-100 px-2 py-2 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <label htmlFor="source2" className="sr-only">
                        Select source
                      </label>
                      <select
                        id="source2"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="text-sm rounded-md border border-gray-200 bg-white text-gray-700 px-2 py-1.5 hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                      >
                        <option value="">{`Select source`}</option>
                        <option value="marketplaces">Marketplaces</option>
                        <option value="whois">WHOIS</option>
                        <option value="trends">Trends</option>
                        <option value="news">News</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {input.length}/{MAX_CHARS}
                      </span>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading || !input.trim()}
                        className="h-9 w-9 rounded-lg bg-gray-900 hover:bg-black text-white"
                        title="Send"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </PromptInputActions>
                </PromptInput>
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