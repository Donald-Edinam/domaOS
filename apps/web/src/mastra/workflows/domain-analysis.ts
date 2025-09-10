import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Comprehensive list of supported TLDs with their market value scores
const SUPPORTED_TLDS = {
  // Premium gTLDs (High value)
  com: 100,
  org: 85,
  net: 80,
  io: 95,
  ai: 95,
  app: 90,
  dev: 88,
  tech: 85,

  // Popular gTLDs (Medium-High value)
  biz: 70,
  info: 65,
  name: 60,
  pro: 75,
  co: 82,
  me: 78,
  tv: 75,
  cc: 70,

  // Business/Industry specific (Medium value)
  agency: 65,
  consulting: 65,
  solutions: 65,
  services: 65,
  business: 70,
  company: 70,
  enterprises: 60,
  group: 60,
  finance: 75,
  bank: 80,
  insurance: 70,
  investment: 70,
  legal: 75,
  lawyer: 75,
  attorney: 75,
  health: 75,
  healthcare: 75,
  medical: 75,
  clinic: 70,
  education: 70,
  university: 70,
  school: 65,
  academy: 65,
  store: 80,
  shop: 80,
  market: 75,
  buy: 70,
  sale: 65,

  // Creative/Media (Medium value)
  design: 70,
  art: 65,
  gallery: 60,
  studio: 70,
  media: 70,
  news: 75,
  blog: 65,
  website: 60,
  photo: 60,
  video: 65,
  music: 65,
  film: 65,

  // Tech/Innovation (Medium-High value)
  cloud: 85,
  digital: 80,
  online: 75,
  web: 70,
  software: 80,
  code: 85,
  data: 80,
  network: 75,
  crypto: 90,
  blockchain: 90,

  // Geographic ccTLDs (Variable value)
  us: 60,
  uk: 70,
  ca: 65,
  au: 65,
  de: 70,
  fr: 65,
  jp: 65,
  kr: 60,
  in: 60,
  br: 55,
  mx: 55,

  // Default for other TLDs
  default: 40,
};

// Get TLD score with fallback to default
function getTLDScore(tld: string): number {
  return (
    SUPPORTED_TLDS[tld.toLowerCase() as keyof typeof SUPPORTED_TLDS] ||
    SUPPORTED_TLDS.default
  );
}

