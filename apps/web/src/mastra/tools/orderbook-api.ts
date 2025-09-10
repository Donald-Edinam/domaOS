import { createTool } from "@mastra/core";
import { z } from "zod";

// Doma Orderbook API integration tool
export const orderbookApiTool = createTool({
  id: "doma-orderbook-api",
  description:
    "Interact with Doma Orderbook API to get listing data, market trends, and domain availability",
  inputSchema: z.object({
    action: z.enum([
      "get-listings",
      "get-offers",
      "get-fees",
      "get-currencies",
      "check-domain",
    ]),
    domain: z.string().optional(),
    orderbook: z.enum(["opensea", "doma"]).optional(),
    chainId: z.string().optional(), // CAIP-2 format like "eip155:1"
    contractAddress: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { action, domain, orderbook, chainId, contractAddress } = context;
    const apiBaseUrl = "https://api-testnet.doma.xyz";

    try {
      switch (action) {
        case "get-fees":
          if (!orderbook || !chainId || !contractAddress) {
            return {
              success: false,
              data: null,
              message:
                "Missing required parameters: orderbook, chainId, and contractAddress are required for get-fees",
            };
          }

          const feesResponse = await fetch(
            `${apiBaseUrl}/v1/orderbook/fee/${orderbook}/${chainId}/${contractAddress}`,
            {
              headers: {
                "Api-Key":
                  process.env.DOMA_API_KEY ||
                  "sv1.132a5a83b4c7d09d82d5cd59dc01fc6e8eebb8fd5c5a6b5bae2d3ddb4b0926ad",
              },
            },
          );

          if (!feesResponse.ok) {
            return {
              success: false,
              data: null,
              message: `Failed to fetch fees: ${feesResponse.statusText}`,
            };
          }

          const feesData = await feesResponse.json();
          return {
            success: true,
            data: feesData,
            message: "Successfully retrieved marketplace fees",
          };

        case "get-currencies":
          if (!chainId || !contractAddress || !orderbook) {
            return {
              success: false,
              data: null,
              message:
                "Missing required parameters: chainId, contractAddress, and orderbook are required for get-currencies",
            };
          }

          const currenciesResponse = await fetch(
            `${apiBaseUrl}/v1/orderbook/currencies/${chainId}/${contractAddress}/${orderbook}`,
            {
              headers: {
                "Api-Key": process.env.DOMA_API_KEY || "",
              },
            },
          );

          if (!currenciesResponse.ok) {
            return {
              success: false,
              data: null,
              message: `Failed to fetch currencies: ${currenciesResponse.statusText}`,
            };
          }

          const currenciesData = await currenciesResponse.json();
          return {
            success: true,
            data: currenciesData,
            message: "Successfully retrieved supported currencies",
          };

        case "check-domain":
          if (!domain) {
            return {
              success: false,
              data: null,
              message: "Domain parameter is required for check-domain action",
            };
          }

          // Simulate domain availability check (replace with actual API when available)
          const isAvailable = Math.random() > 0.3; // 70% chance available
          const lastSalePrice = Math.floor(Math.random() * 50000) + 1000;
          const currentListings = Math.floor(Math.random() * 5);
          const offers = Math.floor(Math.random() * 8);

          return {
            success: true,
            data: {
              domain,
              available: isAvailable,
              currentListings,
              offers,
              lastSalePrice: isAvailable ? null : `$${lastSalePrice}`,
              estimatedValue: `$${Math.floor(lastSalePrice * 0.8)} - $${Math.floor(lastSalePrice * 1.2)}`,
              marketActivity:
                currentListings + offers > 5
                  ? "high"
                  : currentListings + offers > 2
                    ? "medium"
                    : "low",
            },
            message: `Domain ${domain} ${isAvailable ? "appears to be available" : "is currently registered"}`,
          };

        default:
          return {
            success: false,
            data: null,
            message: `Unsupported action: ${action}. Supported actions: get-listings, get-offers, get-fees, get-currencies, check-domain`,
          };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `API error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

// Market trends analysis tool
export const marketTrendsAnalysisTool = createTool({
  id: "domain-market-trends",
  description: "Analyze domain market trends and provide investment insights",
  inputSchema: z.object({
    domains: z.array(z.string()),
    timeframe: z.enum(["1d", "7d", "30d", "90d"]).default("30d"),
    includeComparables: z.boolean().default(true),
  }),
  outputSchema: z.object({
    trends: z.array(
      z.object({
        domain: z.string(),
        trend: z.enum(["bullish", "bearish", "neutral"]),
        momentum: z.number(), // -100 to 100
        priceChange: z.string(),
        volume: z.string(),
        comparables: z
          .array(
            z.object({
              domain: z.string(),
              lastPrice: z.string(),
              similarity: z.number(), // 0 to 100
            }),
          )
          .optional(),
        insights: z.array(z.string()),
      }),
    ),
    marketOverview: z.object({
      totalVolume: z.string(),
      averagePriceChange: z.string(),
      hotSectors: z.array(z.string()),
      recommendations: z.array(z.string()),
    }),
  }),
  execute: async ({ context }) => {
    const { domains, timeframe, includeComparables } = context;

    // Simulate market analysis (replace with real data sources)
    const trends = domains.map((domain) => {
      const momentum = (Math.random() - 0.5) * 200; // -100 to 100
      const trend: "bullish" | "bearish" | "neutral" =
        momentum > 20 ? "bullish" : momentum < -20 ? "bearish" : "neutral";
      const priceChangePercent = Math.floor(Math.abs(momentum) * 0.5);
      const priceChange =
        momentum > 0 ? `+${priceChangePercent}%` : `-${priceChangePercent}%`;

      const insights = [];
      if (trend === "bullish") {
        insights.push("Strong upward momentum detected");
        insights.push("Above-average trading volume");
      } else if (trend === "bearish") {
        insights.push("Declining interest observed");
        insights.push("Consider waiting for better entry point");
      } else {
        insights.push("Stable price action");
        insights.push("Good for long-term holding");
      }

      // Add TLD-specific insights
      const tld = domain.split(".").pop() || "";
      if (["com", "io", "ai"].includes(tld)) {
        insights.push(
          `${tld.toUpperCase()} domains showing strong institutional interest`,
        );
      }

      const comparables = includeComparables
        ? [
            {
              domain: `similar-${Math.floor(Math.random() * 1000)}.${tld}`,
              lastPrice: `$${Math.floor(Math.random() * 10000) + 1000}`,
              similarity: Math.floor(Math.random() * 30) + 70, // 70-100 similarity
            },
            {
              domain: `comparable-${Math.floor(Math.random() * 1000)}.${tld}`,
              lastPrice: `$${Math.floor(Math.random() * 8000) + 500}`,
              similarity: Math.floor(Math.random() * 25) + 65, // 65-90 similarity
            },
          ]
        : undefined;

      return {
        domain,
        trend,
        momentum: Math.round(momentum),
        priceChange,
        volume: `$${Math.floor(Math.random() * 100000) + 10000}`,
        comparables,
        insights,
      };
    });

    const marketOverview = {
      totalVolume: `$${Math.floor(Math.random() * 10000000) + 1000000}`,
      averagePriceChange: "+12.5%",
      hotSectors: ["AI/Tech", "Crypto/Web3", "E-commerce", "Gaming"],
      recommendations: [
        "Focus on premium TLDs (.com, .io, .ai) for stability",
        "Short domains (≤6 characters) showing strongest growth",
        "Tech keywords continue to outperform general terms",
        "Consider diversifying across multiple TLD categories",
      ],
    };

    return {
      trends,
      marketOverview,
    };
  },
});
