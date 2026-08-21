// Tokengate voor de Mr. Pops-herontwerp van de publieke site.
//
// De lat ligt buiten de bouwer: SPEC hieronder komt uit de GEMETEN referentie
// (zie docs/design/mrpops-reference-spec.md, met grep-herleidbare bronwaarden).
//
//   PAS `SPEC` NIET AAN OM EEN PASS TE FORCEREN.
//
// Wijkt een regel echt af voor ons merk, meld dat en vraag het na bij de eigenaar;
// elke afwijking die er al in zit staat hieronder met reden benoemd.
//
// Gebruik:  node scripts/refero-gate.mjs [http://localhost:3000] [--locale=nl] [--path=/] [--unit=hero]
//
// --unit=<naam> beperkt élke meting tot de deelboom [data-unit="<naam>"]. Zo kan een
// eenheid groen worden terwijl de rest van de pagina nog niet herbouwd is. Zonder
// --unit meet de gate de hele pagina; dat is de eindlat.
//
// De gate is placeholder-blind: een vlak met `data-media-slot` telt volwaardig mee
// als heldenvlak. Compositie wordt gemeten, beeldinhoud niet.

import { chromium } from 'playwright'

const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:3000'
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const LOCALE = arg('locale', 'nl')
const PATHNAME = arg('path', '/')
const UNIT = arg('unit', null)

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

// ── SPEC — gemeten aan https://mrpops.ua/en/, vertaald naar het Tajine2Go-palet ──
const SPEC = {
  // Typeschaal. Referentie: h1 144/94/40px met leading 90/90/100%.
  display: {
    minSizeDesktop: 96,      // referentie 144px @>=1200; 96px is de ondergrens waaronder het geen display meer is
    minSizeMobile: 34,       // referentie 40px @<=899
    maxLineHeightDesktop: 0.92, // referentie 0.90
    maxLineHeightMobile: 1.02,  // referentie 1.00
    minWeight: 800,          // Geist Black; referentie gebruikt Cervo 500 (andere familie, ander gewicht)
    minTrackingEm: 0.045,    // TAJINE2GO-REGEL, niet Mr. Pops: de referentie declareert
                             // op display geen tracking (3 hits in 302 KB, alle op 22px).
                             // Zie spec 1.1 — bewuste merkbeslissing, geen meetfout.
    mustBeUppercase: true,   // referentie: 54 van 56 uppercase-regels zijn de displayletter
  },
  body: {
    minSizeDesktop: 17,      // referentie 18px
    minSizeMobile: 13,       // referentie 14px
    minLineHeight: 1.3,      // referentie 140%
  },
  // Heldenvlak. Referentie: exact 100% viewporthoogte, edge-to-edge.
  hero: {
    minHeightPctOfViewport: 70,
    minWidthPctOfViewport: 99,
    minHeadingOverlapPct: 60,
    allowScrim: false,
  },
  buttons: {
    primaryFill: '#B5540F',      // terracotta, vervangt --color-contrast #b00e2f
    primaryMustBePill: true,     // ADR 0004; referentie gebruikt een cirkel (rolregel identiek)
    ghostRadiusPx: 0,            // referentie: scherpe hoeken
    ghostBorderPx: 1,            // referentie: border:1px solid var(--color-contrast)
    minHeightPx: 44,             // referentie 48px; 44px is de tapdoelondergrens
  },
  color: {
    maxGradients: 0,             // referentie: 1 decoratieve band; wij staan er geen toe
    maxShadows: 0,               // diepte via crème-vlakken, niet via schaduwen
    palette: [
      '#B5540F', '#93430B', '#D2691E', '#F5A400', '#78320C',
      '#FBF2DC', '#FDF3E2', '#F6E8C9', '#F6E3B1',
      '#3B1606', '#6B3E1E', '#A18059', '#22456E',
      '#FFFFFF', '#000000', 'TRANSPARENT',
    ],
    forbidDarkTheme: true,       // referentie: 0 hits prefers-color-scheme
  },
  spacing: {
    element: [10, 20],
    card: [30, 40],
    minSectionGapDesktop: 90,    // referentie 100-260px; briefing noemde 40px, dat is een kaartwaarde
    minSectionGapMobile: 60,
  },
}