// Step to tokenize domain names
const tokenizeDomainsStep = createStep({
  id: "tokenize-domains",
  description: "Tokenize domain names and analyze their components",
  inputSchema: z.object({
    domains: z.array(z.string()),
  }),
  outputSchema: z.object({
    tokenizedDomains: z.array(
      z.object({
        domain: z.string(),
        tokens: z.array(z.string()),
        length: z.number(),
        hasNumbers: z.boolean(),
        hasHyphens: z.boolean(),
        tld: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    const { domains } = inputData;

    const tokenizedDomains = domains.map((domain) => {
      // Split domain into main part and TLD
      const parts = domain.split(".");
      const tld = parts.pop() || "";
      const mainDomain = parts.join(".");

      // Tokenize the main domain
      const tokens = mainDomain
        .toLowerCase()
        .split(/[-_]/) // Split on hyphens and underscores
        .flatMap(
          (token) => token.split(/(?=[A-Z])/), // Split on camelCase
        )
        .flatMap(
          (token) => token.split(/(?=\d)|(?<=\d)(?=\D)/), // Split on number boundaries
        )
        .filter((token) => token.length > 0);

      return {
        domain,
        tokens,
        length: mainDomain.length,
        hasNumbers: /\d/.test(mainDomain),
        hasHyphens: /-/.test(mainDomain),
        tld,
      };
    });

    return { tokenizedDomains };
  },
});

// Step to analyze market value and trends
const analyzeMarketValueStep = createStep({
  id: "analyze-market-value",
  description:
    "Analyze market value and acquisition potential of tokenized domains",
  inputSchema: z.object({
    tokenizedDomains: z.array(
      z.object({
        domain: z.string(),
        tokens: z.array(z.string()),
        length: z.number(),
        hasNumbers: z.boolean(),
        hasHyphens: z.boolean(),
        tld: z.string(),
      }),
    ),
  }),
  outputSchema: z.object({
    analysis: z.array(
      z.object({
        domain: z.string(),
        tokens: z.array(z.string()),
        marketScore: z.number(),
        acquisitionPotential: z.enum(["high", "medium", "low"]),
        reasoning: z.string(),
        keyFactors: z.array(z.string()),
        estimatedValue: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    const { tokenizedDomains } = inputData;

    const analysis = tokenizedDomains.map((tokenizedDomain) => {
      let marketScore = 0;
      const keyFactors = [];

      // Length scoring (shorter is better)
      if (tokenizedDomain.length <= 6) {
        marketScore += 30;
        keyFactors.push("Short length (premium)");
      } else if (tokenizedDomain.length <= 10) {
        marketScore += 20;
        keyFactors.push("Moderate length");
      } else {
        marketScore += 5;
        keyFactors.push("Long length");
      }

      // Token analysis
      const commonWords = [
        "app",
        "web",
        "tech",
        "digital",
        "online",
        "ai",
        "crypto",
        "nft",
        "meta",
      ];
      const hasCommonWords = tokenizedDomain.tokens.some((token) =>
        commonWords.includes(token.toLowerCase()),
      );

      if (hasCommonWords) {
        marketScore += 25;
        keyFactors.push("Contains trending keywords");
      }

      // TLD analysis
      if (tokenizedDomain.tld === "com") {
        marketScore += 30;
        keyFactors.push(".com TLD (premium)");
      } else if (["net", "org", "io"].includes(tokenizedDomain.tld)) {
        marketScore += 15;
        keyFactors.push(`${tokenizedDomain.tld.toUpperCase()} TLD`);
      } else {
        marketScore += 5;
        keyFactors.push(`${tokenizedDomain.tld.toUpperCase()} TLD`);
      }

      // Penalize numbers and hyphens
      if (tokenizedDomain.hasNumbers) {
        marketScore -= 10;
        keyFactors.push("Contains numbers (reduces value)");
      }

      if (tokenizedDomain.hasHyphens) {
        marketScore -= 15;
        keyFactors.push("Contains hyphens (reduces value)");
      }

      // Determine acquisition potential
      let acquisitionPotential: "high" | "medium" | "low";
      if (marketScore >= 70) {
        acquisitionPotential = "high";
      } else if (marketScore >= 40) {
        acquisitionPotential = "medium";
      } else {
        acquisitionPotential = "low";
      }

      // Generate reasoning
      const reasoning = `This domain scores ${marketScore}/100 based on length, keyword relevance, TLD quality, and structural factors. ${
        acquisitionPotential === "high"
          ? "Excellent acquisition candidate with strong commercial potential."
          : acquisitionPotential === "medium"
            ? "Good acquisition candidate with moderate commercial potential."
            : "Lower priority acquisition candidate with limited commercial potential."
      }`;

      // Estimate value range
      const estimatedValue =
        marketScore >= 80
          ? "$10K - $100K+"
          : marketScore >= 60
            ? "$1K - $10K"
            : marketScore >= 40
              ? "$100 - $1K"
              : "$10 - $100";

      return {
        domain: tokenizedDomain.domain,
        tokens: tokenizedDomain.tokens,
        marketScore,
        acquisitionPotential,
        reasoning,
        keyFactors,
        estimatedValue,
      };
    });

    return { analysis };
  },
});

// Main domain tokenization workflow
export const domainTokenizationWorkflow = createWorkflow({
  id: "domain-tokenization-analysis",
  description:
    "Analyze domain names through tokenization and market evaluation",
  inputSchema: z.object({
    domains: z.array(z.string()),
  }),
  outputSchema: z.object({
    analysis: z.array(
      z.object({
        domain: z.string(),
        tokens: z.array(z.string()),
        marketScore: z.number(),
        acquisitionPotential: z.enum(["high", "medium", "low"]),
        reasoning: z.string(),
        keyFactors: z.array(z.string()),
        estimatedValue: z.string(),
      }),
    ),
  }),
})
  .then(tokenizeDomainsStep)
  .then(analyzeMarketValueStep)
  .commit();
