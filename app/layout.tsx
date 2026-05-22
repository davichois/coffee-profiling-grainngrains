import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grainngrains.com"),
  title: {
    default: "Grain'N'Grains — Coffee Flavor Profiling",
    template: "%s | Grain'N'Grains",
  },
  description:
    "Interactive coffee flavor wheel for specialty coffee tasting and profiling. Explore the full SCA flavor taxonomy — from fruity and floral to roasted and spiced.",
  keywords: [
    "coffee flavor wheel",
    "specialty coffee",
    "coffee tasting",
    "flavor profiling",
    "SCA flavor wheel",
    "coffee cupping",
    "tasting notes",
    "grain n grains",
    "coffee profiling",
  ],
  authors: [{ name: "David Prada" }],
  creator: "David Prada",
  publisher: "Grain'N'Grains",
  category: "Food & Drink",
  openGraph: {
    type: "website",
    siteName: "Grain'N'Grains",
    title: "Grain'N'Grains — Coffee Flavor Profiling",
    description:
      "Interactive coffee flavor wheel for specialty coffee tasting and profiling. Explore the full SCA flavor taxonomy.",
    locale: "en_US",
    url: "https://grainngrains.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grain'N'Grains — Coffee Flavor Profiling",
    description:
      "Interactive coffee flavor wheel for specialty coffee tasting and profiling.",
    creator: "@grainngrains",
    site: "@grainngrains",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
