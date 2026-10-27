import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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
const output = path.resolve(process.env.VISUAL_OUTPUT || "verification-output");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const results = {};
async function go(name) {
  const hashes = {
    home: "",
    calculator: "#calculator",
    book: "#book",
    blog: "#blog",
    services: "#services",
    about: "#about",
  };
  const routes = {
    home: "/",
    calculator: "/tools",
    book: "/free-consultation",
    blog: "/blog",
    services: "/services",
    about: "/about",
  };
  await page.goto(
    reference ? root + hashes[name] : new URL(routes[name], root).href,
    { waitUntil: "networkidle" },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}
async function calculatorState(name) {
  await page.waitForTimeout(150);
  results[name] = await page.evaluate(() => ({
    big: document.querySelector("#resBig").textContent,
    label: document.querySelector("#resLbl").textContent,
    formula: document.querySelector("#resFormula").textContent,
    rows: document.querySelector("#resRows").innerText,
    errors: [...document.querySelectorAll(".field.bad .err")].map(
      (e) => e.textContent,
    ),
    adjustment: document.querySelector("#adjVal").textContent,
  }));
  if (name === "sole-plus20")
    await page.locator("#calcForm").screenshot({
      // Element capture excludes overlapping sticky chrome in BOTH versions.
      style: "#nav, #xbar { visibility: hidden !important; }",
      path: path.join(
        output,
        reference ? "reference" : "rebuilt",
        "state-calculator.png",
      ),
    });
}
await mkdir(path.join(output, reference ? "reference" : "rebuilt"), {
  recursive: true,
});
try {
  await go("calculator");
  await calculatorState("company-year");
  await page
    .locator(".opts label")
    .filter({ hasText: "Sole proprietorship" })
    .click();
  await calculatorState("sole-year");
  await page
    .locator(".per-seg label")
    .filter({ hasText: "Per Quarter" })
    .click();
  await calculatorState("sole-quarter");
  await page.locator(".per-seg label").filter({ hasText: "Per Month" }).click();
  await calculatorState("sole-month");
  await page.locator("#adj").fill("20");
  await calculatorState("sole-plus20");
  await page.locator("#adj").fill("-20");
  await calculatorState("sole-minus20");
  await page.locator("#adj").fill("0");
  await page.locator("#profit").fill("0");
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  await calculatorState("zero-profit");
  await page.locator("#turnover").fill("1000");
  await page.locator("#profit").fill("2000");
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  results["profit-validation"] = await page.locator("#f2 .err").innerText();
  await page.locator("#turnover").fill("");
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  results["turnover-validation"] = await page.locator("#f1 .err").innerText();
  await page.locator("#xbarX").click();
  assert.equal(await page.locator("#xbar").isVisible(), false);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#xbar").isVisible(), false);
  results["banner-dismissal"] = "persists after reload";

  await go("home");
  await page.locator(".acc-head").nth(1).click();
  await page.waitForTimeout(650);
  results["faq-exclusive"] = await page
    .locator(".acc-head")
    .evaluateAll((elements) =>
      elements.map((e) => e.getAttribute("aria-expanded")),
    );
  await page.locator("#faq").screenshot({
    path: path.join(
      output,
      reference ? "reference" : "rebuilt",
      "state-faq.png",
    ),
  });
  await page.locator(".acc-head").nth(1).click();
  await page.waitForTimeout(650);
  results["faq-collapse"] = await page
    .locator(".acc-head")
    .evaluateAll((elements) =>
      elements.map((e) => e.getAttribute("aria-expanded")),
    );
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.locator(".has-dd > a").hover();
  await page.waitForTimeout(650);
  assert.equal(await page.locator(".dd-menu").isVisible(), true);
  await page.screenshot({
    path: path.join(
      output,
      reference ? "reference" : "rebuilt",
      "state-dropdown.png",
    ),
  });
  results["dropdown-items"] = await page.locator(".dd-i").allTextContents();

  await go("blog");
  for (const category of [
    "Registration",
    "Compliance",
    "Accounting",
    "Audit",
    "Closure",
    "All articles",
  ]) {
    await page.locator(".bt button").filter({ hasText: category }).click();
    results["filter-" + category] = await page
      .locator(".bl article:visible h4")
      .allTextContents();
    if (category === "Compliance")
      await page.screenshot({
        path: path.join(
          output,
          reference ? "reference" : "rebuilt",
          "state-filter.png",
        ),
        fullPage: true,
      });
  }
  await page.locator(".bf").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  await page.waitForLoadState("networkidle");
  results["article-keyboard"] = await page.locator(".ar-h1").innerText();
  await page.locator(".ar-t").last().click();
  await page.waitForTimeout(2000);
  const lastSection = await page.locator(".ar-sec").last().boundingBox();
  assert.ok(
    lastSection.y < 900 && lastSection.y + lastSection.height > 0,
    "Article contents scrolls to the selected section",
  );
  results["article-contents"] = "selected section visible";

  await go("book");
  await page.getByRole("button", { name: "Book a Call" }).click();
  results["book-empty"] = await page.locator("#bkMsg").innerText();
  results["book-required-fields"] = await page
    .locator(".field.bad")
    .evaluateAll((els) => els.map((e) => e.id));
  // No contact details are ever sent to a provider by this suite.
  if (!reference) {
    const config = await (
      await context.request.get(new URL("/api/inquiries/config", root).href)
    ).json();
    results.deliveryConfigured = config.enabled === true;
    const rejected = await context.request.post(
      new URL("/api/inquiries", root).href,
      { data: {} },
    );
    assert.equal(rejected.status(), 400);
    const foreign = await context.request.post(
      new URL("/api/inquiries", root).href,
      { headers: { origin: "https://example.invalid" }, data: {} },
    );
    assert.equal(foreign.status(), 403);
    results.apiValidation = "malformed payload 400; foreign origin 403";
    if (!config.enabled) {
      let submissions = 0;
      page.on("request", (request) => {
        if (
          new URL(request.url()).pathname === "/api/inquiries" &&
          request.method() === "POST"
        )
          submissions++;
      });
      await page.locator("#bName").fill("Local QA Test");
      await page.locator("#bPhone").fill("9800000000");
      await page.getByRole("button", { name: "Book a Call" }).click();
      assert.match(
        await page.locator("#bkMsg").innerText(),
        /agree to be contacted/i,
      );
      await page.locator("input[type=checkbox]").check();
      await page.getByRole("button", { name: "Book a Call" }).click();
      await page.waitForTimeout(600);
      assert.match(
        await page.locator("#bkMsg").innerText(),
        /unavailable|could not be sent/i,
      );
      assert.equal(await page.locator("#bName").inputValue(), "Local QA Test");
      assert.equal(
        submissions,
        0,
        "Unconfigured delivery must not send an inquiry",
      );
      results.unconfiguredBooking =
        "explicit consent; honest unavailable message; fields retained; zero POSTs";
    }
  }
  assert.deepEqual(errors, [], "No browser runtime errors");
  if (!reference) {
    const expected = JSON.parse(
      await readFile(
        new URL("./fixtures/reference-interactions.json", import.meta.url),
        "utf8",
      ),
    );
    for (const [name, value] of Object.entries(expected)) {
      if (name === "book-empty" || name === "book-required-fields") continue; // Production form requires honest consent/delivery handling.
      assert.deepEqual(results[name], value, `Reference interaction: ${name}`);
    }
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile(
    path.join(
      output,
      reference ? "reference-interactions.json" : "rebuilt-interactions.json",
    ),
    JSON.stringify(
      { ...results, ...(errors.length ? { errors } : {}) },
      null,
      2,
    ),
  );
  await browser.close();
}
