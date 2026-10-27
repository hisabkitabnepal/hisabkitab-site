import test from "node:test";
import assert from "node:assert/strict";
import { getReferenceArticle, referenceArticles, relatedArticles, readingMinutes } from "../../lib/reference/articles.ts";

test("unknown and inherited article slugs are absent", () => {
  for (const slug of ["missing-article", "constructor", "toString", "__proto__", "hasOwnProperty"]) {
    assert.equal(getReferenceArticle(slug), undefined, slug);
    assert.deepEqual(relatedArticles(slug), [], slug);
  }
});

test("real articles and original reading times remain available", () => {
  for (const [slug, article] of Object.entries(referenceArticles)) {
    assert.equal(getReferenceArticle(slug), article);
    assert.equal(readingMinutes(article), 2, slug);
    assert.equal(relatedArticles(slug).length, 3);
    assert.ok(!relatedArticles(slug).includes(slug));
  }
});
