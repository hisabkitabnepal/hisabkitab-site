"use client";
import { useRouter } from "next/navigation";
import { referenceArticles, articleCoverStyle } from "@/lib/reference/articles";
import { ArticleIcon } from "./ArticleIcon";
export function ArticleCard({
  slug,
  hidden = false,
}: {
  slug: string;
  hidden?: boolean;
}) {
  const article = referenceArticles[slug];
  const router = useRouter();
  const open = () => router.push("/blog/" + slug);
  return (
    <article
      data-c={article.cat}
      data-slug={slug}
      tabIndex={0}
      role="link"
      hidden={hidden}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter") open();
      }}
    >
      <i style={articleCoverStyle(slug)}>
        <ArticleIcon slug={slug} />
      </i>
      <small>
        {article.date}{"\u2003"}{article.cat}
      </small>
      <h4>{article.title}</h4>
      <p>{article.lead}</p>
    </article>
  );
}
