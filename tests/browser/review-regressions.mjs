// Run against the coordinator's rebuilt server: SITE_URL=http://127.0.0.1:4181 node --test tests/browser/review-regressions.mjs
import assert from "node:assert/strict";
import { before, after, test } from "node:test";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.SITE_URL || "http://127.0.0.1:4181";
let browser;
before(async () => {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
  });
});
after(async () => {
  await browser?.close();
});
async function open(path, motion = false) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: motion ? "no-preference" : "reduce",
  });
  // No inquiry is ever delivered by this regression suite.
  await page.route("**/api/inquiries", (route) => route.abort());
  if (motion) {
    await page.clock.install({ time: new Date("2026-10-27T00:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-27T00:00:01Z"));
  }
  await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
  return page;
}
test("booking displays Select placeholders, query context and unchecked consent", async () => {
  const page = await open(
    "/free-consultation?plan=growth&context=Please%20review%20my%20accounts.",
  );
  try {
    for (const id of ["bType", "bOwners"]) {
      assert.equal(await page.locator(`#${id}`).inputValue(), "");
      assert.equal(
        await page.locator(`#${id} option:checked`).textContent(),
        "Select",
      );
    }
    assert.equal(
      await page.locator("#bMsg").inputValue(),
      "Please review my accounts.",
    );
    assert.equal(await page.locator('[name="consent"]').isChecked(), false);
  } finally {
    await page.close();
  }
});
test("slider interruption restores unchanged sole proprietor slab amounts", async () => {
  const page = await open("/tools", true);
  try {
    await page.clock.runFor(3000);
    await page.locator('input[value="sole"]').evaluate((el) => el.click());
    await page.clock.runFor(2500);
    await page.locator("#adj").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#adj").inputValue(), "1");
    await page.locator("#calcForm").evaluate((el) => el.requestSubmit());
    await page.clock.runFor(250);
    const slab = page
      .locator("#resRows > div")
      .filter({ hasText: "First NPR 5,00,000" })
      .locator("span")
      .last();
    assert.notEqual(
      await slab.textContent(),
      "NPR 5,000",
      "count-up is in progress",
    );
    await page.keyboard.press("ArrowRight");
    await page.clock.runFor(32);
    assert.equal(await page.locator("#adj").inputValue(), "2");
    assert.deepEqual(
      await page.locator("#resRows > div > span:last-child").allTextContents(),
      [
        "NPR 45,90,000",
        "NPR 18,36,000",
        "+2%",
        "NPR 5,000",
        "NPR 20,000",
        "NPR 60,000",
        "NPR 2,50,800",
      ],
    );
    assert.equal(
      (await page.locator("#resBig").textContent()).trim(),
      "NPR 3,35,800",
    );
  } finally {
    await page.close();
  }
});
test("FAQ starts open immediately and closes through intermediate heights", async () => {
  const page = await open("/", true);
  try {
    const body = page.locator(".acc-body").first();
    assert.equal(
      await body.evaluate((el) => el.style.height),
      "auto",
      "also holds on StrictMode dev replay",
    );
    const height = await body.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    assert.ok(height > 0);
    await page
      .locator(".acc-head")
      .first()
      .evaluate((el) => el.click());
    await page.clock.runFor(200);
    const middle = await body.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    assert.ok(
      middle > 0 && middle < height,
      `close must animate: ${height} -> ${middle}`,
    );
    await page.clock.runFor(450);
    assert.equal(
      await body.evaluate((el) => el.getBoundingClientRect().height),
      0,
    );
    await page
      .locator(".acc-head")
      .first()
      .evaluate((el) => el.click());
    await page.clock.runFor(700);
    assert.equal(await body.evaluate((el) => el.style.height), "auto");
  } finally {
    await page.close();
  }
});
test("missing and prototype slugs return not-found, including metadata requests", async () => {
  const context = await browser.newContext();
  try {
    for (const slug of [
      "missing-article",
      "constructor",
      "toString",
      "__proto__",
      "hasOwnProperty",
    ]) {
      const response = await context.request.get(
        new URL(`/blog/${slug}`, base).href,
        { headers: { "User-Agent": "Googlebot" } },
      );
      assert.equal(response.status(), 404, slug);
      assert.doesNotMatch(await response.text(), /"@type":"Article"/);
    }
  } finally {
    await context.close();
  }
});
