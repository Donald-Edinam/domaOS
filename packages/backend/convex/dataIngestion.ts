import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

// Doma Subgraph endpoint
const DOMA_SUBGRAPH_ENDPOINT = "https://api-testnet.doma.xyz/graphql";

// GraphQL query to fetch domains
const GET_DOMAINS_QUERY = `
  query GetDomains($skip: Int, $take: Int, $tlds: [String!], $claimStatus: NamesQueryClaimStatus) {
    names(skip: $skip, take: $take, tlds: $tlds, claimStatus: $claimStatus, sortOrder: DESC) {
      items {
        name
        expiresAt
        tokenizedAt
        claimedBy
        registrar {
          name
          ianaId
        }
        tokens {
          tokenId
          networkId
          ownerAddress
          type
          expiresAt
        }
      }
      totalCount
      pageSize
      currentPage
      hasNextPage
    }
  }
`;

// GraphQL query to get supported TLDs (from API or hardcoded list)
// Complete list of supported TLDs from Doma API documentation
const SUPPORTED_GTLDS = [
  "academy",
  "accountant",
  "accountants",
  "actor",
  "adult",
  "africa",
  "agency",
  "airforce",
  "apartments",
  "app",
  "army",
  "art",
  "associates",
  "attorney",
  "auction",
  "audio",
  "author",
  "auto",
  "autos",
  "baby",
  "band",
  "bar",
  "bargains",
  "beauty",
  "beer",
  "best",
  "bet",
  "bible",
  "bid",
  "bike",
  "bingo",
  "bio",
  "biz",
  "black",
  "blackfriday",
  "blog",
  "blue",
  "boo",
  "book",
  "boston",
  "bot",
  "boutique",
  "box",
  "broker",
  "build",
  "builders",
  "business",
  "buy",
  "buzz",
  "cab",
  "cafe",
  "call",
  "cam",
  "camera",
  "camp",
  "cancerresearch",
  "capital",
  "car",
  "cards",
  "care",
  "career",
  "careers",
  "cars",
  "casa",
  "cash",
  "casino",
  "catering",
  "catholic",
  "center",
  "ceo",
  "cfd",
  "channel",
  "chat",
  "cheap",
  "christmas",
  "church",
  "circle",
  "city",
  "claims",
  "cleaning",
  "click",
  "clinic",
  "clothing",
  "cloud",
  "club",
  "coach",
  "codes",
  "coffee",
  "college",
  "com",
  "community",
  "company",
  "computer",
  "condos",
  "construction",
  "consulting",
  "contact",
  "contractors",
  "cooking",
  "cool",
  "country",
  "coupon",
  "coupons",
  "courses",
  "credit",
  "creditcard",
  "cricket",
  "cruise",
  "cruises",
  "dad",
  "dance",
  "data",
  "date",
  "dating",
  "day",
  "deal",
  "deals",
  "degree",
  "delivery",
  "democrat",
  "dental",
  "dentist",
  "design",
  "dev",
  "diamonds",
  "diet",
  "digital",
  "direct",
  "directory",
  "discount",
  "diy",
  "docs",
  "doctor",
  "dog",
  "domains",
  "dot",
  "download",
  "earth",
  "eat",
  "education",
  "email",
  "energy",
  "engineer",
  "engineering",
  "edeka",
  "enterprises",
  "equipment",
  "estate",
  "events",
  "exchange",
  "expert",
  "exposed",
  "express",
  "fail",
  "faith",
  "family",
  "fan",
  "fans",
  "farm",
  "fashion",
  "feedback",
  "film",
  "final",
  "finance",
  "financial",
  "fish",
  "fishing",
  "fit",
  "fitness",
  "flights",
  "florist",
  "flowers",
  "food",
  "football",
  "forsale",
  "forum",
  "foundation",
  "free",
  "fun",
  "fund",
  "furniture",
  "fyi",
  "gallery",
  "game",
  "games",
  "garden",
  "gay",
  "gdn",
  "gift",
  "gifts",
  "gives",
  "glass",
  "global",
  "gmbh",
  "gold",
  "golf",
  "gop",
  "graphics",
  "gripe",
  "group",
  "guide",
  "guitars",
  "guru",
  "hair",
  "haus",
  "health",
  "healthcare",
  "help",
  "here",
  "hiphop",
  "hiv",
  "hockey",
  "holdings",
  "holiday",
  "homes",
  "horse",
  "hospital",
  "host",
  "hosting",
  "hot",
  "house",
  "how",
  "industries",
  "info",
  "ing",
  "ink",
  "institute",
  "insurance",
  "insure",
  "international",
  "investments",
  "jewelry",
  "joy",
  "kim",
  "kitchen",
  "land",
  "lat",
  "lawyer",
  "lease",
  "legal",
  "lgbt",
  "life",
  "lifeinsurance",
  "lighting",
  "like",
  "limited",
  "limo",
  "link",
  "live",
  "living",
  "loan",
  "loans",
  "lol",
  "lotto",
  "love",
  "ltd",
  "makeup",
  "management",
  "map",
  "market",
  "marketing",
  "markets",
  "mba",
  "med",
  "media",
  "meet",
  "meme",
  "memorial",
  "men",
  "menu",
  "mobile",
  "moda",
  "moe",
  "mom",
  "money",
  "monster",
  "mortgage",
  "motorcycles",
  "mov",
  "movie",
  "navy",
  "net",
  "network",
  "news",
  "nexus",
  "ninja",
  "now",
  "observer",
  "one",
  "onl",
  "online",
  "ooo",
  "open",
  "org",
  "page",
  "partners",
  "parts",
  "party",
  "pay",
  "pet",
  "phone",
  "photo",
  "photography",
  "photos",
  "pics",
  "pictures",
  "pid",
  "pin",
  "pink",
  "pizza",
  "place",
  "plumbing",
  "plus",
  "poker",
  "press",
  "pro",
  "productions",
  "prof",
  "promo",
  "properties",
  "property",
  "protection",
  "pub",
  "qpon",
  "quebec",
  "racing",
  "read",
  "realestate",
  "realty",
  "recipes",
  "red",
  "rehab",
  "rent",
  "rentals",
  "repair",
  "report",
  "republican",
  "rest",
  "restaurant",
  "review",
  "reviews",
  "rich",
  "rip",
  "rocks",
  "rodeo",
  "room",
  "rugby",
  "run",
  "safe",
  "sale",
  "save",
  "sbi",
  "scholarships",
  "school",
  "science",
  "search",
  "secure",
  "security",
  "select",
  "services",
  "sexy",
  "shoes",
  "shop",
  "shopping",
  "show",
  "singles",
  "site",
  "ski",
  "skin",
  "sky",
  "soccer",
  "social",
  "software",
  "solar",
  "solutions",
  "song",
  "space",
  "spreadbetting",
  "spot",
  "srl",
  "store",
  "studio",
  "study",
  "style",
  "sucks",
  "supplies",
  "supply",
  "support",
  "surf",
  "surgery",
  "systems",
  "talk",
  "tattoo",
  "tax",
  "taxi",
  "team",
  "tech",
  "technology",
  "tennis",
  "theater",
  "theatre",
  "tickets",
  "tips",
  "tires",
  "today",
  "tools",
  "top",
  "tours",
  "town",
  "toys",
  "trade",
  "trading",
  "training",
  "trust",
  "tube",
  "tunes",
  "uconnect",
  "university",
  "uno",
  "vacations",
  "ventures",
  "vet",
  "video",
  "villas",
  "vip",
  "vision",
  "vodka",
  "voting",
  "voyage",
  "wang",
  "watch",
  "watches",
  "webcam",
  "website",
  "wedding",
  "win",
  "wine",
  "work",
  "works",
  "world",
  "wow",
  "wtf",
  "xyz",
  "yachts",
  "yoga",
  "you",
];

