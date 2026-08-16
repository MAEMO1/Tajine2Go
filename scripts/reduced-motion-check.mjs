/** Verify the reduced-motion path: no Lenis, no hidden reveal elements, scene static. */
import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/nl", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

const result = await page.evaluate(() => {
  const hidden = [...document.querySelectorAll("main *")].filter((el) => {
    const style = getComputedStyle(el);
    return style.visibility === "hidden" || style.opacity === "0";
  });
  return {
    lenisActive: document.documentElement.classList.contains("lenis"),
    customCursor: document.documentElement.classList.contains("has-custom-cursor"),
    hiddenElements: hidden.slice(0, 8).map((el) => el.tagName + "." + String(el.className).slice(0, 60)),
    hiddenCount: hidden.length,
    canvasPresent: !!document.querySelector("canvas"),
  };
});
console.log(JSON.stringify(result, null, 2));
await page.screenshot({ path: ".claude-screens/nl-reduced-motion.png" });
await browser.close();
