import data from "./articles.json" with { type: "json" };
export type ReferenceArticle = {
  title: string;
  cat: string;
  date: string;
  lead: string;
  secs: { h: string; p: string[] }[];
  note: string;
  cover?: string;
  /** ISO date (YYYY-MM-DD). Optional; omitted from markup when empty. */
  published?: string | null;
  modified?: string | null;
};
export const referenceArticles: Record<string, ReferenceArticle> =
// Stored oldest first (new articles are added at the bottom); newest comes first here.
  Object.fromEntries(
    data.articles.map(({ slug, ...article }) => [slug, article]).reverse(),
  );
export function getReferenceArticle(slug: string) {
  return Object.prototype.hasOwnProperty.call(referenceArticles, slug)
    ? referenceArticles[slug]
    : undefined;
}
export function relatedArticles(slug: string) {
  const article = getReferenceArticle(slug);
  if (!article) return [];
  return Object.keys(referenceArticles)
    .filter((key) => key !== slug)
    .sort(
      (a, b) =>
        Number(referenceArticles[a].cat !== article.cat) -
        Number(referenceArticles[b].cat !== article.cat),
    )
    .slice(0, 3);
}
export function readingMinutes(article: ReferenceArticle) {
  return Math.max(
    2,
    Math.round(
      article.secs.reduce((n, s) => n + s.p.join(" ").split(/\s+/).length, 0) /
        200,
    ),
  );
}
// Articles without their own cover use this artwork, so nothing falls back to a gradient.
export const defaultCover = "/blog/default-cover.webp";
export function articleCover(slug: string) {
  const custom = getReferenceArticle(slug)?.cover;
  return `url("${custom || defaultCover}")`;
}
// Uploaded photos get a strong dark veil so titles stay readable. The default
// artwork is already dark, so it only needs a light one and its colour shows through.
export function articleCoverStyle(slug: string) {
  const custom = Boolean(getReferenceArticle(slug)?.cover);
  return {
    "--cover": articleCover(slug),
    "--veil": custom
      ? "linear-gradient(rgba(8, 16, 24, 0.5), rgba(8, 16, 24, 0.62))"
      : "linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18))",
    "--ink": "#fff",
    "--ink-soft": "rgba(255, 255, 255, 0.86)",
  } as import("react").CSSProperties;
}
