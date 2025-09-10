import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Comprehensive list of supported TLDs with their market value scores
const SUPPORTED_TLDS = {
  // Premium gTLDs (High value)
  'com': 100, 'org': 85, 'net': 80, 'io': 95, 'ai': 95, 'app': 90, 'dev': 88, 'tech': 85,

  // Popular gTLDs (Medium-High value)
  'biz': 70, 'info': 65, 'name': 60, 'pro': 75, 'co': 82, 'me': 78, 'tv': 75, 'cc': 70,

  // Business/Industry specific (Medium value)
  'agency': 65, 'consulting': 65, 'solutions': 65, 'services': 65, 'business': 70, 'company': 70,
  'finance': 75, 'bank': 80, 'legal': 75, 'health': 75, 'store': 80, 'shop': 80, 'market': 75,

  // Tech/Innovation (Medium-High value)
  'cloud': 85, 'digital': 80, 'online': 75, 'software': 80, 'crypto': 90, 'blockchain': 90,

  // Geographic ccTLDs
  'us': 60, 'uk': 70, 'ca': 65, 'au': 65, 'de': 70, 'fr': 65,

  // Default for other TLDs
  'default': 40
} as const;

// Get TLD score with fallback to default
function getTLDScore(tld: string): number {
  return SUPPORTED_TLDS[tld.toLowerCase() as keyof typeof SUPPORTED_TLDS] || SUPPORTED_TLDS.default;
}

// Enhanced tokenization step
const tokenizeDomainsStep = createStep({
  id: "tokenize-domains-enhanced",
  description: "Advanced tokenization of domain names with comprehensive analysis",
  inputSchema: z.object({
    domains: z.array(z.string()),
  }),
  outputSchema: z.object({
    tokenizedDomains: z.array(z.object({
      domain: z.string(),
      tokens: z.array(z.string()),
      length: z.number(),
      hasNumbers: z.boolean(),
      hasHyphens: z.boolean(),
      tld: z.string(),
      tldScore: z.number(),
    })),
  }),
  execute: async ({ inputData }) => {
    const { domains } = inputData;

    const tokenizedDomains = domains.map(domain => {
      // Split domain into main part and TLD
      const parts = domain.split('.');
      const tld = parts.pop() || '';
      const mainDomain = parts.join('.');

      // Advanced tokenization
      const tokens = mainDomain
        .toLowerCase()
        .split(/[-_]/) // Split on hyphens and underscores
        .flatMap(token => token.split(/(?=[A-Z])/)) // Split on camelCase
        .flatMap(token => token.split(/(?=\d)|(?<=\d)(?=\D)/)) // Split on number boundaries
        .filter(token => token.length > 0)
        .map(token => token.toLowerCase());

      return {
        domain,
        tokens,
        length: mainDomain.length,
        hasNumbers: /\d/.test(mainDomain),
        hasHyphens: /-/.test(mainDomain),
        tld,
        tldScore: getTLDScore(tld),
      };
    });

    return { tokenizedDomains };
  },
});

