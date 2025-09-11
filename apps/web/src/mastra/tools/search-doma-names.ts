import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const DOMA_GRAPHQL_ENDPOINT = "https://api-testnet.doma.xyz/graphql";

// Helper function to make GraphQL requests with enhanced error handling
async function domaGraphQL(
  query: string,
  variables?: any,
  options?: { timeout?: number; retries?: number },
) {
  const apiKey = process.env.DOMA_API_KEY;
  if (!apiKey) {
    throw new Error("DOMA_API_KEY is required but not configured");
  }

  const { timeout = 30000, retries = 3 } = options || {};

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(DOMA_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
          "User-Agent": "Mastra-Tool/1.0",
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `GraphQL request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(
          `GraphQL request failed after ${retries} attempts: ${error.message}`,
        );
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      );
    }
  }
}

// Tool to search for tokenized names
export const searchDomaNames = createTool({
  id: "search-doma-names",
  description:
    "Search for tokenized domain names on Doma Protocol with filters",
  inputSchema: z.object({
    name: z.string().optional().describe("Filter by domain name"),
    tlds: z
      .array(z.string())
      .optional()
      .describe("Filter by TLDs (e.g., ['com', 'io'])"),
    ownedBy: z.string().optional().describe("Filter by owner address"),
    take: z
      .number()
      .default(10)
      .describe("Number of results to return (max 100)"),
    skip: z
      .number()
      .default(0)
      .describe("Number of results to skip for pagination"),
  }),
  outputSchema: z.object({
    names: z.array(z.any()),
    totalCount: z.number(),
    hasMore: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }, { abortSignal }) => {
    const query = `
      query SearchNames($skip: Int, $take: Int, $name: String, $tlds: [String!], $ownedBy: [AddressCAIP10!]) {
        names(skip: $skip, take: $take, name: $name, tlds: $tlds, ownedBy: $ownedBy) {
          items {
            name
            expiresAt
            tokenizedAt
            eoi
            claimedBy
            registrar {
              name
              ianaId
            }
            tokens {
              tokenId
              networkId
              ownerAddress
              expiresAt
            }
          }
          totalCount
          hasNextPage
        }
      }
    `;

    try {
      const variables = {
        skip: context.skip,
        take: Math.min(context.take, 100), // Enforce max limit
        name: context.name,
        tlds: context.tlds,
        ownedBy: context.ownedBy ? [context.ownedBy] : undefined,
      };

      // Check for abort signal before making request
      if (abortSignal?.aborted) {
        throw new Error("Request aborted");
      }

      const result = await domaGraphQL(query, variables, {
        timeout: 30000,
        retries: 3,
      });

      return {
        names: result.names.items,
        totalCount: result.names.totalCount,
        hasMore: result.names.hasNextPage,
      };
    } catch (error) {
      console.error(`Error in searchDomaNames: ${error.message}`);

      // Return partial results with error info instead of throwing
      return {
        names: [],
        totalCount: 0,
        hasMore: false,
        error: error.message,
      };
    }
  },
});

// Tool to get details about a specific name
export const getDomaNameDetails = createTool({
  id: "get-doma-name-details",
  description:
    "Get detailed information about a specific tokenized domain name",
  inputSchema: z.object({
    name: z
      .string()
      .describe("The domain name to look up (e.g., 'example.com')"),
  }),
  outputSchema: z.object({
    name: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }, { abortSignal }) => {
    const query = `
      query GetName($name: String!) {
        name(name: $name) {
          name
          expiresAt
          tokenizedAt
          eoi
          claimedBy
          transferLock
          registrar {
            name
            ianaId
            websiteUrl
            supportEmail
          }
          nameservers {
            ldhName
          }
          dsKeys {
            keyTag
            algorithm
            digest
            digestType
          }
          tokens {
            tokenId
            networkId
            ownerAddress
            type
            expiresAt
            tokenAddress
            explorerUrl
            chain {
              name
              networkId
            }
            listings {
              id
              price
              currency {
                name
                symbol
                decimals
              }
              expiresAt
              orderbook
            }
          }
        }
      }
    `;

    try {
      // Check for abort signal before making request
      if (abortSignal?.aborted) {
        throw new Error("Request aborted");
      }

      const result = await domaGraphQL(
        query,
        { name: context.name },
        {
          timeout: 30000,
          retries: 3,
        },
      );

      if (!result.name) {
        return {
          name: undefined,
          error: `Name "${context.name}" not found`,
        };
      }

      return { name: result.name };
    } catch (error) {
      console.error(`Error in getDomaNameDetails: ${error.message}`);
      return {
        name: undefined,
        error: error.message,
      };
    }
  },
});

// Tool to get marketplace listings
export const getDomaListings = createTool({
  id: "get-doma-listings",
  description: "Get marketplace listings for tokenized domain names",
  inputSchema: z.object({
    tlds: z.array(z.string()).optional().describe("Filter by TLDs"),
    sld: z.string().optional().describe("Second-level domain name"),
    take: z.number().default(10).describe("Number of results (max 100)"),
    skip: z.number().default(0).describe("Skip for pagination"),
  }),
  outputSchema: z.object({
    listings: z.array(z.any()),
    totalCount: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ context }, { abortSignal }) => {
    const query = `
      query GetListings($skip: Float, $take: Float, $tlds: [String!], $sld: String) {
        listings(skip: $skip, take: $take, tlds: $tlds, sld: $sld) {
          items {
            id
            name
            nameExpiresAt
            price
            currency {
              name
              symbol
              decimals
            }
            expiresAt
            orderbook
            tokenId
            tokenAddress
            chain {
              name
              networkId
            }
            registrar {
              name
              ianaId
            }
          }
          totalCount
        }
      }
    `;

    try {
      if (abortSignal?.aborted) {
        throw new Error("Request aborted");
      }

      const result = await domaGraphQL(
        query,
        {
          skip: context.skip,
          take: Math.min(context.take, 100),
          tlds: context.tlds,
          sld: context.sld,
        },
        { timeout: 30000, retries: 3 },
      );

      return {
        listings: result.listings.items,
        totalCount: result.listings.totalCount,
      };
    } catch (error) {
      console.error(`Error in getDomaListings: ${error.message}`);
      return {
        listings: [],
        totalCount: 0,
        error: error.message,
      };
    }
  },
});

// Tool to get offers for a token
export const getDomaOffers = createTool({
  id: "get-doma-offers",
  description: "Get offers for a specific tokenized domain name",
  inputSchema: z.object({
    tokenId: z.string().optional().describe("Token ID to get offers for"),
    offeredBy: z.string().optional().describe("Filter by offerer address"),
    status: z
      .enum(["ACTIVE", "EXPIRED", "All"])
      .default("ACTIVE")
      .describe("Filter by offer status"),
    take: z.number().default(10).describe("Number of results"),
    skip: z.number().default(0).describe("Skip for pagination"),
  }),
  outputSchema: z.object({
    offers: z.array(z.any()),
    totalCount: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ context }, { abortSignal }) => {
    const query = `
      query GetOffers($tokenId: String, $offeredBy: [AddressCAIP10!], $status: OfferStatus, $skip: Float, $take: Float) {
        offers(tokenId: $tokenId, offeredBy: $offeredBy, status: $status, skip: $skip, take: $take) {
          items {
            id
            name
            nameExpiresAt
            price
            currency {
              name
              symbol
              decimals
            }
            expiresAt
            orderbook
            tokenId
            offererAddress
            registrar {
              name
              ianaId
            }
          }
          totalCount
        }
      }
    `;

    try {
      if (abortSignal?.aborted) {
        throw new Error("Request aborted");
      }

      const result = await domaGraphQL(
        query,
        {
          tokenId: context.tokenId,
          offeredBy: context.offeredBy ? [context.offeredBy] : undefined,
          status: context.status,
          skip: context.skip,
          take: Math.min(context.take, 100),
        },
        { timeout: 30000, retries: 3 },
      );

      return {
        offers: result.offers.items,
        totalCount: result.offers.totalCount,
      };
    } catch (error) {
      console.error(`Error in getDomaOffers: ${error.message}`);
      return {
        offers: [],
        totalCount: 0,
        error: error.message,
      };
    }
  },
});

// Tool to get name activities
export const getDomaNameActivities = createTool({
  id: "get-doma-name-activities",
  description: "Get activity history for a specific domain name",
  inputSchema: z.object({
    name: z.string().describe("Domain name to get activities for"),
    type: z
      .enum(["TOKENIZED", "CLAIMED", "RENEWED", "DETOKENIZED"])
      .optional()
      .describe("Filter by activity type"),
    take: z.number().default(10).describe("Number of results"),
    skip: z.number().default(0).describe("Skip for pagination"),
  }),
  outputSchema: z.object({
    activities: z.array(z.any()),
    totalCount: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ context }, { abortSignal }) => {
    const query = `
      query GetNameActivities($name: String!, $type: NameActivityType, $skip: Float, $take: Float) {
        nameActivities(name: $name, type: $type, skip: $skip, take: $take) {
          items {
            type
            createdAt
            ... on NameClaimedActivity {
              claimedBy
              sld
              tld
            }
            ... on NameRenewedActivity {
              expiresAt
              sld
              tld
            }
            ... on NameTokenizedActivity {
              networkId
              sld
              tld
              txHash
            }
            ... on NameDetokenizedActivity {
              networkId
              sld
              tld
              txHash
            }
          }
          totalCount
        }
      }
    `;

    try {
      if (abortSignal?.aborted) {
        throw new Error("Request aborted");
      }

      const result = await domaGraphQL(
        query,
        {
          name: context.name,
          type: context.type,
          skip: context.skip,
          take: Math.min(context.take, 100),
        },
        { timeout: 30000, retries: 3 },
      );

      return {
        activities: result.nameActivities.items,
        totalCount: result.nameActivities.totalCount,
      };
    } catch (error) {
      console.error(`Error in getDomaNameActivities: ${error.message}`);
      return {
        activities: [],
        totalCount: 0,
        error: error.message,
      };
    }
  },
});

// Tool to get name statistics
export const getDomaNameStatistics = createTool({
  id: "get-doma-name-statistics",
  description: "Get marketplace statistics for a tokenized domain name",
  inputSchema: z.object({
    tokenId: z.string().describe("Token ID to get statistics for"),
  }),
  outputSchema: z.object({
    statistics: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }, { abortSignal }) => {
    const query = `
      query GetNameStatistics($tokenId: String!) {
        nameStatistics(tokenId: $tokenId) {
          name
          activeOffers
          offersLast3Days
          highestOffer {
            id
            price
            currency {
              symbol
              decimals
            }
            expiresAt
            offererAddress
          }
        }
      }
    `;

    try {
      if (abortSignal?.aborted) {
        throw new Error("Request aborted");
      }

      const result = await domaGraphQL(
        query,
        { tokenId: context.tokenId },
        {
          timeout: 30000,
          retries: 3,
        },
      );

      return { statistics: result.nameStatistics };
    } catch (error) {
      console.error(`Error in getDomaNameStatistics: ${error.message}`);
      return {
        statistics: undefined,
        error: error.message,
      };
    }
  },
});
