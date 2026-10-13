// ─── Canonical site + brand identity (single source of truth for SEO) ─────────
// Driven by .env (NEXT_PUBLIC_SITE_URL); trailing slash stripped. Used for
// canonical, hreflang, Open Graph, sitemap, robots and JSON-LD.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://grainngrains.org"
).replace(/\/$/, "");

// Google Search Console verification token (empty until set in .env).
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

export const BRAND_NAME = "Grain & Grains";

// Every way the brand is written — used for JSON-LD alternateName and keywords
// so the site ranks for any spelling a visitor might search.
export const BRAND_ALIASES = [
  "Grain & Grains",
  "Grain and Grains",
  "grainngrains",
  "Grain'N'Grains",
  "grain n grains",
];

export const TWITTER_HANDLE = "@grainngrains";

// Official brand profiles (from grainngrains.org) — used for JSON-LD sameAs.
export const BRAND_SOCIALS = [
  "https://www.instagram.com/grainngrains",
  "https://www.linkedin.com/company/grain-grains-coffee",
  "https://www.facebook.com/profile.php?id=61584672518944",
];

export const BRAND_EMAIL = "tradingna@grainngrains.org";
export const BRAND_PHONE = "+51 930 625 619";
