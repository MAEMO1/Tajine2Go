// Reads the Mr. Pops reference (https://mrpops.ua/en/) into design tokens.
// Stand-in for refero_get_style, which is not reachable from this remote container.
// Output: measured numbers only — nothing recalled, nothing inferred.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const URL = process.argv[2] || 'https://mrpops.ua/en/'
const OUT = process.argv[3] || './reference-tokens.json'

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const probe = () => {
  const px = (v) => {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : null
  }
  const vis = (el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && px(cs.opacity) !== 0
  }
  const norm = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return c
    const [r, g, b, a] = m[1].split(',').map((s) => parseFloat(s))
    if (a === 0) return 'transparent'
    const h = (n) => Math.round(n).toString(16).padStart(2, '0')
    return ('#' + h(r) + h(g) + h(b)).toUpperCase()
  }

  const vw = innerWidth
  const vh = innerHeight
  const docH = document.documentElement.scrollHeight

  // ---- every visible text run, with its full type signature -------------
  const typeRuns = []
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue
    const direct = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim()
    if (!direct || direct.length < 2) continue
    const cs = getComputedStyle(el)
    const fs = px(cs.fontSize)
    const lh = cs.lineHeight === 'normal' ? null : px(cs.lineHeight)
    const ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing)
    const r = el.getBoundingClientRect()
    typeRuns.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 80),
      text: direct.slice(0, 70),
      fontSize: fs,
      lineHeight: lh,
      lineHeightRatio: lh && fs ? +(lh / fs).toFixed(3) : null,
      letterSpacing: ls,
      trackingEm: fs ? +(ls / fs).toFixed(4) : null,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      textTransform: cs.textTransform,
      color: norm(cs.color),
      top: Math.round(r.top + scrollY),
      width: Math.round(r.width),
    })
  }

  // ---- buttons and links that look like buttons --------------------------
  const buttonish = []
  for (const el of document.querySelectorAll('button, a, [class*="btn"], [class*="button"]')) {
    if (!vis(el)) continue
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const bg = norm(cs.backgroundColor)
    const bw = px(cs.borderTopWidth)
    // only things that read as a control: filled, or outlined, or pill-shaped
    if (bg === 'transparent' && bw === 0) continue
    if (r.height < 24 || r.width < 40) continue
    buttonish.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 80),
      text: (el.textContent || '').trim().slice(0, 40),
      bg,
      color: norm(cs.color),
      borderRadius: cs.borderRadius,
      radiusPx: px(cs.borderTopLeftRadius),
      borderWidth: bw,
      borderColor: norm(cs.borderTopColor),
      paddingY: px(cs.paddingTop),
      paddingX: px(cs.paddingLeft),
      height: Math.round(r.height),
      width: Math.round(r.width),
      fontSize: px(cs.fontSize),
      fontWeight: cs.fontWeight,
      textTransform: cs.textTransform,
      trackingEm: px(cs.fontSize) ? +((cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing)) / px(cs.fontSize)).toFixed(4) : null,
      isPill: px(cs.borderTopLeftRadius) >= r.height / 2 - 1,
    })
  }

  // ---- form inputs -------------------------------------------------------
  const inputs = []
  for (const el of document.querySelectorAll('input, textarea, select')) {
    if (!vis(el)) continue
    const cs = getComputedStyle(el)
    inputs.push({
      type: el.type || el.tagName.toLowerCase(),
      radiusPx: px(cs.borderTopLeftRadius),
      borderTop: px(cs.borderTopWidth),
      borderRight: px(cs.borderRightWidth),
      borderBottom: px(cs.borderBottomWidth),
      borderLeft: px(cs.borderLeftWidth),
      borderBottomColor: norm(cs.borderBottomColor),
      bg: norm(cs.backgroundColor),
      fontSize: px(cs.fontSize),
      paddingY: px(cs.paddingTop),
      paddingX: px(cs.paddingLeft),
    })
  }

  // ---- full-bleed media / hero surfaces -----------------------------------
  const media = []
  for (const el of document.querySelectorAll('img, video, picture, [class*="hero"], [class*="banner"], section')) {
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width < vw * 0.5) continue
    const cs = getComputedStyle(el)
    media.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 60),
      widthPct: +((r.width / vw) * 100).toFixed(1),
      heightPct: +((r.height / vh) * 100).toFixed(1),
      top: Math.round(r.top + scrollY),
      radiusPx: px(cs.borderTopLeftRadius),
      overflow: cs.overflow,
      bg: norm(cs.backgroundColor),
      hasClip: cs.clipPath !== 'none' ? cs.clipPath : null,
      hasMask: (cs.maskImage && cs.maskImage !== 'none') ? cs.maskImage.slice(0, 60) : null,
      boxShadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 60),
    })
  }

  // ---- section colour rhythm down the page --------------------------------
  const sections = []
  for (const el of document.querySelectorAll('body > *, body > * > section, section, [class*="section"]')) {
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    if (r.height < 120 || r.width < vw * 0.6) continue
    const cs = getComputedStyle(el)
    sections.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 60),
      top: Math.round(r.top + scrollY),
      height: Math.round(r.height),
      bg: norm(cs.backgroundColor),
      paddingTop: px(cs.paddingTop),
      paddingBottom: px(cs.paddingBottom),
      maxWidth: cs.maxWidth,
    })
  }

  // ---- gradients & shadows: the don'ts ------------------------------------
  let gradientCount = 0
  let shadowCount = 0
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue
    const cs = getComputedStyle(el)
    if (/gradient/i.test(cs.backgroundImage)) gradientCount++
    if (cs.boxShadow && cs.boxShadow !== 'none') shadowCount++
  }

  // ---- colour census -------------------------------------------------------
  const bgCensus = {}
  const fgCensus = {}
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const bg = norm(cs.backgroundColor)
    if (bg !== 'transparent') bgCensus[bg] = (bgCensus[bg] || 0) + Math.round(r.width * r.height)
    const fg = norm(cs.color)
    fgCensus[fg] = (fgCensus[fg] || 0) + 1
  }

  // ---- nav ------------------------------------------------------------------
  const navs = []
  for (const el of document.querySelectorAll('nav, header, [class*="nav"], [class*="header"]')) {
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    if (r.height > vh * 0.5) continue
    const links = Array.from(el.querySelectorAll('a')).filter(vis)
    navs.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 60),
      top: Math.round(r.top + scrollY),
      left: Math.round(r.left),
      width: Math.round(r.width),
      height: Math.round(r.height),
      linkCount: links.length,
      linkTexts: links.map((a) => (a.textContent || '').trim().slice(0, 24)).filter(Boolean).slice(0, 14),
      position: getComputedStyle(el).position,
    })
  }

  const radii = {}
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue
    const rr = px(getComputedStyle(el).borderTopLeftRadius)
    if (rr && rr > 0) radii[rr] = (radii[rr] || 0) + 1
  }

  return { vw, vh, docH, typeRuns, buttonish, inputs, media, sections, gradientCount, shadowCount, bgCensus, fgCensus, navs, radii }
}

// Outbound HTTPS in this container goes through the agent proxy; Chromium does not
// read HTTPS_PROXY on its own, so hand it Playwright's own proxy option. The proxy CA
// is already in the browser NSS store, so TLS verification stays on.
const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  ...(proxyServer ? { proxy: { server: proxyServer } } : {}),
})
const result = { url: URL, measuredAt: new Date().toISOString(), viewports: {} }

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(2500)
  // scroll the whole page so lazy sections mount, then return to top
  await page.evaluate(async () => {
    const step = innerHeight
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)
  result.viewports[vp.name] = await page.evaluate(probe)
  await page.screenshot({ path: OUT.replace(/\.json$/, '') + '-' + vp.name + '.png', fullPage: false })
  console.log(vp.name + ': ' + result.viewports[vp.name].typeRuns.length + ' text runs, ' +
    result.viewports[vp.name].buttonish.length + ' controls, ' +
    result.viewports[vp.name].sections.length + ' sections')
  await ctx.close()
}

await browser.close()
writeFileSync(OUT, JSON.stringify(result, null, 2))
console.log('geschreven: ' + OUT)
