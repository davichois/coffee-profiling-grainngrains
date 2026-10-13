import { getTranslations } from "next-intl/server";
import type { Locale } from "@/src/i18n/routing";
import {
  SITE_URL,
  BRAND_NAME,
  BRAND_ALIASES,
  BRAND_SOCIALS,
  BRAND_EMAIL,
  BRAND_PHONE,
} from "@/src/lib/site";

// Structured data so search engines understand the brand ("Grain & Grains",
// "Grain and Grains", "grainngrains") and the flavor-wheel web app.
export async function BrandJsonLd({ locale }: { locale: Locale }) {
  const seo = await getTranslations("seo");
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: BRAND_NAME,
        alternateName: BRAND_ALIASES,
        url: SITE_URL,
        logo: `${SITE_URL}/grainngrains.svg`,
        sameAs: BRAND_SOCIALS,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: BRAND_EMAIL,
          telephone: BRAND_PHONE,
        },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: BRAND_NAME,
        alternateName: BRAND_ALIASES,
        url: SITE_URL,
        inLanguage: locale,
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebApplication",
        name: seo("homeTitle"),
        description: seo("homeDescription"),
        url: `${SITE_URL}/${locale}`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        isPartOf: { "@id": siteId },
        publisher: { "@id": orgId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
