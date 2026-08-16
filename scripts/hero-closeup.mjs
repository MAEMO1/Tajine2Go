/** Close-up of the WebGL tajine panel for material/lighting review. */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

mkdirSync(".claude-screens", { recursive: true });
const browser = await chromium.launch({ args: ["--use-gl=angle"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on("pageerror", (err) => console.log("PAGEERROR:", String(err).slice(0, 300)));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE:", msg.text().slice(0, 300));
});

await page.goto("http://localhost:3000/nl", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(4000); // let steam develop and the turntable rotate

const panel = page.locator("section .section-ember").first();
await panel.screenshot({ path: ".claude-screens/hero-closeup-1.png" });
await page.waitForTimeout(3500);
await panel.screenshot({ path: ".claude-screens/hero-closeup-2.png" });

// Real wheel events (Lenis consumes these; programmatic scrollTo gets overridden).
await page.mouse.move(800, 500);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(2400);
console.log(
  "mid — scrollY:",
  await page.evaluate(() => window.scrollY),
  "progress:",
  await page.evaluate(() => document.querySelector("[data-hero-progress]")?.getAttribute("data-hero-progress")),
);
await panel.screenshot({ path: ".claude-screens/hero-closeup-open.png" });

await page.mouse.wheel(0, 500);
await page.waitForTimeout(1200);
await page.mouse.wheel(0, 400);
await page.waitForTimeout(2400);
console.log(
  "full — scrollY:",
  await page.evaluate(() => window.scrollY),
  "progress:",
  await page.evaluate(() => document.querySelector("[data-hero-progress]")?.getAttribute("data-hero-progress")),
);
await panel.screenshot({ path: ".claude-screens/hero-closeup-open-full.png" });
console.log("done");
await browser.close();
