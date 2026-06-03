import type { MetadataRoute } from "next";
import { LOCALES } from "./i18n/config";

const BASE = "https://grainngrains.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of LOCALES) {
    entries.push({
      url: `${BASE}/${lang}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    });
    entries.push({
      url: `${BASE}/${lang}/peru`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  return entries;
}
