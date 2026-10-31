export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { referenceArticles } from "@/lib/reference/articles";

// Only pages that should appear in search. /register-business redirects to the
// guide; /privacy and /sample-work are noindex. Dates are only given where a
// real date exists (articles), so they never change just because of a deploy.
const pages = [
  "",
  "/services",
  "/about",
  "/free-consultation",
  "/blog",
  "/tools",
  "/guides/business-structures-nepal",
  "/monthly-plan",
  "/terms-and-privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({ url: siteUrl + path })),
    ...Object.entries(referenceArticles).map(([slug, article]) => ({
      url: siteUrl + "/blog/" + slug,
      lastModified: article.modified || article.published || undefined,
    })),
  ];
}
