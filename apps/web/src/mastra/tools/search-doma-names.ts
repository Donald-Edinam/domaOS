import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const DOMA_GRAPHQL_ENDPOINT = "https://api-testnet.doma.xyz/graphql";

// Helper function to make GraphQL requests
async function domaGraphQL(query: string, variables?: any) {
  const response = await fetch(DOMA_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

// Tool to search for tokenized names
export const searchDomaNames = createTool({
  id: "search-doma-names",
  description: "Search for tokenized domain names on Doma Protocol with filters",
  inputSchema: z.object({
    name: z.string().optional().describe("Filter by domain name"),
    tlds: z.array(z.string()).optional().describe("Filter by TLDs (e.g., ['com', 'io'])"),
    ownedBy: z.string().optional().describe("Filter by owner address"),
    take: z.number().default(10).describe("Number of results to return (max 100)"),
    skip: z.number().default(0).describe("Number of results to skip for pagination"),
  }),
  outputSchema: z.object({
    names: z.array(z.any()),
    totalCount: z.number(),
    hasMore: z.boolean(),
  }),
  execute: async ({ context }) => {
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

    const variables = {
      skip: context.skip,
      take: context.take,
      name: context.name,
      tlds: context.tlds,
      ownedBy: context.ownedBy ? [context.ownedBy] : undefined,
    };

    const result = await domaGraphQL(query, variables);
    
    return {
      names: result.names.items,
      totalCount: result.names.totalCount,
      hasMore: result.names.hasNextPage,
    };
  },
});

// Tool to get details about a specific name
export const getDomaNameDetails = createTool({
  id: "get-doma-name-details",
  description: "Get detailed information about a specific tokenized domain name",
  inputSchema: z.object({
    name: z.string().describe("The domain name to look up (e.g., 'example.com')"),
  }),
  outputSchema: z.object({
    name: z.any(),
  }),
  execute: async ({ context }) => {
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

    const result = await domaGraphQL(query, { name: context.name });
    
    if (!result.name) {
      throw new Error(`Name "${context.name}" not found`);
    }
    
    return { name: result.name };
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
  }),
  execute: async ({ context }) => {
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

    const result = await domaGraphQL(query, {
      skip: context.skip,
      take: context.take,
      tlds: context.tlds,
      sld: context.sld,
    });
    
    return {
      listings: result.listings.items,
      totalCount: result.listings.totalCount,
    };
  },
});

// Tool to get offers for a token
export const getDomaOffers = createTool({
  id: "get-doma-offers",
  description: "Get offers for a specific tokenized domain name",
  inputSchema: z.object({
    tokenId: z.string().optional().describe("Token ID to get offers for"),
    offeredBy: z.string().optional().describe("Filter by offerer address"),
    status: z.enum(["ACTIVE", "EXPIRED", "All"]).default("ACTIVE").describe("Filter by offer status"),
    take: z.number().default(10).describe("Number of results"),
    skip: z.number().default(0).describe("Skip for pagination"),
  }),
  outputSchema: z.object({
    offers: z.array(z.any()),
    totalCount: z.number(),
  }),
  execute: async ({ context }) => {
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

    const result = await domaGraphQL(query, {
      tokenId: context.tokenId,
      offeredBy: context.offeredBy ? [context.offeredBy] : undefined,
      status: context.status,
      skip: context.skip,
      take: context.take,
    });
    
    return {
      offers: result.offers.items,
      totalCount: result.offers.totalCount,
    };
  },
});

// Tool to get name activities
export const getDomaNameActivities = createTool({
  id: "get-doma-name-activities",
  description: "Get activity history for a specific domain name",
  inputSchema: z.object({
    name: z.string().describe("Domain name to get activities for"),
    type: z.enum(["TOKENIZED", "CLAIMED", "RENEWED", "DETOKENIZED"]).optional().describe("Filter by activity type"),
    take: z.number().default(10).describe("Number of results"),
    skip: z.number().default(0).describe("Skip for pagination"),
  }),
  outputSchema: z.object({
    activities: z.array(z.any()),
    totalCount: z.number(),
  }),
  execute: async ({ context }) => {
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

    const result = await domaGraphQL(query, {
      name: context.name,
      type: context.type,
      skip: context.skip,
      take: context.take,
    });
    
    return {
      activities: result.nameActivities.items,
      totalCount: result.nameActivities.totalCount,
    };
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
    statistics: z.any(),
  }),
  execute: async ({ context }) => {
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

    const result = await domaGraphQL(query, { tokenId: context.tokenId });
    
    return { statistics: result.nameStatistics };
  },
});