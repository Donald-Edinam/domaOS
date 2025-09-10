import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  domains: defineTable({
    name: v.string(),
    sld: v.string(),
    tld: v.string(),
    score: v.number(),
    length: v.number(),
    containsSaasKeywords: v.boolean(),
    supportedTld: v.boolean(),
    ownerAddress: v.optional(v.string()),
    expiresAt: v.string(),
    tokenId: v.optional(v.string()),
    networkId: v.optional(v.string()),
    registrarIanaId: v.optional(v.number()),
    lastUpdated: v.string(),
  })
    .index("by_score", ["score"])
    .index("by_tld", ["tld"])
    .index("by_name", ["name"])
    .index("by_sld", ["sld"]),

  tldStats: defineTable({
    tld: v.string(),
    averageScore: v.number(),
    domainCount: v.number(),
    weeklyTrend: v.array(
      v.object({
        week: v.string(),
        averageScore: v.number(),
        count: v.number(),
      }),
    ),
    lastUpdated: v.string(),
  }).index("by_tld", ["tld"]),

  supportedTlds: defineTable({
    tld: v.string(),
    type: v.string(), // "gTLD" or "ccTLD"
    bonus: v.number(),
  }).index("by_tld", ["tld"]),

  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
});