const SUPPORTED_CCTLDS = [
  "ac",
  "ad",
  "ag",
  "ai",
  "al",
  "am",
  "ar",
  "as",
  "az",
  "bz",
  "ca",
  "cc",
  "cd",
  "co",
  "cu",
  "cv",
  "de",
  "dj",
  "fm",
  "ga",
  "gg",
  "io",
  "il",
  "in",
  "is",
  "it",
  "kg",
  "ky",
  "la",
  "ly",
  "ma",
  "md",
  "me",
  "mn",
  "ms",
  "mt",
  "ne",
  "nu",
  "pa",
  "pe",
  "pn",
  "pr",
  "pw",
  "re",
  "rs",
  "sc",
  "sd",
  "sh",
  "sx",
  "tf",
  "tk",
  "tm",
  "tn",
  "to",
  "tv",
  "ws",
  "yt",
];

const SUPPORTED_TLDS = [...SUPPORTED_GTLDS, ...SUPPORTED_CCTLDS];

interface DomaName {
  name: string;
  expiresAt: string;
  tokenizedAt: string;
  claimedBy?: string;
  registrar: {
    name: string;
    ianaId: number;
  };
  tokens: Array<{
    tokenId: string;
    networkId: string;
    ownerAddress: string;
    type: string;
    expiresAt: string;
  }>;
}

