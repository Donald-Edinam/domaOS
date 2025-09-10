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
    url: "file:apps/web/memory.db",
  }),
  options: {
    semanticRecall: { 
      topK: 5, 
      messageRange: 3 
    },
    workingMemory: { 
      enabled: true 
    },
  },
});

export const domainAssistant = new Agent({
  name: "domainAssistant",
  description: "Domain analytics assistant with Doma Protocol integration and memory.",
  instructions: `You are a helpful assistant for our domain analytics app with access to the Doma Protocol GraphQL API.
  
  You can help users with:
  - Searching for tokenized domain names
  - Getting detailed information about specific domains
  - Browsing marketplace listings and offers
  - Viewing domain activity history
  - Checking domain statistics and market data
  
  You have memory enabled, so you can remember previous conversations and context about domains the user has asked about.
  
  When users ask about domains, use the available tools to fetch real-time data from the Doma Protocol.
  Present information clearly and concisely. If a domain is not found or there's an error, explain it clearly.
  
  Available data includes:
  - Domain ownership and expiration dates
  - Token information (network, owner address, token ID)
  - Marketplace listings and offers
  - Activity history (tokenization, claims, renewals)
  - Market statistics (active offers, highest offer, etc.)
  
  Always provide accurate, up-to-date information from the Doma Protocol testnet.`,
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