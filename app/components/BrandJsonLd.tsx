import type { Locale } from "../i18n/config";
import { SEO } from "../i18n/seo";
import {
  SITE_URL,
  BRAND_NAME,
  BRAND_ALIASES,
  BRAND_SOCIALS,
  BRAND_EMAIL,
  BRAND_PHONE,
} from "../config/site";

// Structured data so search engines understand the brand ("Grain & Grains",
// "Grain and Grains", "grainngrains") and the flavor-wheel web app.
export function BrandJsonLd({ locale }: { locale: Locale }) {
  const seo = SEO[locale];
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
        name: seo.home.title,
        description: seo.home.description,
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
