/**
 * Headless visual verification for the redesign.
 * Usage: node scripts/visual-check.mjs [baseUrl] [route1 route2 ...]
 * Screenshots land in .claude-screens/ (gitignored, throwaway).
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const routes = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/nl"];

const outDir = ".claude-screens";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  for (const route of routes) {
    const slug = route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
    try {
      await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1800); // hero entrance + three.js first frames

      // Above-the-fold shot
      await page.screenshot({ path: `${outDir}/${slug}-${viewport.name}-fold.png` });

      // Walk the page so every ScrollTrigger fires, then full-page shot
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.7;
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 220));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 600));
      });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: `${outDir}/${slug}-${viewport.name}-full.png`,
        fullPage: true,
      });
      console.log(`OK ${route} [${viewport.name}]`);
    } catch (error) {
      console.log(`FAIL ${route} [${viewport.name}]: ${String(error).slice(0, 300)}`);
    }
  }

  if (consoleErrors.length) {
    console.log(`CONSOLE ERRORS [${viewport.name}]:`);
    for (const e of [...new Set(consoleErrors)].slice(0, 12)) console.log("  " + e.slice(0, 240));
  } else {
    console.log(`No console errors [${viewport.name}]`);
  }
  await context.close();
}

await browser.close();
