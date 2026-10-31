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
  return pageMetadata(article.title, article.lead, "/blog/" + slug, {
    image: article.cover || undefined,
    article: {
      publishedTime: article.published || undefined,
      modifiedTime: article.modified || article.published || undefined,
    },
  });
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
    ...(article.published && { datePublished: article.published }),
    ...((article.modified || article.published) && {
      dateModified: article.modified || article.published,
    }),
    ...(article.cover && { image: [siteUrl + article.cover] }),
    author: { "@type": "Person", name: "Tanchho Limbu" },
    publisher: {
      "@type": "Organization",
      name: "Hisab Kitab",
      logo: { "@type": "ImageObject", url: siteUrl + "/logo-full.webp" },
    },
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
