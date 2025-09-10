import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import {
  searchDomaNames,
  getDomaNameDetails,
  getDomaListings,
  getDomaOffers,
  getDomaNameActivities,
  getDomaNameStatistics,
} from "../tools";
import { orderbookApiTool } from "../tools/orderbook-api";

export const domainAssistant = new Agent({
  name: "domainAssistant",
  description:
    "Domain analytics assistant with real-time DOMA Protocol integration",
  instructions: `You are a helpful assistant for domain analytics with access to real-time DOMA Protocol data.

  You can help users with:
  - Searching for tokenized domain names using real DOMA Protocol data
  - Getting detailed information about specific domains
  - Browsing marketplace listings and offers
  - Viewing domain activity history
  - Checking domain statistics and market data
  - Real-time domain availability checking

  When users ask about domains, use the available tools to fetch real-time data from the DOMA Protocol.
  Present information clearly and concisely. Always provide accurate, up-to-date information.`,
  model: google("gemini-1.5-flash"),
  tools: {
    searchDomaNames,
    getDomaNameDetails,
    getDomaListings,
    getDomaOffers,
    getDomaNameActivities,
    getDomaNameStatistics,
    orderbookApiTool,
  },
});
