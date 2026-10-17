import type { Metadata } from "next";
import { site } from "./site";

/** Gambar Open Graph bersama (1200x630) di public/images/brand/og-image.png */
export const ogImage = {
  url: "/images/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.tagline}`,
};

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path absolut dari root, mis. "/pln". Dipakai untuk canonical & og:url. */
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Metadata halaman yang konsisten: title, description, canonical,
 * Open Graph, dan Twitter card. Dipakai oleh semua halaman.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
