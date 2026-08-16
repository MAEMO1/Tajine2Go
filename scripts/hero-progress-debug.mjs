/** Drive a hero variant's progress directly and capture key states.
 *  Usage: node scripts/hero-progress-debug.mjs [tea|tajine|silk]
 */
import { chromium } from "playwright";

const variant = process.argv[2] ?? "tea";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto(`http://localhost:3000/nl?hero=${variant}`, {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(3500);

const panel = page.locator("section .section-ember").first();
for (const p of [0, 0.5, 1]) {
  await page.evaluate((value) => {
    window.__heroScene?.setProgress(value);
  }, p);
  await page.waitForTimeout(800);
  await panel.screenshot({ path: `.claude-screens/hero-${variant}-p${p * 100}.png` });
}
console.log("hook present:", await page.evaluate(() => Boolean(window.__heroScene)));
await browser.close();
