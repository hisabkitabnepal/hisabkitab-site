import data from "./articles.json" with { type: "json" };
export type ReferenceArticle = {
  title: string;
  cat: string;
  date: string;
  lead: string;
  secs: { h: string; p: string[] }[];
  note: string;
  cover?: string;
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
const coverPalettes = [
  ["#ffd9e4", "#cfe0ff", "#fff1d6", "#f4ecff"],
  ["#d4f1e4", "#d6e6ff", "#fdf0d5", "#eef9f1"],
  ["#ffe3cf", "#ffd0dc", "#e6dcff", "#fff4ea"],
  ["#d3ecff", "#e3d9ff", "#d9f6ee", "#f1f8ff"],
  ["#fde7b8", "#ffd3d3", "#d8e7ff", "#fff8e6"],
  ["#e1d8ff", "#c9f0f0", "#ffe0ee", "#f6f2ff"],
  ["#d5f2d0", "#fdf1b8", "#cfe3ff", "#f4fbef"],
  ["#ffd6cc", "#f9d5f0", "#d4e4ff", "#fff1ee"],
];
// Notion-style cover: uses the article's own `cover` image when set, otherwise
// a soft gradient picked from the slug so every new article gets one automatically.
export function articleCover(slug: string) {
  const custom = getReferenceArticle(slug)?.cover;
  if (custom) return `url("${custom}")`;
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b, c, base] = coverPalettes[h % coverPalettes.length];
  return `radial-gradient(at 12% 18%, ${a} 0, transparent 58%), radial-gradient(at 88% 12%, ${b} 0, transparent 55%), radial-gradient(at 72% 92%, ${c} 0, transparent 60%), linear-gradient(${base}, ${base})`;
}
export function articleCoverStyle(slug: string) {
  const style: Record<string, string> = { "--cover": articleCover(slug) };
  if (getReferenceArticle(slug)?.cover) {
    style["--veil"] =
      "linear-gradient(rgba(8, 16, 24, 0.5), rgba(8, 16, 24, 0.62))";
    style["--ink"] = "#fff";
    style["--ink-soft"] = "rgba(255, 255, 255, 0.86)";
  }
  return style as import("react").CSSProperties;
}
