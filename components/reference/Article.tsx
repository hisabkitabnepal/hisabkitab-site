import {
  referenceArticles,
  relatedArticles,
  readingMinutes,
} from "@/lib/reference/articles";
import { ArticleCard } from "./ArticleCard";
export function Article({ slug }: { slug: string }) {
  const a = referenceArticles[slug];
  return (
    <section className="pg" id="pg-article">
      <div className="ar-top">
        <div className="ar-hero">
          <div className="ar-dots" aria-hidden="true" />
          <div className="ar-head">
            <a className="ar-back" href="/blog">
              ← All articles
            </a>
            <div className="ar-meta">
              <i />
              {a.date} · {a.cat}
            </div>
            <h1 className="ar-h1">{a.title}</h1>
            <div className="ar-stats">
              <div>
                <b>Tanchho Limbu</b>
                <small>Written by</small>
              </div>
              <div>
                <b>{a.cat}</b>
                <small>Topic</small>
              </div>
              <div>
                <b>{readingMinutes(a)} min</b>
                <small>Reading time</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ar">
        <div className="ar-l">
          <div className="ar-eb">
            <i />
            IN THIS ARTICLE
          </div>
          <div className="ar-toc">
            {a.secs.map((s, i) => (
              <button className="ar-t" type="button" data-i={i} key={s.h}>
                {s.h}
              </button>
            ))}
          </div>
        </div>
        <div className="ar-r">
          {a.secs.map((s, i) => (
            <section className="ar-sec" id={`ar-${i}`} key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <div className="ar-end">
            <p className="ar-note">{a.note}</p>
            <div className="ar-cta">
              <a className="pill dark" href="/free-consultation">
                Talk to us <span className="arr">›</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="ar-more">
        <h3>Keep reading</h3>
        <div className="bl">
          {relatedArticles(slug).map((key) => (
            <ArticleCard key={key} slug={key} />
          ))}
        </div>
      </div>
    </section>
  );
}
