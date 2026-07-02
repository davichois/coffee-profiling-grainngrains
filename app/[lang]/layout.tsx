import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { LOCALES, isLocale, type Locale } from "../i18n/config";
import { SEO, OG_LOCALE } from "../i18n/seo";
import {
  SITE_URL,
  BRAND_NAME,
  TWITTER_HANDLE,
  GOOGLE_SITE_VERIFICATION,
} from "../config/site";
import { ACCESS_BLOCKED } from "../config/access";
import { AccessBlocked } from "../components/AccessBlocked";
import { BrandJsonLd } from "../components/BrandJsonLd";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const seo = SEO[locale];

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: BRAND_NAME,
    title: {
      default: seo.home.title,
      template: `%s | ${BRAND_NAME}`,
    },
    description: seo.home.description,
    authors: [{ name: "David Prada" }],
    creator: "David Prada",
    publisher: BRAND_NAME,
    category: "Food & Drink",
    openGraph: {
      type: "website",
      siteName: BRAND_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
    },
    twitter: {
      card: "summary_large_image",
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: GOOGLE_SITE_VERIFICATION
      ? { google: GOOGLE_SITE_VERIFICATION }
      : undefined,
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <BrandJsonLd locale={lang} />
        {ACCESS_BLOCKED ? <AccessBlocked locale={lang} /> : children}
      </body>
    </html>
  );
}
