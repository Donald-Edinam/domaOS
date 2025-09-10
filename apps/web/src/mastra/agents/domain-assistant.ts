import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

export const domainAssistant = new Agent({
  name: "domainAssistant",
  instructions: `You are a helpful assistant for domain analytics. You can help users with domain-related questions and provide insights about domain names.`,
  model: google("gemini-2.5-flash"),
});
