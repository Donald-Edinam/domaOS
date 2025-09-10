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

          try {
            // Use DOMA GraphQL API to check real domain data
            const graphqlQuery = `
              query GetDomainInfo($name: String!) {
                name(name: $name) {
                  name
                  expiresAt
                  tokenizedAt
                  claimedBy
                  tokens {
                    tokenId
                    networkId
                    ownerAddress
                    listings {
                      id
                      price
                      currency {
                        symbol
                        decimals
                      }
                    }
                  }
                }
                offers(tokenId: null, skip: 0, take: 10) {
                  totalCount
                }
                listings(sld: $name, skip: 0, take: 10) {
                  totalCount
                }
              }
            `;

            const graphqlResponse = await fetch(`${apiBaseUrl}/graphql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.DOMA_API_KEY || '',
              },
              body: JSON.stringify({
                query: graphqlQuery,
                variables: { name: domain }
              }),
            });

            if (!graphqlResponse.ok) {
              return {
                success: false,
                data: null,
                message: `Failed to check domain: ${graphqlResponse.statusText}`,
              };
            }

            const data = await graphqlResponse.json();
            const domainData = data.data?.name;
            const isAvailable = !domainData;
            const listings = data.data?.listings?.totalCount || 0;
            const offers = data.data?.offers?.totalCount || 0;

            let lastSalePrice = null;
            let estimatedValue = "Not available";

            if (domainData && domainData.tokens?.length > 0) {
              const activeListings = domainData.tokens.flatMap(token => token.listings || []);
              if (activeListings.length > 0) {
                const prices = activeListings.map(listing =>
                  parseFloat(listing.price) / Math.pow(10, listing.currency.decimals)
                );
                const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                lastSalePrice = `$${Math.floor(avgPrice)}`;
                estimatedValue = `$${Math.floor(avgPrice * 0.8)} - $${Math.floor(avgPrice * 1.2)}`;
              }
            }

            return {
              success: true,
              data: {
                domain,
                available: isAvailable,
                currentListings: listings,
                offers: offers,
                lastSalePrice,
                estimatedValue,
                marketActivity: listings + offers > 5 ? "high" : listings + offers > 2 ? "medium" : "low",
                tokenized: !!domainData?.tokenizedAt,
                expiresAt: domainData?.expiresAt,
                ownerAddress: domainData?.tokens?.[0]?.ownerAddress,
              },
              message: `Domain ${domain} ${isAvailable ? "is available for registration" : "is currently registered"}`,
            };
          } catch (error) {
            return {
              success: false,
              data: null,
              message: `Error checking domain: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
          }

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
