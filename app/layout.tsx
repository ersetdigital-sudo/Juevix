import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { ogImage } from "@/lib/metadata";
import { site } from "@/lib/site";

const inter = localFont({
  src: [
    { path: "./fonts/inter_24pt-regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/inter_24pt-medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/inter_24pt-semibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/inter_24pt-bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/inter_24pt-extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const jakarta = localFont({
  src: [
    { path: "./fonts/plusjakartasans-semibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/plusjakartasans-bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/plusjakartasans-extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const homeTitle = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: homeTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "finance",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: homeTitle,
    description: site.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: site.description,
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.language}
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
