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
  instructions: `You are a domain analytics assistant with DIRECT ACCESS to real-time DOMA Protocol data through working GraphQL tools.

  IMPORTANT: You have access to these FUNCTIONAL tools that connect to the live DOMA API:
  - searchDomaNames: Search for tokenized domains with filters (name, TLDs, owner)
  - getDomaNameDetails: Get detailed info about specific domains
  - getDomaListings: Browse marketplace listings
  - getDomaOffers: View offers on domains
  - getDomaNameActivities: Check domain activity history
  - getDomaNameStatistics: Get domain market statistics

  ALWAYS use these tools when users ask about domains. Do NOT mention API limitations - you have full access!

  Your capabilities:
  ✅ Search tokenized domains in real-time using searchDomaNames
  ✅ Get domain details, listings, offers, activities, and statistics
  ✅ Remember user preferences and conversation history
  ✅ Provide personalized domain recommendations
  ✅ Access live market data from 785,000+ domains

  When users request domain information:
  1. Use the appropriate tool immediately
  2. Present the results clearly
  3. Offer additional insights based on the data
  4. Remember user interests for future recommendations

  You have working API access - use it confidently!`,
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