// Enhanced market analysis step
const analyzeMarketValueStep = createStep({
  id: "analyze-market-value-enhanced",
  description: "Advanced market value analysis with comprehensive TLD and keyword scoring",
  inputSchema: z.object({
    tokenizedDomains: z.array(z.object({
      domain: z.string(),
      tokens: z.array(z.string()),
      length: z.number(),
      hasNumbers: z.boolean(),
      hasHyphens: z.boolean(),
      tld: z.string(),
      tldScore: z.number(),
    })),
  }),
  outputSchema: z.object({
    analysis: z.array(z.object({
      domain: z.string(),
      tokens: z.array(z.string()),
      marketScore: z.number(),
      acquisitionPotential: z.enum(['high', 'medium', 'low']),
      reasoning: z.string(),
      keyFactors: z.array(z.string()),
      estimatedValue: z.string(),
      tldInfo: z.object({
        tld: z.string(),
        score: z.number(),
        tier: z.string(),
      }),
    })),
  }),
  execute: async ({ inputData }) => {
    const { tokenizedDomains } = inputData;

    const analysis = tokenizedDomains.map(tokenizedDomain => {
      let marketScore = 0;
      const keyFactors = [];

      // Enhanced length scoring
      if (tokenizedDomain.length <= 4) {
        marketScore += 35;
        keyFactors.push('Ultra-short length (premium)');
      } else if (tokenizedDomain.length <= 6) {
        marketScore += 25;
        keyFactors.push('Short length (highly valuable)');
      } else if (tokenizedDomain.length <= 10) {
        marketScore += 15;
        keyFactors.push('Moderate length');
      } else if (tokenizedDomain.length <= 15) {
        marketScore += 5;
        keyFactors.push('Long length');
      } else {
        marketScore -= 5;
        keyFactors.push('Very long length (reduces value)');
      }

      // Advanced keyword analysis
      const highValueKeywords = ['ai', 'crypto', 'blockchain', 'nft', 'web3', 'defi', 'meta', 'vr', 'ar', 'cloud', 'saas', 'api'];
      const mediumValueKeywords = ['app', 'web', 'tech', 'digital', 'online', 'mobile', 'smart', 'pro', 'global', 'secure'];
      const businessKeywords = ['shop', 'store', 'market', 'trade', 'pay', 'finance', 'bank', 'invest', 'consulting'];

      const hasHighValue = tokenizedDomain.tokens.some(token =>
        highValueKeywords.includes(token.toLowerCase())
      );
      const hasMediumValue = tokenizedDomain.tokens.some(token =>
        mediumValueKeywords.includes(token.toLowerCase())
      );
      const hasBusiness = tokenizedDomain.tokens.some(token =>
        businessKeywords.includes(token.toLowerCase())
      );

      if (hasHighValue) {
        marketScore += 30;
        keyFactors.push('Contains high-value tech keywords');
      } else if (hasMediumValue) {
        marketScore += 20;
        keyFactors.push('Contains popular keywords');
      } else if (hasBusiness) {
        marketScore += 15;
        keyFactors.push('Contains business-related keywords');
      }

      // TLD scoring using comprehensive database
      const tldContribution = Math.round(tokenizedDomain.tldScore * 0.25);
      marketScore += tldContribution;

      let tldTier = 'standard';
      if (tokenizedDomain.tldScore >= 90) {
        tldTier = 'premium';
        keyFactors.push(`${tokenizedDomain.tld.toUpperCase()} TLD (premium tier)`);
      } else if (tokenizedDomain.tldScore >= 75) {
        tldTier = 'high-value';
        keyFactors.push(`${tokenizedDomain.tld.toUpperCase()} TLD (high value)`);
      } else if (tokenizedDomain.tldScore >= 60) {
        tldTier = 'good-value';
        keyFactors.push(`${tokenizedDomain.tld.toUpperCase()} TLD (good value)`);
      } else {
        keyFactors.push(`${tokenizedDomain.tld.toUpperCase()} TLD (standard)`);
      }

      // Brandability analysis
      const pronounceableWords = tokenizedDomain.tokens.filter(token =>
        token.length >= 3 && !/^\d+$/.test(token)
      );

      if (pronounceableWords.length <= 2 && pronounceableWords.every(word => word.length <= 8)) {
        marketScore += 10;
        keyFactors.push('High brandability (memorable)');
      }

      // Dictionary words bonus
      const commonWords = ['home', 'house', 'car', 'food', 'game', 'news', 'book', 'music', 'video', 'photo'];
      const hasDictionaryWords = tokenizedDomain.tokens.some(token =>
        commonWords.includes(token.toLowerCase())
      );

      if (hasDictionaryWords) {
        marketScore += 8;
        keyFactors.push('Contains dictionary words');
      }

      // Enhanced penalties
      if (tokenizedDomain.hasNumbers) {
        if (tokenizedDomain.tokens.some(token => /^(24|365|24h|7|247)$/i.test(token))) {
          marketScore -= 5;
          keyFactors.push('Contains business numbers (minor impact)');
        } else {
          marketScore -= 12;
          keyFactors.push('Contains numbers (reduces brandability)');
        }
      }

      if (tokenizedDomain.hasHyphens) {
        marketScore -= 18;
        keyFactors.push('Contains hyphens (significantly reduces value)');
      }

      // SEO potential
      if (tokenizedDomain.tokens.length <= 3 && !tokenizedDomain.hasNumbers && !tokenizedDomain.hasHyphens) {
        marketScore += 5;
        keyFactors.push('Good SEO potential');
      }

      // Ensure score bounds
      marketScore = Math.max(0, Math.min(100, marketScore));

      // Determine acquisition potential
      let acquisitionPotential: 'high' | 'medium' | 'low';
      if (marketScore >= 75) {
        acquisitionPotential = 'high';
      } else if (marketScore >= 45) {
        acquisitionPotential = 'medium';
      } else {
        acquisitionPotential = 'low';
      }

      // Generate comprehensive reasoning
      const reasoning = `This domain scores ${marketScore}/100 based on comprehensive analysis including length (${tokenizedDomain.length} chars), TLD value (.${tokenizedDomain.tld} - ${tokenizedDomain.tldScore}/100), keyword relevance, brandability, and structural factors. ${
        acquisitionPotential === 'high' ? 'Excellent acquisition candidate with strong commercial potential and high resale value. Recommended for immediate acquisition.' :
        acquisitionPotential === 'medium' ? 'Good acquisition candidate with decent commercial potential and moderate investment risk. Consider for portfolio diversification.' :
        'Lower priority acquisition candidate. May be suitable for specific use cases or long-term speculation with limited budget allocation.'
      }`;

      // Market-based value estimation
      const estimatedValue =
        marketScore >= 85 ? '$50K - $500K+' :
        marketScore >= 75 ? '$10K - $50K' :
        marketScore >= 60 ? '$2K - $10K' :
        marketScore >= 45 ? '$500 - $2K' :
        marketScore >= 30 ? '$100 - $500' :
        '$10 - $100';

      return {
        domain: tokenizedDomain.domain,
        tokens: tokenizedDomain.tokens,
        marketScore,
        acquisitionPotential,
        reasoning,
        keyFactors,
        estimatedValue,
        tldInfo: {
          tld: tokenizedDomain.tld,
          score: tokenizedDomain.tldScore,
          tier: tldTier,
        },
      };
    });

    return { analysis };
  },
});

// Enhanced domain tokenization workflow
export const domainTokenizationWorkflowEnhanced = createWorkflow({
  id: "domain-tokenization-analysis-enhanced",
  description: "Advanced domain analysis with comprehensive TLD database and market intelligence",
  inputSchema: z.object({
    domains: z.array(z.string()),
  }),
  outputSchema: z.object({
    analysis: z.array(z.object({
      domain: z.string(),
      tokens: z.array(z.string()),
      marketScore: z.number(),
      acquisitionPotential: z.enum(['high', 'medium', 'low']),
      reasoning: z.string(),
      keyFactors: z.array(z.string()),
      estimatedValue: z.string(),
      tldInfo: z.object({
        tld: z.string(),
        score: z.number(),
        tier: z.string(),
      }),
    })),
  }),
})
  .then(tokenizeDomainsStep)
  .then(analyzeMarketValueStep)
  .commit();
