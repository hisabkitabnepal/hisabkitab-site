import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as wait } from "node:timers/promises";
import path from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const reference = process.argv[2] === "reference";
const root =
  process.env.SITE_URL ||
  (reference
    ? "http://127.0.0.1:4173/Hisab_Kitab_Site_Preview.html"
    : "http://127.0.0.1:3000");
const output = path.resolve(
  process.env.VISUAL_OUTPUT || "verification-output",
  reference ? "reference" : "rebuilt",
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
});
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 900 : 844 },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.clock.install({ time: new Date("2026-10-27T00:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-27T00:00:01Z"));
    await page.goto(root, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // Let module hydration finish while the page animation clock is paused.
    for (let i = 0; i < 100; i++) {
      if (await page.locator(".hero h1 .wi").count()) break;
      await wait(50);
      if (i === 99) throw new Error("Home motion failed to initialize");
    }
    for (const [time, advance] of [
      [1000, 1000],
      [4000, 3000],
    ]) {
      await page.clock.runFor(advance);
      const state = await page.evaluate(() => ({
        progress: document.querySelector("#pct").textContent,
        done: document.querySelectorAll(".setup .step.done").length,
        words: document.querySelectorAll(".hero h1 .wi").length,
        heroOpacity: getComputedStyle(document.querySelector(".hero-p"))
          .opacity,
        marqueeTransform: getComputedStyle(document.querySelector("#track"))
          .transform,
        scrollTriggers: window.ScrollTrigger?.getAll().length,
      }));
      results.push({ width, time, state, errors });
      await page.screenshot({
        path: path.join(output, `motion-home-${width}-${time}.png`),
      });
    }
    if (width === 1440) {
      // Same elapsed phase, cursor coordinates and button-relative origin.
      await page.mouse.move(0, 0);
      const rect = await page.locator(".hero-left .pill").boundingBox();
      await page.mouse.move(rect.x + 20, rect.y + 20);
      await page.clock.runFor(300);
      await page.screenshot({
        path: path.join(output, "motion-button-fill.png"),
      });
      for (let index = 1; index <= 6; index++) {
        await page.evaluate((index) => {
          const el = document.querySelector(`#services-${index} .sx-v`);
          scrollTo({
            top:
              el.getBoundingClientRect().top +
              scrollY -
              (innerHeight - el.offsetHeight) / 2,
            behavior: "instant",
          });
        }, index);
        await page.clock.runFor(1000);
        await page.screenshot({
          path: path.join(output, `motion-service-${index}.png`),
        });
      }
    }
    if (errors.length) throw new Error(errors.join("\n"));
    await context.close();
  }
  for (const [name, hash, route] of [
    ["services", "#services", "/services"],
    ["about", "#about", "/about"],
    ["blog", "#blog", "/blog"],
    ["book", "#book", "/free-consultation"],
    ["calculator", "#calculator", "/tools"],
    [
      "article",
      "#blog/notes-on-running-a-business-in-nepal",
      "/blog/notes-on-running-a-business-in-nepal",
    ],
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.clock.install({ time: new Date("2026-10-27T00:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-27T00:00:01Z"));
    await page.goto(reference ? root + hash : new URL(route, root).href, {
      waitUntil: "load",
    });
    await page.evaluate(() => document.fonts.ready);
    for (let i = 0; i < 100; i++) {
      if (await page.locator(".topbar").getAttribute("style")) break;
      await wait(50);
      // Streamed query-dependent pages hydrate through a scheduled task. Advance
      // only while waiting for setup, then sample relative to that entrance.
      if (name === "book" && !reference) await page.clock.runFor(16);
      if (i === 99) throw new Error(name + " motion failed to initialize");
    }
    for (const [time, advance] of [
      [1000, 1000],
      [4000, 3000],
    ]) {
      await page.clock.runFor(advance - 16);
      // A direct #calculator reference URL triggers native anchor scrolling.
      // Compare the same document scroll position, not two different crops.
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.clock.runFor(16);
      await page.screenshot({
        path: path.join(output, `motion-${name}-${time}.png`),
      });
      results.push({ page: name, time, errors: [...errors] });
    }
    if (name === "about") {
      for (const selector of [".ab-band", ".ab-bento"]) {
        await page.evaluate((selector) => {
          const e = document.querySelector(selector);
          scrollTo({
            top: e.getBoundingClientRect().top + scrollY - 120,
            behavior: "instant",
          });
        }, selector);
        await page.clock.runFor(2000);
        await page.screenshot({
          path: path.join(output, `motion-about-${selector.slice(1)}.png`),
        });
      }
    }
    if (errors.length) throw new Error(errors.join("\n"));
    await context.close();
  }
} finally {
  await writeFile(
    path.join(output, "motion.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
