import data from "./articles.json" with { type: "json" };
export type ReferenceArticle = {
  title: string;
  cat: string;
  date: string;
  lead: string;
  secs: { h: string; p: string[] }[];
  note: string;
};
export const referenceArticles: Record<string, ReferenceArticle> = data;
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
