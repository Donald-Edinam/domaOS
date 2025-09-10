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

export const domainAssistant = new Agent({
  name: "domainAssistant",
  description: "Domain analytics assistant with Doma Protocol integration.",
  instructions: `You are a helpful assistant for our domain analytics app with access to the Doma Protocol GraphQL API.

  You can help users with:
  - Searching for tokenized domain names
  - Getting detailed information about specific domains
  - Browsing marketplace listings and offers
  - Viewing domain activity history
  - Checking domain statistics and market data

  When users ask about domains, use the available tools to fetch real-time data from the Doma Protocol.
  Present information clearly and concisely. If a domain is not found or there's an error, explain it clearly.

  Available data includes:
  - Domain ownership and expiration dates
  - Token information (network, owner address, token ID)
  - Marketplace listings and offers
  - Activity history (tokenization, claims, renewals)
  - Market statistics (active offers, highest offer, etc.)

  Always provide accurate, up-to-date information from the Doma Protocol testnet.`,
  model: google("gemini-1.5-flash", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }),
  tools: {
    searchDomaNames,
    getDomaNameDetails,
    getDomaListings,
    getDomaOffers,
    getDomaNameActivities,
    getDomaNameStatistics,
  },
});
