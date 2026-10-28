"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { referenceArticles } from "@/lib/reference/articles";
import { ArticleCard } from "./ArticleCard";
export function Blog() {
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const open = (slug: string) => router.push("/blog/" + slug);
  const featured = "register-a-business-nepal";
  return (
    <section className="pg" id="pg-blog">
      <div className="pg-body">
        <div className="bh">
          <article
            className="bf"
            data-slug={featured}
            tabIndex={0}
            role="link"
            onClick={() => open(featured)}
            onKeyDown={(e) => {
              if (e.key === "Enter") open(featured);
            }}
          >
            <small>{referenceArticles[featured].cat}</small>
            <div>
              <h1>{referenceArticles[featured].title}</h1>
              <p>{referenceArticles[featured].lead}</p>
            </div>
          </article>
          <div className="bs">
            {[
              "closing-a-business-nepal",
              "annual-company-filings-tax-clearance",
            ].map((slug) => (
              <article
                key={slug}
                data-slug={slug}
                tabIndex={0}
                role="link"
                onClick={() => open(slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") open(slug);
                }}
              >
                <small>
                  {referenceArticles[slug].date} · {referenceArticles[slug].cat}
                </small>
                <h4>{referenceArticles[slug].title}</h4>
              </article>
            ))}
          </div>
        </div>
        <div className="bt">
          {[
            "all",
            ...Array.from(
              new Set(
                Object.keys(referenceArticles)
                  .slice(3)
                  .map((slug) => referenceArticles[slug].cat),
              ),
            ),
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              data-c={cat}
              className={filter === cat ? "on" : ""}
              aria-pressed={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "All articles" : cat}
            </button>
          ))}
        </div>
        <div className="bl">
          {Object.keys(referenceArticles)
            .slice(3)
            .map((slug) => (
              <ArticleCard
                key={slug}
                slug={slug}
                hidden={
                  filter !== "all" && referenceArticles[slug].cat !== filter
                }
              />
            ))}
        </div>
      </div>
    </section>
  );
}