// Action to fetch domains from Doma Subgraph
export const fetchDomainsFromSubgraph = action({
  args: {
    batchSize: v.optional(v.number()),
    maxBatches: v.optional(v.number()),
    tlds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize || 100;
    const maxBatches = args.maxBatches || 10;
    const tlds = args.tlds || SUPPORTED_TLDS;

    let totalProcessed = 0;
    let currentSkip = 0;
    let batchCount = 0;
    let hasMore = true;

    const results = {
      totalProcessed: 0,
      batches: 0,
      errors: [] as string[],
    };

    while (hasMore && batchCount < maxBatches) {
      try {
        console.log(`Fetching batch ${batchCount + 1}, skip: ${currentSkip}`);
        
        // Debug logging for environment variable
        const domaApiKey = process.env.DOMA_API_KEY;
        console.log(`DOMA_API_KEY status: ${domaApiKey ? 'FOUND' : 'MISSING'}`);
        console.log(`DOMA_API_KEY length: ${domaApiKey ? domaApiKey.length : 0}`);
        console.log(`DOMA_API_KEY prefix: ${domaApiKey ? domaApiKey.substring(0, 10) + '...' : 'N/A'}`);
        
        if (!domaApiKey) {
          console.error("DOMA API KEY MISSING: Environment variable DOMA_API_KEY is not set");
          console.log("Available environment variables:", Object.keys(process.env).filter(key => key.includes('DOMA')));
        }

        const response = await fetch(DOMA_SUBGRAPH_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": domaApiKey || "",
          },
          body: JSON.stringify({
            query: GET_DOMAINS_QUERY,
            variables: {
              skip: currentSkip,
              take: batchSize,
              tlds: tlds,
              claimStatus: "ALL",
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
          console.error("GraphQL errors:", data.errors);
          results.errors.push(`GraphQL errors: ${JSON.stringify(data.errors)}`);
          break;
        }

        const domains = data.data?.names?.items || [];
        hasMore = data.data?.names?.hasNextPage || false;

        if (domains.length === 0) {
          break;
        }

        // Process each domain
        for (const domain of domains) {
          await processDomain(ctx, domain);
          totalProcessed++;
        }

        currentSkip += batchSize;
        batchCount++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error in batch ${batchCount + 1}:`, error);
        results.errors.push(
          `Batch ${batchCount + 1}: ${error instanceof Error ? error.message : String(error)}`,
        );
        break;
      }
    }

    results.totalProcessed = totalProcessed;
    results.batches = batchCount;

    console.log("Data ingestion completed:", results);
    return results;
  },
});

// Helper function to process a single domain
async function processDomain(ctx: any, domain: DomaName) {
  try {
    // Parse domain name to get SLD and TLD
    const parts = domain.name.split(".");
    if (parts.length < 2) {
      console.warn(`Invalid domain name: ${domain.name}`);
      return;
    }

    const tld = parts[parts.length - 1];
    const sld = parts[parts.length - 2];

    // Get the primary ownership token (if any)
    const ownershipToken = domain.tokens?.find(
      (token) => token.type === "OWNERSHIP",
    );

    // Store the domain score
    await ctx.runMutation("scoring:storeDomainScore", {
      name: domain.name,
      sld: sld,
      tld: tld,
      ownerAddress: domain.claimedBy || ownershipToken?.ownerAddress,
      expiresAt: domain.expiresAt,
      tokenId: ownershipToken?.tokenId,
      networkId: ownershipToken?.networkId,
      registrarIanaId: domain.registrar.ianaId,
    });

    // Update TLD statistics
    await ctx.runMutation("tldStats:updateTldStats", {
      tld: tld,
    });
  } catch (error) {
    console.error(`Error processing domain ${domain.name}:`, error);
  }
}

// Manual trigger to refresh domain data
export const refreshDomainData = action({
  args: {
    domainName: v.optional(v.string()),
    tld: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.domainName) {
      // Refresh specific domain
      const query = `
        query GetDomain($name: String!) {
          name(name: $name) {
            name
            expiresAt
            tokenizedAt
            claimedBy
            registrar {
              name
              ianaId
            }
            tokens {
              tokenId
              networkId
              ownerAddress
              type
              expiresAt
            }
          }
        }
      `;

      try {
        // Debug logging for environment variable in refreshDomainData
        const domaApiKey = process.env.DOMA_API_KEY;
        console.log(`[refreshDomainData] DOMA_API_KEY status: ${domaApiKey ? 'FOUND' : 'MISSING'}`);
        
        if (!domaApiKey) {
          console.error("[refreshDomainData] DOMA API KEY MISSING: Environment variable DOMA_API_KEY is not set");
        }

        const response = await fetch(DOMA_SUBGRAPH_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": domaApiKey || "",
          },
          body: JSON.stringify({
            query,
            variables: { name: args.domainName },
          }),
        });

        const data = await response.json();

        if (data.data?.name) {
          await processDomain(ctx, data.data.name);
          return { success: true, processed: 1 };
        } else {
          return { success: false, error: "Domain not found" };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    } else if (args.tld) {
      // Refresh domains for specific TLD
      return await ctx.runAction("dataIngestion:fetchDomainsFromSubgraph", {
        tlds: [args.tld],
        batchSize: 50,
        maxBatches: 5,
      });
    } else {
      // Full refresh
      return await ctx.runAction("dataIngestion:fetchDomainsFromSubgraph", {
        batchSize: 100,
        maxBatches: 20,
      });
    }
  },
});

// Initialize supported TLDs in the database
export const initializeData = action({
  args: {},
  handler: async (ctx) => {
    // Initialize supported TLDs
    await ctx.runMutation("tldStats:initializeSupportedTlds", {});

    // Start initial data ingestion
    const result = await ctx.runAction(
      "dataIngestion:fetchDomainsFromSubgraph",
      {
        batchSize: 50,
        maxBatches: 5, // Start small for initial setup
      },
    );

    return {
      supportedTldsInitialized: true,
      dataIngestionResult: result,
    };
  },
});
