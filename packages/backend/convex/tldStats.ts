import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Update TLD statistics
export const updateTldStats = mutation({
  args: { tld: v.string() },
  handler: async (ctx, args) => {
    // Get all domains for this TLD
    const domains = await ctx.db
      .query("domains")
      .withIndex("by_tld", (q) => q.eq("tld", args.tld))
      .collect();

    if (domains.length === 0) {
      return null;
    }

    // Calculate average score
    const totalScore = domains.reduce((sum, domain) => sum + domain.score, 0);
    const averageScore = totalScore / domains.length;

    // Get current week string
    const currentWeek = getCurrentWeekString();

    // Check if TLD stats already exist
    const existing = await ctx.db
      .query("tldStats")
      .withIndex("by_tld", (q) => q.eq("tld", args.tld))
      .unique();

    if (existing) {
      // Update existing stats
      const weeklyTrend = existing.weeklyTrend || [];

      // Update or add current week
      const currentWeekIndex = weeklyTrend.findIndex(w => w.week === currentWeek);
      if (currentWeekIndex >= 0) {
        weeklyTrend[currentWeekIndex] = {
          week: currentWeek,
          averageScore,
          count: domains.length,
        };
      } else {
        weeklyTrend.push({
          week: currentWeek,
          averageScore,
          count: domains.length,
        });

        // Keep only last 12 weeks
        if (weeklyTrend.length > 12) {
          weeklyTrend.sort((a, b) => a.week.localeCompare(b.week));
          weeklyTrend.splice(0, weeklyTrend.length - 12);
        }
      }

      await ctx.db.patch(existing._id, {
        averageScore,
        domainCount: domains.length,
        weeklyTrend,
        lastUpdated: new Date().toISOString(),
      });

      return existing._id;
    } else {
      // Create new stats
      return await ctx.db.insert("tldStats", {
        tld: args.tld,
        averageScore,
        domainCount: domains.length,
        weeklyTrend: [{
          week: currentWeek,
          averageScore,
          count: domains.length,
        }],
        lastUpdated: new Date().toISOString(),
      });
    }
  },
});

// Get TLD statistics
export const getTldStats = query({
  args: { tld: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tldStats")
      .withIndex("by_tld", (q) => q.eq("tld", args.tld))
      .unique();
  },
});

// Get all TLD statistics ordered by average score
export const getAllTldStats = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const stats = await ctx.db.query("tldStats").collect();

    return stats
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, limit);
  },
});

// Get TLD trends for charts
export const getTldTrends = query({
  args: {
    tlds: v.array(v.string()),
    weeks: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const weeks = args.weeks || 8;
    const trends = [];

    for (const tld of args.tlds) {
      const stats = await ctx.db
        .query("tldStats")
        .withIndex("by_tld", (q) => q.eq("tld", tld))
        .unique();

      if (stats && stats.weeklyTrend) {
        const recentTrends = stats.weeklyTrend
          .sort((a, b) => b.week.localeCompare(a.week))
          .slice(0, weeks)
          .reverse();

        trends.push({
          tld,
          trend: recentTrends,
          currentScore: stats.averageScore,
          domainCount: stats.domainCount,
        });
      }
    }

    return trends;
  },
});

// Initialize supported TLDs with bonuses
export const initializeSupportedTlds = mutation({
  args: {},
  handler: async (ctx) => {
    const supportedTlds = [
      // Premium TLDs
      { tld: "ai", type: "ccTLD", bonus: 25 },
      { tld: "io", type: "ccTLD", bonus: 20 },
      { tld: "dev", type: "gTLD", bonus: 20 },
      { tld: "cloud", type: "gTLD", bonus: 25 },
      { tld: "tech", type: "gTLD", bonus: 15 },
      { tld: "app", type: "gTLD", bonus: 20 },
      { tld: "co", type: "ccTLD", bonus: 15 },

      // Standard TLDs
      { tld: "com", type: "gTLD", bonus: 10 },
      { tld: "org", type: "gTLD", bonus: 5 },
      { tld: "net", type: "gTLD", bonus: 5 },

      // Other popular TLDs
      { tld: "xyz", type: "gTLD", bonus: 5 },
      { tld: "me", type: "ccTLD", bonus: 10 },
      { tld: "ly", type: "ccTLD", bonus: 8 },
      { tld: "sh", type: "ccTLD", bonus: 12 },
      { tld: "gg", type: "ccTLD", bonus: 10 },
    ];

    const results = [];
    for (const tld of supportedTlds) {
      // Check if already exists
      const existing = await ctx.db
        .query("supportedTlds")
        .withIndex("by_tld", (q) => q.eq("tld", tld.tld))
        .unique();

      if (!existing) {
        const id = await ctx.db.insert("supportedTlds", tld);
        results.push(id);
      }
    }

    return results;
  },
});

// Get supported TLDs
export const getSupportedTlds = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("supportedTlds").collect();
  },
});

// Helper function to get current week string (YYYY-WW format)
function getCurrentWeekString(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-${week.toString().padStart(2, '0')}`;
}
