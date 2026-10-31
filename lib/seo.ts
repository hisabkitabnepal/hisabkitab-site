import type { Metadata } from "next";
export const siteUrl = "https://hisabkitabnepal.com.np";
export const defaultOgImage = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Hisab Kitab, financial and tax consultants in Kathmandu",
};
type Extra = {
  /** Page-specific share image (path or absolute URL). Falls back to the default. */
  image?: string;
  /** Present for articles: ISO dates such as "2026-10-06". */
  article?: { publishedTime?: string; modifiedTime?: string };
};
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  extra: Extra = {},
): Metadata {
  const url = siteUrl + path;
  const ogTitle = `${title} | Hisab Kitab`;
  const images = extra.image ? [{ url: extra.image }] : [defaultOgImage];
  const base = {
    title: ogTitle,
    description,
    url,
    siteName: "Hisab Kitab",
    locale: "en_NP",
    images,
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: extra.article
      ? { ...base, type: "article" as const, ...extra.article }
      : { ...base, type: "website" as const },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}
