import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/src/i18n/routing";
import { OG_LOCALE } from "@/src/i18n/locales";
import {
  SITE_URL,
  BRAND_NAME,
  TWITTER_HANDLE,
  GOOGLE_SITE_VERIFICATION,
} from "@/src/lib/site";
import { ACCESS_BLOCKED } from "@/src/lib/access";
import { AccessBlocked } from "@/src/components/AccessBlocked";
import { BrandJsonLd } from "@/src/components/BrandJsonLd";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const seo = await getTranslations({ locale: active, namespace: "seo" });

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: BRAND_NAME,
    title: {
      default: seo("homeTitle"),
      template: `%s | ${BRAND_NAME}`,
    },
    description: seo("homeDescription"),
    authors: [{ name: "David Prada" }],
    creator: "David Prada",
    publisher: BRAND_NAME,
    category: "Food & Drink",
    openGraph: {
      type: "website",
      siteName: BRAND_NAME,
      locale: OG_LOCALE[active],
      alternateLocale: routing.locales
        .filter((l) => l !== active)
        .map((l) => OG_LOCALE[l]),
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
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    verification: GOOGLE_SITE_VERIFICATION
      ? { google: GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this locale.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <BrandJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          {ACCESS_BLOCKED ? <AccessBlocked /> : children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
