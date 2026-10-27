import { notFound } from "next/navigation";
import { ReferenceLayout } from "@/components/reference/Page";
import { Article } from "@/components/reference/Article";
import {
  referenceArticles,
  getReferenceArticle,
} from "@/lib/reference/articles";
import { pageMetadata, siteUrl } from "@/lib/seo";
export function generateStaticParams() {
  return Object.keys(referenceArticles).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getReferenceArticle(slug);
  if (!article) notFound();
  return pageMetadata(article.title, article.lead, "/blog/" + slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getReferenceArticle(slug);
  if (!article) notFound();
  const structured = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.lead,
    author: { "@type": "Person", name: "Tanchho Limbu" },
    publisher: { "@type": "Organization", name: "Hisab Kitab" },
    mainEntityOfPage: siteUrl + "/blog/" + slug,
  };
  return (
    <ReferenceLayout page="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <Article slug={slug} />
    </ReferenceLayout>
  );
}
