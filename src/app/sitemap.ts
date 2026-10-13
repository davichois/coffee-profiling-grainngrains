import type { MetadataRoute } from "next";
import { routing } from "@/src/i18n/routing";
import { SITE_URL } from "@/src/lib/site";

// hreflang alternates for a path so Google links the translated versions.
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) languages[loc] = `${SITE_URL}/${loc}${path}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const loc of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${loc}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languagesFor("") },
    });
    entries.push({
      url: `${SITE_URL}/${loc}/peru`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: languagesFor("/peru") },
    });
  }
  return entries;
}
