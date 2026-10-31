import assert from "node:assert/strict";
import { test } from "node:test";
import { referenceHashTarget } from "../../lib/reference/navigation.ts";

test("reference hashes preserve pages, articles and local anchors", () => {
  assert.equal(referenceHashTarget("#top"), "/");
  assert.equal(referenceHashTarget("#book"), "/free-consultation");
  assert.equal(referenceHashTarget("#calculator"), "/tools");
  assert.equal(
    referenceHashTarget("#blog/closing-a-business-properly"),
    "/blog/closing-a-business-properly",
  );
  assert.equal(referenceHashTarget("#services-1"), null);
});
test("unknown and prototype-property hashes do not become destinations", () => {
  for (const hash of [
    "#constructor",
    "#toString",
    "#__proto__",
    "#hasOwnProperty",
    "#missing",
  ])
    assert.equal(referenceHashTarget(hash), null, hash);
});
