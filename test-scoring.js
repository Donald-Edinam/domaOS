// Simple test for the domain scoring algorithm
// Run with: node test-scoring.js

// Copy the scoring logic for testing
const SAAS_KEYWORDS = [
  "ai",
  "app",
  "api",
  "cloud",
  "dev",
  "tech",
  "software",
  "platform",
  "saas",
  "service",
  "tool",
  "tools",
  "hub",
  "lab",
  "labs",
  "studio",
  "build",
  "maker",
  "create",
  "data",
  "analytics",
  "smart",
  "auto",
  "digital",
  "online",
  "web",
  "net",
  "code",
  "pay",
  "shop",
  "store",
  "mail",
  "chat",
  "social",
  "connect",
  "sync",
  "flow",
  "stream",
  "dashboard",
  "admin",
  "manage",
  "track",
  "monitor",
  "secure",
  "pro",
];

const TLD_BONUSES = {
  ai: 25,
  io: 20,
  dev: 20,
  cloud: 25,
  tech: 15,
  app: 20,
  co: 15,
  com: 10,
  org: 5,
  net: 5,
};

function calculateDomainScore(domain) {
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
  const containsSaasKeyword = SAAS_KEYWORDS.some(
    (keyword) => sldLower.includes(keyword) || sldLower === keyword,
  );

  if (containsSaasKeyword) {
    score += 15;
  }

  // TLD bonus
  const tldBonus = TLD_BONUSES[tld] || 0;
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

function isLikelyDictionaryWord(word) {
  // Simple heuristic: words with good vowel/consonant distribution
  const vowels = (word.match(/[aeiou]/gi) || []).length;
  const consonants = word.length - vowels;
  return vowels > 0 && consonants > 0 && word.length >= 3;
}

// Test cases
const testDomains = [
  { name: "ai.ai", sld: "ai", tld: "ai" },
  { name: "app.dev", sld: "app", tld: "dev" },
  { name: "cloud.io", sld: "cloud", tld: "io" },
  { name: "startup.com", sld: "startup", tld: "com" },
  { name: "verylongdomainname.org", sld: "verylongdomainname", tld: "org" },
  { name: "pay.app", sld: "pay", tld: "app" },
  { name: "data-hub.tech", sld: "data-hub", tld: "tech" },
  { name: "example123.net", sld: "example123", tld: "net" },
  { name: "build.cloud", sld: "build", tld: "cloud" },
  { name: "hello.world", sld: "hello", tld: "world" },
];

console.log("🔥 Domain Scoring Algorithm Test\n");
console.log("Format: Domain Name | Score | Breakdown");
console.log("=".repeat(60));

testDomains.forEach((domain) => {
  const score = calculateDomainScore(domain);
  const sldLower = domain.sld.toLowerCase();
  const hasSaasKeyword = SAAS_KEYWORDS.some(
    (keyword) => sldLower.includes(keyword) || sldLower === keyword,
  );
  const tldBonus = TLD_BONUSES[domain.tld] || 0;

  let breakdown = [];
  breakdown.push("Base: 50");

  // Length bonus
  const length = domain.sld.length;
  if (length <= 3) breakdown.push("Length(≤3): +30");
  else if (length <= 5) breakdown.push("Length(4-5): +20");
  else if (length <= 7) breakdown.push("Length(6-7): +10");
  else if (length <= 10) breakdown.push("Length(8-10): +0");
  else breakdown.push("Length(>10): -10");

  if (hasSaasKeyword) breakdown.push("SaaS: +15");
  if (tldBonus > 0) breakdown.push(`TLD(.${domain.tld}): +${tldBonus}`);
  if (!/[-0-9]/.test(domain.sld)) breakdown.push("Clean: +5");
  if (isLikelyDictionaryWord(domain.sld)) breakdown.push("Word: +10");

  const scoreColor =
    score >= 80 ? "🟢" : score >= 60 ? "🔵" : score >= 40 ? "🟡" : "🔴";

  console.log(
    `${domain.name.padEnd(25)} | ${scoreColor} ${score.toString().padStart(3)} | ${breakdown.join(", ")}`,
  );
});

console.log("\n" + "=".repeat(60));
console.log(
  "Legend: 🟢 Premium (80+) | 🔵 Good (60+) | 🟡 Fair (40+) | 🔴 Basic (<40)",
);
console.log("\nScoring Factors:");
console.log("• Base Score: 50 points");
console.log("• Length: 30 (≤3), 20 (4-5), 10 (6-7), 0 (8-10), -10 (>10)");
console.log("• SaaS Keywords: +15 points");
console.log(
  "• Premium TLDs: .ai(+25), .cloud(+25), .io(+20), .dev(+20), .app(+20)",
);
console.log("• Quality: +5 (no hyphens/numbers), +10 (dictionary word)");
