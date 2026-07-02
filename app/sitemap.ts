import type { MetadataRoute } from "next";
import { LOCALES } from "./i18n/config";
import { SITE_URL } from "./config/site";

// hreflang alternates for a path so Google links the translated versions.
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const lang of LOCALES) languages[lang] = `${SITE_URL}/${lang}${path}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languagesFor("") },
    });
    entries.push({
      url: `${SITE_URL}/${lang}/peru`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: languagesFor("/peru") },
    });
  }
  return entries;
}
