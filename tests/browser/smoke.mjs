import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.SITE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const rows = [];
const oldArticles = [
  "profit-is-not-cash",
  "monthly-accounting-checklist",
  "prepare-for-accounting-consultation",
  "register-a-business-nepal",
  "closing-a-business-nepal",
  "annual-company-filings-tax-clearance",
];
const routes = [
  "/",
  "/services",
  "/tools",
  "/about",
  "/blog",
  "/free-consultation",
  "/monthly-plan",
  "/register-business",
  "/sample-work",
  "/privacy",
  ...oldArticles.map((s) => "/blog/" + s),
];
try {
  for (const route of routes) {
    const page = await context.newPage(),
      errors = [],
      failures = [],
      cancelledPrefetches = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("requestfailed", (r) => {
      const record = { url: r.url(), error: r.failure()?.errorText };
      // Next cancels speculative RSC streams across separate root layouts.
      // Keep these in the report; real navigation and asset failures still fail.
      if (
        record.error === "net::ERR_ABORTED" &&
        r.headers()["next-router-prefetch"] === "1"
      )
        cancelledPrefetches.push(record);
      else failures.push(record);
    });
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const response = await page.goto(new URL(route, base).href, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route + " HTTP");
    await page.evaluate(() => document.fonts.ready);
    const heading = await page.locator("h1").first().innerText();
    assert.ok(heading.trim(), route + " heading");
    assert.deepEqual(errors, [], route + " console");
    assert.deepEqual(failures, [], route + " requests");
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images.filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
      );
    assert.deepEqual(broken, [], route + " images");
    if (route === "/monthly-plan") {
      await page.locator('a[href*="plan=growth"]').first().click();
      await page.waitForURL("**/free-consultation?plan=growth", {
        waitUntil: "networkidle",
      });
      assert.equal(
        await page.locator("h1").innerText(),
        "Get in touch with us",
      );
      assert.deepEqual(errors, [], "Legacy plan to booking navigation console");
      assert.deepEqual(
        failures,
        [],
        "Legacy plan to booking navigation requests",
      );
    }
    rows.push({
      route,
      status: response.status(),
      heading,
      errors,
      failures,
      cancelledPrefetches,
    });
    console.log(`PASS ${route}: ${heading.replace(/\n/g, " ")}`);
    await page.close();
  }
  for (const [hash, heading] of [
    ["#about", "A business has enough moving parts."],
    ["#services", "Services for every stage of your business."],
    ["#calculator", "Know your tax before you file."],
    ["#blog", "Notes on running a business in Nepal."],
    ["#book", "Get in touch with us"],
    ["#blog/closing-a-business-properly", "Closing a business properly"],
  ]) {
    const page = await context.newPage();
    await page.goto(new URL("/" + hash, base).href, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(600);
    assert.equal(
      (await page.locator("h1").first().innerText())
        .replace(/\s+/g, " ")
        .trim(),
      heading,
      "legacy reference hash " + hash,
    );
    rows.push({ hash, finalUrl: page.url(), heading });
    await page.close();
  }
  for (const route of ["/robots.txt", "/sitemap.xml"]) {
    const response = await context.request.get(new URL(route, base).href);
    assert.equal(response.status(), 200, route);
    rows.push({ route, status: response.status() });
  }
  for (const route of ["/does-not-exist", "/blog/not-an-article"]) {
    const response = await context.request.get(new URL(route, base).href);
    assert.equal(response.status(), 404, route);
    rows.push({ route, status: response.status() });
  }
  // Actual mobile breakpoint behavior; no fabricated hamburger menu.
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(base, { waitUntil: "networkidle" });
  assert.equal(await mobile.locator(".nav-links").isVisible(), false);
  await mobile.locator(".site-foot a").filter({ hasText: "About us" }).click();
  await mobile.waitForLoadState("networkidle");
  assert.equal(
    (await mobile.locator("h1").innerText()).replace(/\s+/g, " "),
    "A business has enough moving parts.",
  );
  assert.equal(
    await mobile.evaluate(() => document.documentElement.scrollWidth),
    390,
  );
  rows.push({ mobileFooterNavigation: "passed" });
} finally {
  const out = path.resolve(process.env.VISUAL_OUTPUT || "verification-output");
  await mkdir(out, { recursive: true });
  await writeFile(path.join(out, "smoke.json"), JSON.stringify(rows, null, 2));
  await browser.close();
}
console.log(
  "Route, asset, console, hash compatibility and mobile navigation smoke checks passed.",
);
