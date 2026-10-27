import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const mode = process.argv[2] || "reference";
const base =
  process.env.SITE_URL ||
  (mode === "reference"
    ? "http://127.0.0.1:4173/Hisab_Kitab_Site_Preview.html"
    : "http://127.0.0.1:3000");
const output = path.resolve(
  process.env.VISUAL_OUTPUT || "verification-output",
  mode,
);
const slugs = [
  "notes-on-running-a-business-in-nepal",
  "a-plain-language-guide-to-registering-a-business",
  "sole-proprietorship-or-company",
  "vat-returns-what-to-keep-ready",
  "what-tax-clearance-means",
  "reading-your-monthly-numbers",
  "preparing-for-your-audit",
  "closing-a-business-properly",
];
const routes = [
  ["home", "", "/"],
  ["services", "#services", "/services"],
  ["calculator", "#calculator", "/tools"],
  ["about", "#about", "/about"],
  ["blog", "#blog", "/blog"],
  ["book", "#book", "/free-consultation"],
  ...slugs.map((slug) => [slug, "#blog/" + slug, "/blog/" + slug]),
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
});
const results = [];
await mkdir(output, { recursive: true });
try {
  for (const viewport of viewports) {
    for (const [name, hash, route] of routes) {
      if (
        process.env.CAPTURE_FILTER &&
        !`${viewport.name}/${name}`.includes(process.env.CAPTURE_FILTER)
      )
        continue;
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const errors = [],
        failedRequests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("requestfailed", (request) =>
        failedRequests.push({
          url: request.url(),
          error: request.failure()?.errorText,
        }),
      );
      page.on("response", (response) => {
        if (response.status() >= 400)
          failedRequests.push({
            url: response.url(),
            status: response.status(),
          });
      });
      const url =
        mode === "reference" ? base + hash : new URL(route, base).href;
      const response = await page.goto(url, { waitUntil: "networkidle" });
      assert.equal(
        await page.locator("#nav").count(),
        1,
        "Expected Hisab Kitab application, not another server",
      );
      await page.evaluate(() => document.fonts.ready);
      // Allow layout observers and reduced-motion route handlers to settle.
      await page.waitForTimeout(400);
      await page.mouse.move(0, 0);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(100);
      const metrics = await page.evaluate(() => {
        const visible = (element) =>
          !!element.getClientRects().length &&
          getComputedStyle(element).visibility !== "hidden";
        const box = (element) => {
          const r = element.getBoundingClientRect();
          const s = getComputedStyle(element);
          return {
            tag: element.tagName,
            id: element.id,
            classes: element.className?.baseVal ?? element.className,
            text: element.textContent.trim().replace(/\s+/g, " "),
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            font: s.font,
            fontFamily: s.fontFamily,
            color: s.color,
            background: s.backgroundColor,
          };
        };
        return {
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          fontReady: document.fonts.check("500 16px Manrope"),
          headings: [...document.querySelectorAll("h1,h2,h3,h4,h5")]
            .filter(visible)
            .map(box),
          sections: [
            ...document.querySelectorAll(
              "main > section, .site-foot, .nav, .topbar",
            ),
          ]
            .filter(visible)
            .map(box),
          images: [...document.images].map((img) => ({
            src: img.currentSrc,
            loaded: img.complete && img.naturalWidth > 0,
          })),
          content: document.body.innerText,
        };
      });
      await page.screenshot({
        path: path.join(output, `${viewport.name}-${name}.png`),
        fullPage: true,
      });
      results.push({
        name,
        viewport: viewport.name,
        url,
        status: response.status(),
        errors,
        failedRequests,
        metrics,
      });
      console.log(
        `${mode} ${viewport.name}/${name}: HTTP ${response.status()}, ${metrics.width}×${metrics.height}, scrollWidth=${metrics.scrollWidth}, errors=${errors.length}, failed=${failedRequests.length}`,
      );
      await context.close();
    }
  }
} finally {
  await writeFile(
    path.join(output, "captures.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
if (
  results.some(
    (r) => r.status !== 200 || r.errors.length || r.failedRequests.length,
  )
)
  process.exitCode = 1;
