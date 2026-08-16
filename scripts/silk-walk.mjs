/** Walk down the page with real wheel events, capturing the ambient silk. */
import { chromium } from "playwright";
import { mkdirSync } from "fs";

mkdirSync(".claude-screens", { recursive: true });
const route = process.argv[2] ?? "/nl";
const slug = route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3500);
await page.mouse.move(800, 500);

let step = 0;
await page.screenshot({ path: `.claude-screens/silk-${slug}-${step++}.png` });
for (let i = 0; i < 4; i++) {
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `.claude-screens/silk-${slug}-${step++}.png` });
}
console.log("done");
await browser.close();
