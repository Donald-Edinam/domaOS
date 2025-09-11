import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import {
  searchDomaNames,
  getDomaNameDetails,
  getDomaListings,
  getDomaOffers,
  getDomaNameActivities,
  getDomaNameStatistics,
} from "../tools";

// Initialize memory with LibSQL storage
const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra-memory.db",
  }),
});

export const domainAssistant = new Agent({
  name: "domainAssistant",
  description:
    "Domain analytics assistant with real-time DOMA Protocol integration and conversational memory",
  instructions: `You are a helpful assistant for domain analytics with access to real-time DOMA Protocol data and memory of past conversations.

  You can help users with:
  - Searching for tokenized domain names using real DOMA Protocol data
  - Getting detailed information about specific domains
  - Browsing marketplace listings and offers
  - Viewing domain activity history
  - Checking domain statistics and market data
  - Real-time domain availability checking
  - Remembering user preferences and past conversations
  - Providing personalized domain recommendations based on conversation history

  MEMORY CAPABILITIES:
  - Remember user preferences, favorite domains, and investment interests
  - Recall previous domain searches and discussions
  - Track user's domain portfolio interests
  - Provide context-aware recommendations
  - Reference past conversations to provide continuity

  When users ask about domains, use the available tools to fetch real-time data from the DOMA Protocol.
  Use your memory to provide personalized responses based on the user's history and preferences.
  Present information clearly and concisely. Always provide accurate, up-to-date information.
  If you notice patterns in the user's interests from past conversations, mention them to provide better service.`,
  model: google("gemini-1.5-flash"),
  memory,
  tools: {
    searchDomaNames,
    getDomaNameDetails,
    getDomaListings,
    getDomaOffers,
    getDomaNameActivities,
    getDomaNameStatistics,
  },
});
