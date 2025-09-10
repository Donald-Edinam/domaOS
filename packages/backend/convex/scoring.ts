import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// SaaS keywords for scoring
const SAAS_KEYWORDS = [
  "ai", "app", "api", "cloud", "dev", "tech", "software", "platform",
  "saas", "service", "tool", "tools", "hub", "lab", "labs", "studio",
  "build", "maker", "create", "data", "analytics", "smart", "auto",
  "digital", "online", "web", "net", "code", "pay", "shop", "store",
  "mail", "chat", "social", "connect", "sync", "flow", "stream",
  "dashboard", "admin", "manage", "track", "monitor", "secure", "pro"
];

// Premium TLD bonuses
const TLD_BONUSES = {
  "ai": 25,
  "io": 20,
  "dev": 20,
  "cloud": 25,
  "tech": 15,
  "app": 20,
  "co": 15,
  "com": 10,
  "org": 5,
  "net": 5
};

export interface DomainData {
  name: string;
  sld: string;
  tld: string;
  ownerAddress?: string;
  expiresAt: string;
  tokenId?: string;
  networkId?: string;
  registrarIanaId?: number;
}

export function calculateDomainScore(domain: DomainData): number {
  const { sld, tld } = domain;
  let score = 0;

  // Base score starts at 50
  score = 50;

  // Length scoring (shorter is better)
  const length = sld.length;
  if (length <= 3) {
    score += 30; // Premium short domains
  } else if (length <= 5) {
    score += 20;
  } else if (length <= 7) {
    score += 10;
  } else if (length <= 10) {
    score += 0;
  } else {
    score -= 10; // Penalize very long domains
  }

  // SaaS keyword bonus
  const sldLower = sld.toLowerCase();
  const containsSaasKeyword = SAAS_KEYWORDS.some(keyword =>
    sldLower.includes(keyword) || sldLower === keyword
  );

  if (containsSaasKeyword) {
    score += 15;
  }

  // TLD bonus
  const tldBonus = TLD_BONUSES[tld as keyof typeof TLD_BONUSES] || 0;
  score += tldBonus;

  // Character quality bonuses
  // No hyphens or numbers bonus
  if (!/[-0-9]/.test(sld)) {
    score += 5;
  }

  // Dictionary word bonus (simple check for common patterns)
  if (isLikelyDictionaryWord(sld)) {
    score += 10;
  }

  // Ensure score is between 0-100
  return Math.min(100, Math.max(0, score));
}

function isLikelyDictionaryWord(word: string): boolean {
  // Simple heuristic: words with good vowel/consonant distribution
  const vowels = (word.match(/[aeiou]/gi) || []).length;
  const consonants = word.length - vowels;
  return vowels > 0 && consonants > 0 && word.length >= 3;
}

// Store or update a domain score
export const storeDomainScore = mutation({
  args: {
    name: v.string(),
    sld: v.string(),
    tld: v.string(),
    ownerAddress: v.optional(v.string()),
    expiresAt: v.string(),
    tokenId: v.optional(v.string()),
    networkId: v.optional(v.string()),
    registrarIanaId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const domainData: DomainData = {
      name: args.name,
      sld: args.sld,
      tld: args.tld,
      ownerAddress: args.ownerAddress,
      expiresAt: args.expiresAt,
      tokenId: args.tokenId,
      networkId: args.networkId,
      registrarIanaId: args.registrarIanaId,
    };

    const score = calculateDomainScore(domainData);
    const containsSaasKeywords = SAAS_KEYWORDS.some(keyword =>
      args.sld.toLowerCase().includes(keyword)
    );
    const supportedTld = args.tld in TLD_BONUSES;

    // Check if domain already exists
    const existing = await ctx.db
      .query("domains")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      // Update existing domain
      await ctx.db.patch(existing._id, {
        score,
        length: args.sld.length,
        containsSaasKeywords,
        supportedTld,
        ownerAddress: args.ownerAddress,
        expiresAt: args.expiresAt,
        tokenId: args.tokenId,
        networkId: args.networkId,
        registrarIanaId: args.registrarIanaId,
        lastUpdated: new Date().toISOString(),
      });
      return existing._id;
    } else {
      // Create new domain
      return await ctx.db.insert("domains", {
        name: args.name,
        sld: args.sld,
        tld: args.tld,
        score,
        length: args.sld.length,
        containsSaasKeywords,
        supportedTld,
        ownerAddress: args.ownerAddress,
        expiresAt: args.expiresAt,
        tokenId: args.tokenId,
        networkId: args.networkId,
        registrarIanaId: args.registrarIanaId,
        lastUpdated: new Date().toISOString(),
      });
    }
  },
});

// Get top scoring domains
export const getTopDomains = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("domains")
      .withIndex("by_score")
      .order("desc")
      .take(limit);
  },
});

// Get domain by name
export const getDomainByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("domains")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
  },
});

// Search domains by SLD
export const searchDomains = query({
  args: {
    sld: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("domains")
      .withIndex("by_sld", (q) => q.eq("sld", args.sld))
      .take(limit);
  },
});

// Get domains by TLD
export const getDomainsByTld = query({
  args: {
    tld: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("domains")
      .withIndex("by_tld", (q) => q.eq("tld", args.tld))
      .order("desc")
      .take(limit);
  },
});