// ── meetsonde, draait in de pagina ──────────────────────────────────────────
const probe = (unitSel) => {
  const root = unitSel ? document.querySelector(unitSel) : document.body
  if (!root) return { missingRoot: unitSel }
  const q = (sel) => [...root.querySelectorAll(sel)]
  const px = (v) => {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : null
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'
  }
  const hex = (c) => {
    if (!c || c === 'transparent') return 'TRANSPARENT'
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return String(c).toUpperCase()
    const p = m[1].split(',').map((s) => parseFloat(s))
    if (p.length > 3 && p[3] === 0) return 'TRANSPARENT'
    const h = (n) => Math.round(n).toString(16).padStart(2, '0')
    return ('#' + h(p[0]) + h(p[1]) + h(p[2])).toUpperCase()
  }
  const rect = (el) => {
    const r = el.getBoundingClientRect()
    return { top: r.top + scrollY, left: r.left, width: r.width, height: r.height, bottom: r.bottom + scrollY }
  }

  const vw = innerWidth
  const vh = innerHeight

  // heldenvlak: elk element met data-media-slot telt volwaardig mee
  const slots = q('[data-media-slot]').filter(visible).map((el) => {
    const cs = getComputedStyle(el)
    return {
      name: el.getAttribute('data-media-slot'),
      ...rect(el),
      widthPct: +((el.getBoundingClientRect().width / vw) * 100).toFixed(1),
      heightPct: +((el.getBoundingClientRect().height / vh) * 100).toFixed(1),
      bg: hex(cs.backgroundColor),
    }
  })

  // displaykoppen
  const headings = q('h1, h2, [data-display]').filter(visible).map((el) => {
    const cs = getComputedStyle(el)
    const fs = px(cs.fontSize)
    const lh = cs.lineHeight === 'normal' ? null : px(cs.lineHeight)
    const ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing)
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 48),
      fontSize: fs,
      lineHeightRatio: lh && fs ? +(lh / fs).toFixed(3) : null,
      trackingEm: fs ? +(ls / fs).toFixed(4) : null,
      weight: parseInt(cs.fontWeight, 10) || 400,
      transform: cs.textTransform,
      family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      color: hex(cs.color),
      ...rect(el),
    }
  })

  // bodytekst
  const body = q('p, li').filter((el) => {
    if (!visible(el)) return false
    const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('')
    return t.length > 30
  }).map((el) => {
    const cs = getComputedStyle(el)
    const fs = px(cs.fontSize)
    const lh = cs.lineHeight === 'normal' ? null : px(cs.lineHeight)
    return { fontSize: fs, lineHeightRatio: lh && fs ? +(lh / fs).toFixed(3) : null, text: (el.textContent || '').trim().slice(0, 40) }
  })

  // knoppen
  const controls = q('a, button').filter(visible).map((el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(),
      href: el.getAttribute('href') || null,
      text: (el.textContent || '').trim().slice(0, 32),
      bg: hex(cs.backgroundColor),
      color: hex(cs.color),
      radiusPx: px(cs.borderTopLeftRadius),
      borderPx: px(cs.borderTopWidth),
      borderColor: hex(cs.borderTopColor),
      height: Math.round(r.height),
      width: Math.round(r.width),
      transform: cs.textTransform,
      isCta: el.hasAttribute('data-cta') ? el.getAttribute('data-cta') : null,
      ...rect(el),
    }
  })

  // invoervelden
  const inputs = q('input, textarea, select').filter(visible).map((el) => {
    const cs = getComputedStyle(el)
    return {
      type: el.getAttribute('type') || el.tagName.toLowerCase(),
      radiusPx: px(cs.borderTopLeftRadius),
      top: px(cs.borderTopWidth), right: px(cs.borderRightWidth),
      bottom: px(cs.borderBottomWidth), left: px(cs.borderLeftWidth),
      bg: hex(cs.backgroundColor),
    }
  })

  // secties: kleurritme en onderlinge afstand
  const sections = q('section, [data-section]').filter(visible)
    .filter((el) => el.getBoundingClientRect().height > 80)
    .map((el) => {
      const cs = getComputedStyle(el)
      return {
        name: el.getAttribute('data-section') || el.className.slice(0, 30),
        bg: hex(cs.backgroundColor),
        paddingTop: px(cs.paddingTop),
        paddingBottom: px(cs.paddingBottom),
        ...rect(el),
      }
    })
    .sort((a, b) => a.top - b.top)

  // de don'ts
  let gradients = 0
  let shadows = 0
  const bgColors = new Set()
  const fgColors = new Set()
  for (const el of q('*')) {
    if (!visible(el)) continue
    const cs = getComputedStyle(el)
    if (/gradient/i.test(cs.backgroundImage)) gradients++
    if (cs.boxShadow && cs.boxShadow !== 'none') shadows++
    const b = hex(cs.backgroundColor)
    if (b !== 'TRANSPARENT') bgColors.add(b)
    fgColors.add(hex(cs.color))
  }

  return {
    vw, vh, slots, headings, body, controls, inputs, sections,
    gradients, shadows,
    bgColors: [...bgColors], fgColors: [...fgColors],
    telLinks: q('a[href^="tel:"]').map((a) => a.getAttribute('href')),
    lang: document.documentElement.lang,
  }
}

