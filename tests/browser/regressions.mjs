import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
try {
  await page.clock.install({ time: new Date("2026-10-27T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-27T00:00:01Z"));
  await page.goto(process.env.SITE_URL || "http://127.0.0.1:4180", {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.locator(".logo-svg").count(),
    1,
    "Header uses the reusable, sized reference logo",
  );
  assert.equal(
    await page
      .locator(".logo-svg")
      .evaluate((el) => el.getBoundingClientRect().height),
    34,
  );
  assert.deepEqual(
    await page.evaluate(() =>
      [
        ...new Set(
          [...document.fonts]
            .filter((f) => f.family === "Manrope")
            .map((f) => f.weight),
        ),
      ].sort(),
    ),
    ["400", "500", "600", "700"],
    "Expose only the four font weights the original loads",
  );
  assert.equal(
    await page
      .locator(".acc-body")
      .first()
      .evaluate((el) => el.style.height),
    "auto",
    "Initial FAQ state is immediate even after StrictMode effect replay",
  );
  console.log(
    "Logo sizing, exact font faces and initial FAQ regressions passed.",
  );
} finally {
  await browser.close();
}