// ── assertiemachine ─────────────────────────────────────────────────────────
const results = []
const check = (vp, name, ok, detail) => results.push({ vp, name, ok, detail })
const skip = (vp, name, why) => results.push({ vp, name, ok: null, detail: why })

function assertViewport(vp, m) {
  const isMobile = vp === 'mobile'
  const S = SPEC

  // ── heldenvlak ──
  const hero = m.slots.find((s) => s.name === 'hero') || m.slots[0]
  if (!hero) {
    skip(vp, 'heldenvlak aanwezig', 'geen [data-media-slot] gevonden')
    skip(vp, 'heldenvlak-hoogte', 'geen heldenvlak')
    skip(vp, 'heldenvlak full-bleed', 'geen heldenvlak')
    skip(vp, 'kop over heldenvlak', 'geen heldenvlak')
  } else {
    check(vp, 'heldenvlak aanwezig', true, `[data-media-slot="${hero.name}"]`)
    check(vp, 'heldenvlak-hoogte', hero.heightPct >= S.hero.minHeightPctOfViewport,
      `${hero.heightPct}% van viewport (vereist >= ${S.hero.minHeightPctOfViewport}%)`)
    check(vp, 'heldenvlak full-bleed', hero.widthPct >= S.hero.minWidthPctOfViewport,
      `${hero.widthPct}% van viewportbreedte (vereist >= ${S.hero.minWidthPctOfViewport}%)`)

    const h1 = m.headings.find((h) => h.tag === 'h1') || m.headings[0]
    if (!h1) {
      skip(vp, 'kop over heldenvlak', 'geen h1 gevonden')
    } else {
      const ox = Math.max(0, Math.min(h1.left + h1.width, hero.left + hero.width) - Math.max(h1.left, hero.left))
      const oy = Math.max(0, Math.min(h1.bottom, hero.bottom) - Math.max(h1.top, hero.top))
      const pct = h1.width * h1.height > 0 ? Math.round(((ox * oy) / (h1.width * h1.height)) * 100) : 0
      check(vp, 'kop over heldenvlak', pct >= S.hero.minHeadingOverlapPct,
        `${pct}% overlap (vereist >= ${S.hero.minHeadingOverlapPct}%)`)
    }
  }

  // ── typografie ──
  const h1 = m.headings.find((h) => h.tag === 'h1')
  if (!h1) {
    skip(vp, 'display-grootte', 'geen h1')
    skip(vp, 'display-leading', 'geen h1')
    skip(vp, 'display-tracking', 'geen h1')
    skip(vp, 'display-gewicht', 'geen h1')
    skip(vp, 'display-uppercase', 'geen h1')
  } else {
    const minSize = isMobile ? S.display.minSizeMobile : S.display.minSizeDesktop
    check(vp, 'display-grootte', h1.fontSize >= minSize,
      `${h1.fontSize}px (vereist >= ${minSize}px)`)

    const maxLh = isMobile ? S.display.maxLineHeightMobile : S.display.maxLineHeightDesktop
    check(vp, 'display-leading', h1.lineHeightRatio !== null && h1.lineHeightRatio <= maxLh,
      `${h1.lineHeightRatio} (vereist <= ${maxLh})`)

    check(vp, 'display-tracking', h1.trackingEm !== null && h1.trackingEm >= S.display.minTrackingEm,
      `${h1.trackingEm}em (vereist >= ${S.display.minTrackingEm}em)`)

    check(vp, 'display-gewicht', h1.weight >= S.display.minWeight,
      `${h1.weight} (vereist >= ${S.display.minWeight})`)

    check(vp, 'display-uppercase', h1.transform === 'uppercase',
      `text-transform: ${h1.transform} (vereist uppercase)`)
  }

  const bodyRuns = m.body.filter((b) => b.fontSize)
  if (!bodyRuns.length) {
    skip(vp, 'body-grootte', 'geen bodytekst gevonden')
    skip(vp, 'body-leading', 'geen bodytekst gevonden')
  } else {
    const minBody = isMobile ? S.body.minSizeMobile : S.body.minSizeDesktop
    const tooSmall = bodyRuns.filter((b) => b.fontSize < minBody)
    check(vp, 'body-grootte', tooSmall.length === 0,
      tooSmall.length ? `${tooSmall.length} van ${bodyRuns.length} onder ${minBody}px (kleinste ${Math.min(...bodyRuns.map((b) => b.fontSize))}px)` : `alle ${bodyRuns.length} >= ${minBody}px`)

    const tight = bodyRuns.filter((b) => b.lineHeightRatio !== null && b.lineHeightRatio < S.body.minLineHeight)
    check(vp, 'body-leading', tight.length === 0,
      tight.length ? `${tight.length} van ${bodyRuns.length} onder ${S.body.minLineHeight} (strakste ${Math.min(...bodyRuns.filter((b) => b.lineHeightRatio).map((b) => b.lineHeightRatio))})` : `alle >= ${S.body.minLineHeight}`)
  }

  // ── knoppen ──
  const primary = m.controls.find((c) => c.isCta === 'primary')
  const ghost = m.controls.find((c) => c.isCta === 'ghost')

  if (!primary) {
    skip(vp, 'primaire CTA gevuld', 'geen [data-cta="primary"]')
    skip(vp, 'primaire CTA pil-vormig', 'geen [data-cta="primary"]')
    skip(vp, 'primaire CTA is tel:-link', 'geen [data-cta="primary"]')
  } else {
    check(vp, 'primaire CTA gevuld', primary.bg === SPEC.buttons.primaryFill,
      `${primary.bg} (vereist ${SPEC.buttons.primaryFill})`)
    const pill = primary.radiusPx >= primary.height / 2 - 1
    check(vp, 'primaire CTA pil-vormig', pill,
      `radius ${primary.radiusPx}px bij hoogte ${primary.height}px (vereist >= ${Math.round(primary.height / 2 - 1)}px)`)
    check(vp, 'primaire CTA is tel:-link', !!primary.href && primary.href.startsWith('tel:'),
      `href=${primary.href}`)
  }

  if (!ghost) {
    skip(vp, 'ghost-knop scherpe hoeken', 'geen [data-cta="ghost"]')
    skip(vp, 'ghost-knop 1px rand', 'geen [data-cta="ghost"]')
  } else {
    check(vp, 'ghost-knop scherpe hoeken', ghost.radiusPx === SPEC.buttons.ghostRadiusPx,
      `radius ${ghost.radiusPx}px (vereist ${SPEC.buttons.ghostRadiusPx}px)`)
    check(vp, 'ghost-knop 1px rand', Math.round(ghost.borderPx) === SPEC.buttons.ghostBorderPx,
      `border ${ghost.borderPx}px (vereist ${SPEC.buttons.ghostBorderPx}px)`)
  }

  if (primary && ghost) {
    check(vp, 'knopcontrast gevuld-vs-scherp',
      primary.radiusPx > ghost.radiusPx && primary.bg !== ghost.bg,
      `primair radius ${primary.radiusPx}px/${primary.bg} vs ghost radius ${ghost.radiusPx}px/${ghost.bg}`)
  } else {
    skip(vp, 'knopcontrast gevuld-vs-scherp', 'beide CTA-rollen nodig')
  }

  const shortCtas = [primary, ghost].filter(Boolean).filter((c) => c.height < SPEC.buttons.minHeightPx)
  if (primary || ghost) {
    check(vp, 'knophoogte', shortCtas.length === 0,
      shortCtas.length ? `${shortCtas.map((c) => c.height + 'px').join(', ')} onder ${SPEC.buttons.minHeightPx}px` : `>= ${SPEC.buttons.minHeightPx}px`)
  } else {
    skip(vp, 'knophoogte', 'geen CTA')
  }

  // ── invoervelden ──
  if (!m.inputs.length) {
    skip(vp, 'invoerveld alleen onderrand', 'geen invoervelden op deze pagina')
    skip(vp, 'invoerveld geen radius', 'geen invoervelden op deze pagina')
  } else {
    const bad = m.inputs.filter((i) => !(i.top === 0 && i.right === 0 && i.left === 0 && i.bottom >= 1))
    check(vp, 'invoerveld alleen onderrand', bad.length === 0,
      bad.length ? `${bad.length} van ${m.inputs.length} fout, bv. t${bad[0].top}/r${bad[0].right}/b${bad[0].bottom}/l${bad[0].left}` : `alle ${m.inputs.length} velden`)
    const rounded = m.inputs.filter((i) => i.radiusPx !== 0)
    check(vp, 'invoerveld geen radius', rounded.length === 0,
      rounded.length ? `${rounded.length} met radius, grootste ${Math.max(...rounded.map((i) => i.radiusPx))}px` : 'alle radius 0')
  }

  // ── de don'ts ──
  check(vp, 'geen verlopen', m.gradients <= SPEC.color.maxGradients,
    `${m.gradients} gradient-elementen (max ${SPEC.color.maxGradients})`)
  check(vp, 'geen schaduwen', m.shadows <= SPEC.color.maxShadows,
    `${m.shadows} elementen met box-shadow (max ${SPEC.color.maxShadows})`)

  const offPalette = [...m.bgColors, ...m.fgColors].filter((c) => !SPEC.color.palette.includes(c))
  check(vp, 'palet gesloten', offPalette.length === 0,
    offPalette.length ? `buiten palet: ${[...new Set(offPalette)].slice(0, 6).join(', ')}` : `${m.bgColors.length} vlak- en ${m.fgColors.length} tekstkleuren, alle in palet`)

  // ── scrim ──
  if (hero) {
    const scrim = m.sections.concat(m.slots).some((s) => s.bg === '#000000')
    check(vp, 'geen scrim op heldenvlak', !scrim, scrim ? 'zwart vlak gevonden over het heldenvlak' : 'tekst staat direct op het vlak')
  } else {
    skip(vp, 'geen scrim op heldenvlak', 'geen heldenvlak')
  }

  // ── kleurritme tussen secties ──
  if (m.sections.length < 2) {
    skip(vp, 'kleurritme secties', `${m.sections.length} sectie(s) — nog te weinig om ritme te meten`)
  } else {
    const bgs = m.sections.map((s) => s.bg)
    const flips = bgs.filter((b, i) => i > 0 && b !== bgs[i - 1]).length
    check(vp, 'kleurritme secties', flips >= 1,
      `${flips} harde kleurwissel(s) over ${m.sections.length} secties: ${bgs.join(' -> ')}`)
  }

  // ── sectieafstand ──
  const minGap = isMobile ? SPEC.spacing.minSectionGapMobile : SPEC.spacing.minSectionGapDesktop
  const padded = m.sections.filter((s) => s.paddingTop > 0 || s.paddingBottom > 0)
  if (!padded.length) {
    skip(vp, 'sectie-ademruimte', 'geen secties met padding')
  } else {
    const thin = padded.filter((s) => Math.max(s.paddingTop, s.paddingBottom) < minGap)
    check(vp, 'sectie-ademruimte', thin.length === 0,
      thin.length ? `${thin.length} van ${padded.length} onder ${minGap}px (dunste ${Math.round(Math.min(...padded.map((s) => Math.max(s.paddingTop, s.paddingBottom))))}px)` : `alle >= ${minGap}px`)
  }
}

// ── run ─────────────────────────────────────────────────────────────────────
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

for (const vp of VIEWPORTS) {
  // reduced motion aan: GSAP-reveals slaan hun tween over en laten de content
  // zichtbaar staan, zodat de gate compositie meet en geen animatiemoment.
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  const url = `${BASE}/${LOCALE}${PATHNAME === '/' ? '' : PATHNAME}`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(700)
  const m = await page.evaluate(probe, UNIT ? `[data-unit="${UNIT}"]` : null)
  if (m.missingRoot) {
    console.error(`\nFAIL  eenheid niet gevonden — geen element [data-unit="${UNIT}"] op ${url}`)
    await browser.close()
    process.exit(1)
  }
  assertViewport(vp.name, m)
  await ctx.close()
}
await browser.close()

// ── rapport ─────────────────────────────────────────────────────────────────
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n)
let failed = 0
let passed = 0
let skipped = 0

console.log(`\nrefero-gate — ${BASE}/${LOCALE}${PATHNAME === '/' ? '' : PATHNAME}${UNIT ? `  [eenheid: ${UNIT}]` : '  [hele pagina]'}`)
console.log('SPEC: docs/design/mrpops-reference-spec.md (gemeten aan mrpops.ua/en)\n')

for (const r of results) {
  if (r.ok === null) {
    skipped++
    console.log(`SKIP  [${pad(r.vp, 7)}] ${pad(r.name, 32)} — ${r.detail}`)
  } else if (r.ok) {
    passed++
    console.log(`PASS  [${pad(r.vp, 7)}] ${pad(r.name, 32)} — ${r.detail}`)
  } else {
    failed++
    console.log(`FAIL  [${pad(r.vp, 7)}] ${pad(r.name, 32)} — ${r.detail}`)
  }
}

console.log(`\n${passed} pass · ${failed} fail · ${skipped} skip`)
process.exit(failed > 0 ? 1 : 0)
