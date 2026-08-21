// Gauntlet-gate — de TECHNISCHE lat naast scripts/refero-gate.mjs.
//
// refero-gate meet de VORM (typeschaal, kleur, knoppen, ritme) tegen de gemeten
// Mr. Pops-referentie. Deze gate meet of het ding ook echt WERKT: staat de echte
// menukaart er letterlijk in, kloppen de bedrijfsgegevens, draaien alle drie de
// talen, zijn de tel:-links belbaar, is de console schoon, springt de layout niet
// bij fontload, is toetsenbordfocus zichtbaar, en houdt de pagina zich aan de
// a11y-basis.
//
// Net als refero-gate faalt hij met GETALLEN, niet met meningen.
//
// Gebruik:  node scripts/gauntlet-gate.mjs [http://localhost:3000] [--build]
//
//   --build  voert daarnaast `npm run build` uit en faalt op een non-zero exit.
//            Zonder de vlag wordt die assertie overgeslagen (te traag voor een
//            snelle iteratieronde).
//
// Bronnen van waarheid (worden geparsed, niet gekopieerd):
//   src/lib/menu-data.ts  → de 19 gerechten met M/L-prijzen
//   src/lib/phone.ts      → de twee bestelnummers
//   src/lib/format.ts     → de notatie "€ 17 / 22" (hier 1-op-1 nagebouwd)

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:3000'
const WITH_BUILD = process.argv.includes('--build')

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

// ── SPEC — de harde grenzen van deze gate ───────────────────────────────────
const SPEC = {
  dishCount: 19,             // de gedrukte kaart telt 19 regels (src/lib/menu-data.ts)
  maxCls: 0.02,              // fontload mag de layout niet verschuiven
  focusStops: 15,
  focusSettleMs: 320,   // > de langste transition-duration in de UI (200ms)
  telPrefix: '+32',          // E.164, Belgisch
  locales: ['nl', 'fr', 'en'],
  businessAddress: ['Brusselsesteenweg 455', '9050 Gentbrugge'],
  businessEmail: 'info@tajine2go.be',
}

// Pagina's waarop de console schoon moet zijn (opdracht 5).
const CONSOLE_PATHS = ['/nl', '/fr', '/en', '/nl/menu', '/nl/catering']
// Pagina's waarop de a11y-basis geldt.
const A11Y_PATHS = ['/nl', '/fr', '/en', '/nl/menu', '/nl/catering', '/nl/contact']
// Alle pagina's die de gate bezoekt, in bezoekvolgorde.
const VISIT_PATHS = ['/nl', '/nl/menu', '/nl/catering', '/nl/contact', '/fr', '/en']

// Bekende ruis van de Next dev-server. Deze lijst filtert UITSLUITEND
// waarschuwingen — een console.error wordt nooit weggefilterd.
const DEV_WARNING_NOISE = [
  /metadataBase/i,
  /Download the React DevTools/i,
  /React DevTools/i,
  /Fast Refresh/i,
  /\[HMR\]/i,
  /Turbopack/i,
  /source ?map/i,
  /was preloaded using link preload but not used/i,
  /Lit is in dev mode/i,
]

// ── bron 1: de 19 gerechten uit src/lib/menu-data.ts ────────────────────────
// Bewust met een regexp en niet met een import: menu-data.ts is TypeScript en
// draagt `import "server-only"`, dus node kan het niet laden.
function parseDishes() {
  const src = readFileSync(path.join(ROOT, 'src/lib/menu-data.ts'), 'utf8')
  const start = src.indexOf('const FALLBACK_DISHES')
  if (start === -1) throw new Error('FALLBACK_DISHES niet gevonden in src/lib/menu-data.ts')
  const end = src.indexOf('\n];', start)
  if (end === -1) throw new Error('einde van FALLBACK_DISHES niet gevonden in src/lib/menu-data.ts')
  const block = src.slice(start, end)

  const re = /fallbackDish\(\s*"([^"]+)"\s*,\s*\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*(?:,\s*(\d+)\s*)?,?\s*\)/g

  const dishes = []
  let m
  while ((m = re.exec(block)) !== null) {
    const priceCents = Number(m[6])
    const priceLCents = m[7] === undefined ? null : Number(m[7])
    dishes.push({
      slug: m[1],
      nl: m[2],
      fr: m[3],
      en: m[4],
      category: m[5],
      priceCents,
      priceLCents,
      price: formatMenuPrice(priceCents, priceLCents),
    })
  }
  return dishes
}

// 1-op-1 nagebouwd uit src/lib/format.ts — "€ 17 / 22" resp. "€ 5,50".
function euroCompact(cents) {
  return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2).replace('.', ',')
}
function formatMenuPrice(priceCents, priceLCents) {
  const base = `€ ${euroCompact(priceCents)}`
  return priceLCents ? `${base} / ${euroCompact(priceLCents)}` : base
}

// ── bron 2: de bestelnummers uit src/lib/phone.ts ───────────────────────────
function parsePhones() {
  const src = readFileSync(path.join(ROOT, 'src/lib/phone.ts'), 'utf8')
  const re = /\{\s*display:\s*"([^"]+)"\s*,\s*tel:\s*"([^"]+)"\s*\}/g
  const phones = []
  let m
  while ((m = re.exec(src)) !== null) phones.push({ display: m[1], tel: m[2] })
  if (!phones.length) throw new Error('ORDER_PHONE_NUMBERS niet gevonden in src/lib/phone.ts')
  return phones
}

// ── meetsonde, draait in de pagina ──────────────────────────────────────────
// payload: { needles: string[], dishes: {nl, price}[] }
const probe = (payload) => {
  // nbsp en narrow-nbsp tellen als gewone spatie; daarna alle witruimte platslaan,
  // zodat "€ 17 / 22" ook over element- en regelgrenzen heen matcht.
  const norm = (s) => (s || '').replace(/[\u00a0\u202f]/g, ' ').replace(/\s+/g, ' ').trim()
  const pageText = norm(document.body ? document.body.textContent : '')

  // -- letterlijke tekstvondsten (bedrijfsgegevens, dish-namen) --
  const needles = (payload.needles || []).map((n) => ({ needle: n, found: pageText.includes(norm(n)) }))

  // -- gerechten: naam moet er staan én de prijs moet bij die naam horen --
  const dishHits = (payload.dishes || []).map((d) => {
    const wanted = norm(d.nl)
    let host = null
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li,td,th,a,strong,em,b')) {
      if (norm(el.textContent) !== wanted) continue
      if (host === null || el.querySelectorAll('*').length < host.querySelectorAll('*').length) host = el
    }
    const nameFound = host !== null || pageText.includes(wanted)

    let priceNearName = false
    let nearby = ''
    if (host) {
      let node = host
      for (let i = 0; i < 5 && node; i += 1) {
        const t = norm(node.textContent)
        if (t.includes(norm(d.price))) { priceNearName = true; break }
        nearby = t.slice(0, 90)
        node = node.parentElement
      }
    }
    return {
      nl: d.nl,
      price: d.price,
      nameFound,
      hostFound: host !== null,
      priceOnPage: pageText.includes(norm(d.price)),
      priceNearName,
      nearby,
    }
  })

  // -- tel:-links --
  const telLinks = [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href'))

  // -- koppen --
  const h1s = [...document.querySelectorAll('h1')].map((h) => norm(h.textContent))

  // ── a11y-basis ────────────────────────────────────────────────────────────
  // NB: axe-core zit NIET in node_modules en mag van de opdracht niet
  // geïnstalleerd worden. Onderstaande zes controles zijn de bewuste,
  // compacte vervanger daarvoor: img-alt, toegankelijke naam op a/button,
  // labelkoppeling op formuliervelden, koppenhiërarchie, één h1, html[lang].
  // Het is geen volledige WCAG-scan, wel de basis die hier stuk kan gaan.
  const a11yHidden = (el) => {
    if (el.closest('[aria-hidden="true"]')) return true
    if (el.hasAttribute('hidden')) return true
    const cs = getComputedStyle(el)
    return cs.display === 'none' || cs.visibility === 'hidden'
  }
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : ''
    const cls = el.getAttribute('class') ? `.${el.getAttribute('class').split(/\s+/)[0]}` : ''
    const txt = norm(el.textContent).slice(0, 28)
    return `${el.tagName.toLowerCase()}${id}${cls}${txt ? ` "${txt}"` : ''}`
  }
  const labelledBy = (el) => {
    const ref = el.getAttribute('aria-labelledby')
    if (!ref) return ''
    return ref.split(/\s+/).map((r) => {
      const t = document.getElementById(r)
      return t ? norm(t.textContent) : ''
    }).join(' ').trim()
  }
  const accName = (el) => {
    const aria = norm(el.getAttribute('aria-label'))
    if (aria) return aria
    const by = labelledBy(el)
    if (by) return by
    const txt = norm(el.textContent)
    if (txt) return txt
    const title = norm(el.getAttribute('title'))
    if (title) return title
    for (const img of el.querySelectorAll('img')) {
      const alt = norm(img.getAttribute('alt'))
      if (alt) return alt
    }
    for (const svg of el.querySelectorAll('svg')) {
      const t = svg.querySelector('title')
      if (t && norm(t.textContent)) return norm(t.textContent)
      const aria2 = norm(svg.getAttribute('aria-label'))
      if (aria2) return aria2
    }
    const val = norm(el.getAttribute('value'))
    return val
  }

  // (a) elke img heeft een alt-attribuut
  const imgNoAlt = [...document.querySelectorAll('img')]
    .filter((el) => !el.hasAttribute('alt'))
    .map((el) => `img[src="${(el.getAttribute('src') || '').slice(-40)}"]`)

  // (b) elke a en button heeft een toegankelijke naam
  const ctrlNoName = [...document.querySelectorAll('a[href], button, [role="button"]')]
    .filter((el) => !a11yHidden(el))
    .filter((el) => !accName(el))
    .map(describe)

  // (c) elk formulierveld heeft een gekoppeld label
  const SKIP_TYPES = new Set(['hidden', 'submit', 'button', 'reset', 'image'])
  const fieldNoLabel = [...document.querySelectorAll('input, select, textarea')]
    .filter((el) => !SKIP_TYPES.has((el.getAttribute('type') || '').toLowerCase()))
    .filter((el) => !a11yHidden(el))
    .filter((el) => {
      if (norm(el.getAttribute('aria-label'))) return false
      if (labelledBy(el)) return false
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false
      if (el.closest('label')) return false
      if (norm(el.getAttribute('title'))) return false
      return true
    })
    .map((el) => `${el.tagName.toLowerCase()}[name="${el.getAttribute('name') || ''}"]`)

  // (d) de koppenhiërarchie slaat geen niveau over
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter((el) => !a11yHidden(el))
    .map((el) => ({ level: Number(el.tagName[1]), text: norm(el.textContent).slice(0, 32) }))
  const headingJumps = []
  let prev = 0
  for (const h of headings) {
    if (prev !== 0 && h.level > prev + 1) headingJumps.push(`h${prev} -> h${h.level} bij "${h.text}"`)
    prev = h.level
  }

  return {
    needles,
    dishHits,
    telLinks,
    h1s,
    lang: document.documentElement.getAttribute('lang'),
    a11y: {
      imgNoAlt,
      ctrlNoName,
      fieldNoLabel,
      headingJumps,
      headingCount: headings.length,
      h1Count: document.querySelectorAll('h1').length,
      imgCount: document.querySelectorAll('img').length,
      ctrlCount: document.querySelectorAll('a[href], button, [role="button"]').length,
      fieldCount: document.querySelectorAll('input, select, textarea').length,
      hasLang: !!(document.documentElement.getAttribute('lang') || '').trim(),
    },
    cls: typeof window.__cls === 'number' ? +window.__cls.toFixed(4) : null,
    clsEntries: window.__clsEntries || 0,
  }
}

// ── assertiemachine ─────────────────────────────────────────────────────────
const results = []
const check = (vp, name, ok, detail) => results.push({ vp, name, ok, detail })
const skip = (vp, name, why) => results.push({ vp, name, ok: null, detail: why })

const DISHES = parseDishes()
const PHONES = parsePhones()

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

for (const vp of VIEWPORTS) {
  // reduced motion aan, net als in refero-gate: GSAP-reveals slaan hun tween
  // over, zodat we de eindtoestand meten en geen animatiemoment.
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
  })

  // CLS-teller vóór elke navigatie installeren, zodat ook shifts tijdens de
  // eerste paint (fontload) meetellen.
  await ctx.addInitScript(() => {
    window.__cls = 0
    window.__clsEntries = 0
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value
            window.__clsEntries += 1
          }
        }
      }).observe({ type: 'layout-shift', buffered: true })
    } catch {
      window.__cls = null
    }
  })

  const page = await ctx.newPage()

  let currentPath = ''
  const consoleErrors = []
  const consoleWarnings = []
  let ignoredWarnings = 0

  page.on('console', (msg) => {
    const type = msg.type()
    const text = msg.text()
    if (type === 'error') {
      consoleErrors.push({ path: currentPath, text })
      return
    }
    if (type !== 'warning') return
    // De ruisfilter geldt alleen voor waarschuwingen, nooit voor errors.
    if (DEV_WARNING_NOISE.some((re) => re.test(text))) { ignoredWarnings += 1; return }
    consoleWarnings.push({ path: currentPath, text })
  })
  page.on('pageerror', (err) => {
    consoleErrors.push({ path: currentPath, text: `pageerror: ${err && err.message ? err.message : String(err)}` })
  })

  const measured = new Map()
  const statuses = new Map()

  for (const p of VISIT_PATHS) {
    currentPath = p
    let res = null
    try {
      res = await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle', timeout: 60000 })
    } catch (err) {
      statuses.set(p, `navigatiefout: ${err && err.message ? err.message.split('\n')[0] : String(err)}`)
      continue
    }
    statuses.set(p, res ? res.status() : 0)
    // fonts laten settelen: hier ontstaat de CLS die we willen vangen
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null)).catch(() => {})
    await page.waitForTimeout(900)

    measured.set(p, await page.evaluate(probe, {
      needles: p === '/nl' || p === '/nl/contact'
        ? [...SPEC.businessAddress, SPEC.businessEmail, ...PHONES.map((x) => x.display)]
        : [],
      dishes: p === '/nl/menu' ? DISHES.map((d) => ({ nl: d.nl, price: d.price })) : [],
    }))

    // ── 7. toetsenbordfocus: alleen op /nl, direct na het meten ──
    if (p === '/nl') {
      await page.evaluate(() => {
        window.__gf = []
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur()
        window.scrollTo(0, 0)
      })
      const stops = []
      for (let i = 0; i < SPEC.focusStops; i += 1) {
        await page.keyboard.press('Tab')
        // Meet pas nadat lopende transities klaar zijn: componenten met
        // `transition-all` animeren ook outline-width, en direct na de Tab staat
        // die ring nog op 0. Zonder deze wachttijd meldt de gate valse fouten.
        await page.waitForTimeout(SPEC.focusSettleMs)
        const stop = await page.evaluate(() => {
          const el = document.activeElement
          if (!el || el === document.body || el === document.documentElement) return null
          window.__gf.push(el)
          const cs = getComputedStyle(el)
          const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()
          return {
            tag: el.tagName.toLowerCase(),
            label: (norm(el.getAttribute('aria-label')) || norm(el.textContent) || norm(el.getAttribute('href')) || '(naamloos)').slice(0, 32),
            outlineWidth: parseFloat(cs.outlineWidth) || 0,
            outlineStyle: cs.outlineStyle,
            boxShadow: cs.boxShadow,
          }
        })
        if (!stop) break
        stops.push(stop)
      }
      const baselines = await page.evaluate(() => {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur()
        return (window.__gf || []).map((el) => {
          const cs = getComputedStyle(el)
          return {
            outlineWidth: parseFloat(cs.outlineWidth) || 0,
            outlineStyle: cs.outlineStyle,
            boxShadow: cs.boxShadow,
          }
        })
      })
      measured.get('/nl').focusStops = stops.map((s, i) => ({ ...s, baseline: baselines[i] || null }))
    }
  }

  // ── 1. content byte-identiek aan de bron ───────────────────────────────────
  const menu = measured.get('/nl/menu')
  if (!menu) {
    skip(vp.name, `content: ${SPEC.dishCount} gerechtsnamen`, '/nl/menu niet geladen')
    skip(vp.name, `content: ${SPEC.dishCount} M/L-prijzen`, '/nl/menu niet geladen')
  } else {
    check(vp.name, 'bron: aantal gerechten', DISHES.length === SPEC.dishCount,
      `${DISHES.length} in src/lib/menu-data.ts (vereist ${SPEC.dishCount})`)

    const missingNames = menu.dishHits.filter((d) => !d.nameFound).map((d) => d.nl)
    check(vp.name, `content: ${SPEC.dishCount} gerechtsnamen`, missingNames.length === 0,
      missingNames.length
        ? `${missingNames.length}/${menu.dishHits.length} ontbreekt: ${missingNames.slice(0, 6).join(' | ')}`
        : `alle ${menu.dishHits.length} NL-namen letterlijk in de DOM`)

    const badPrices = menu.dishHits.filter((d) => d.nameFound && !d.priceNearName)
    check(vp.name, `content: ${SPEC.dishCount} M/L-prijzen`, badPrices.length === 0,
      badPrices.length
        ? `${badPrices.length}/${menu.dishHits.length} wijkt af: ${badPrices.slice(0, 4).map((d) => {
          if (!d.hostFound) return `${d.nl}: naam staat niet als eigen element, prijs "${d.price}" niet te koppelen`
          const where = d.priceOnPage ? 'staat wel elders op de pagina' : 'nergens op de pagina'
          return `${d.nl} verwacht "${d.price}" (${where}); nabije tekst: "${d.nearby}"`
        }).join(' | ')}`
        : `alle ${menu.dishHits.length} prijzen exact bij hun gerecht (bv. "${menu.dishHits[0].price}")`)
  }

  // ── 2. bedrijfsgegevens ────────────────────────────────────────────────────
  const bizPages = ['/nl', '/nl/contact'].filter((p) => measured.has(p))
  const foundOn = (needle) => bizPages.filter((p) => (measured.get(p).needles.find((n) => n.needle === needle) || {}).found)
  if (!bizPages.length) {
    skip(vp.name, 'bedrijfsgegevens: adres', 'geen /nl of /nl/contact geladen')
    skip(vp.name, 'bedrijfsgegevens: e-mail', 'geen /nl of /nl/contact geladen')
    skip(vp.name, 'bedrijfsgegevens: telefoon', 'geen /nl of /nl/contact geladen')
  } else {
    const addrMissing = SPEC.businessAddress.filter((a) => foundOn(a).length === 0)
    check(vp.name, 'bedrijfsgegevens: adres', addrMissing.length === 0,
      addrMissing.length
        ? `ontbreekt op ${bizPages.join(' en ')}: ${addrMissing.join(' + ')}`
        : SPEC.businessAddress.map((a) => `"${a}" op ${foundOn(a).join(',')}`).join(' · '))

    const mailPages = foundOn(SPEC.businessEmail)
    check(vp.name, 'bedrijfsgegevens: e-mail', mailPages.length > 0,
      mailPages.length ? `"${SPEC.businessEmail}" op ${mailPages.join(',')}` : `"${SPEC.businessEmail}" op geen van ${bizPages.join(',')}`)

    const phoneMissing = PHONES.filter((ph) => foundOn(ph.display).length === 0)
    check(vp.name, 'bedrijfsgegevens: telefoon', phoneMissing.length === 0,
      phoneMissing.length
        ? `${phoneMissing.length}/${PHONES.length} ontbreekt: ${phoneMissing.map((p) => p.display).join(' + ')}`
        : `${PHONES.map((p) => `"${p.display}" op ${foundOn(p.display).join(',')}`).join(' · ')}`)
  }

  // ── 3. drie talen ──────────────────────────────────────────────────────────
  const localePaths = SPEC.locales.map((l) => `/${l}`)
  const badStatus = localePaths.filter((p) => statuses.get(p) !== 200)
  check(vp.name, 'drie talen: HTTP 200', badStatus.length === 0,
    badStatus.length
      ? badStatus.map((p) => `${p} -> ${statuses.get(p)}`).join(', ')
      : localePaths.map((p) => `${p} 200`).join(' · '))

  const noH1 = localePaths.filter((p) => {
    const m = measured.get(p)
    return !m || !m.h1s.some((t) => t.length > 0)
  })
  check(vp.name, 'drie talen: h1 met tekst', noH1.length === 0,
    noH1.length
      ? `geen niet-lege h1 op ${noH1.join(', ')}`
      : localePaths.map((p) => `${p} "${(measured.get(p).h1s.find((t) => t.length > 0) || '').slice(0, 22)}"`).join(' · '))

  const badLang = localePaths.filter((p) => {
    const m = measured.get(p)
    const want = p.slice(1)
    return !m || !m.lang || m.lang.toLowerCase().split('-')[0] !== want
  })
  check(vp.name, 'drie talen: html lang correct', badLang.length === 0,
    badLang.length
      ? badLang.map((p) => `${p} -> lang=${measured.get(p) ? JSON.stringify(measured.get(p).lang) : 'n.v.t.'}`).join(', ')
      : localePaths.map((p) => `${p}=${measured.get(p).lang}`).join(' · '))

  // ── 4. tel:-links ──────────────────────────────────────────────────────────
  const allTel = [...new Set([...measured.values()].flatMap((m) => m.telLinks))]
  const wantedTel = new Set(PHONES.map((p) => p.tel))
  if (!allTel.length) {
    check(vp.name, 'tel-links: aanwezig', false,
      `0 a[href^="tel:"] op ${VISIT_PATHS.join(', ')} (verwacht ${PHONES.map((p) => p.tel).join(' + ')})`)
    skip(vp.name, 'tel-links: E.164', 'geen tel:-links gevonden')
    skip(vp.name, 'tel-links: uit phone.ts', 'geen tel:-links gevonden')
  } else {
    check(vp.name, 'tel-links: aanwezig', true, `${allTel.length} uniek(e) tel:-href(s)`)

    const e164 = new RegExp(`^tel:\\${SPEC.telPrefix}\\d+$`)
    const badForm = allTel.filter((h) => !e164.test(h))
    check(vp.name, 'tel-links: E.164', badForm.length === 0,
      badForm.length
        ? `${badForm.length}/${allTel.length} fout: ${badForm.join(', ')} (vereist tel:${SPEC.telPrefix}<cijfers>)`
        : `alle ${allTel.length} in de vorm tel:${SPEC.telPrefix}<cijfers>`)

    const numbers = allTel.map((h) => h.replace(/^tel:/, ''))
    const unknown = numbers.filter((n) => !wantedTel.has(n))
    const missing = [...wantedTel].filter((n) => !numbers.includes(n))
    check(vp.name, 'tel-links: uit phone.ts', unknown.length === 0 && missing.length === 0,
      unknown.length || missing.length
        ? `${unknown.length} onbekend (${unknown.join(', ') || '-'}), ${missing.length} ontbreekt (${missing.join(', ') || '-'})`
        : `${numbers.length} href(s) === ORDER_PHONE_NUMBERS (${[...wantedTel].join(', ')})`)
  }

  // ── 5. geen console errors ─────────────────────────────────────────────────
  const scopedErrors = consoleErrors.filter((e) => CONSOLE_PATHS.includes(e.path))
  const scopedWarnings = consoleWarnings.filter((w) => CONSOLE_PATHS.includes(w.path))
  check(vp.name, 'geen console errors', scopedErrors.length === 0,
    scopedErrors.length
      ? `${scopedErrors.length} error(s) op ${CONSOLE_PATHS.length} pagina's: ${scopedErrors.slice(0, 4).map((e) => `[${e.path}] ${e.text.replace(/\s+/g, ' ').slice(0, 110)}`).join(' || ')}`
      : `0 errors over ${CONSOLE_PATHS.join(', ')} (${scopedWarnings.length} waarschuwing(en), ${ignoredWarnings} bekende dev-ruis genegeerd)`)

  // ── 6. geen CLS bij fontload ───────────────────────────────────────────────
  const home = measured.get('/nl')
  if (!home || home.cls === null) {
    skip(vp.name, 'geen CLS bij fontload', home ? 'PerformanceObserver layout-shift niet ondersteund' : '/nl niet geladen')
  } else {
    check(vp.name, 'geen CLS bij fontload', home.cls <= SPEC.maxCls,
      `CLS ${home.cls} over ${home.clsEntries} shift(s) op /nl (max ${SPEC.maxCls})`)
  }

  // ── 7. toetsenbordfocus zichtbaar ──────────────────────────────────────────
  const stops = home && home.focusStops ? home.focusStops : []
  if (!stops.length) {
    skip(vp.name, 'toetsenbordfocus zichtbaar', '/nl leverde geen focusbare elementen op')
  } else {
    const invisible = stops.filter((s) => {
      const hasOutline = s.outlineWidth > 0 && s.outlineStyle !== 'none'
      const base = s.baseline || { boxShadow: 'none', outlineWidth: 0 }
      const hasRing = s.boxShadow && s.boxShadow !== 'none' && s.boxShadow !== base.boxShadow
      const grewOutline = s.outlineWidth > base.outlineWidth
      return !(hasOutline || hasRing || grewOutline)
    })
    check(vp.name, 'toetsenbordfocus zichtbaar', invisible.length === 0,
      invisible.length
        ? `${invisible.length}/${stops.length} tabstops zonder zichtbaar verschil: ${invisible.slice(0, 5).map((s) => `${s.tag} "${s.label}"`).join(' | ')}`
        : `alle ${stops.length} tabstops krijgen outline of ring`)
  }

  // ── 8. a11y-basis (vervanger voor axe-core, zie sonde) ─────────────────────
  const a11yPages = A11Y_PATHS.filter((p) => measured.has(p))
  if (!a11yPages.length) {
    for (const n of ['a11y: img heeft alt', 'a11y: a/button heeft naam', 'a11y: veld heeft label',
      'a11y: koppenhiërarchie', 'a11y: precies één h1', 'a11y: html[lang]']) {
      skip(vp.name, n, 'geen pagina geladen')
    }
  } else {
    const agg = (key) => a11yPages
      .flatMap((p) => measured.get(p).a11y[key].map((x) => `[${p}] ${x}`))
    const sum = (key) => a11yPages.reduce((acc, p) => acc + measured.get(p).a11y[key], 0)

    const noAlt = agg('imgNoAlt')
    check(vp.name, 'a11y: img heeft alt', noAlt.length === 0,
      noAlt.length ? `${noAlt.length}/${sum('imgCount')} zonder alt: ${noAlt.slice(0, 4).join(' | ')}` : `${sum('imgCount')} img's, alle met alt`)

    const noName = agg('ctrlNoName')
    check(vp.name, 'a11y: a/button heeft naam', noName.length === 0,
      noName.length ? `${noName.length}/${sum('ctrlCount')} zonder naam: ${noName.slice(0, 4).join(' | ')}` : `${sum('ctrlCount')} links/knoppen, alle met naam`)

    const noLabel = agg('fieldNoLabel')
    check(vp.name, 'a11y: veld heeft label', noLabel.length === 0,
      noLabel.length ? `${noLabel.length}/${sum('fieldCount')} zonder label: ${noLabel.slice(0, 4).join(' | ')}` : `${sum('fieldCount')} formuliervelden, alle gelabeld`)

    const jumps = agg('headingJumps')
    check(vp.name, 'a11y: koppenhiërarchie', jumps.length === 0,
      jumps.length ? `${jumps.length} oversla(a)g(en): ${jumps.slice(0, 4).join(' | ')}` : `${sum('headingCount')} koppen over ${a11yPages.length} pagina's, geen niveau overgeslagen`)

    const badH1 = a11yPages.filter((p) => measured.get(p).a11y.h1Count !== 1)
    check(vp.name, 'a11y: precies één h1', badH1.length === 0,
      badH1.length ? badH1.map((p) => `${p} heeft ${measured.get(p).a11y.h1Count}`).join(', ') : `alle ${a11yPages.length} pagina's exact 1 h1`)

    const noLang = a11yPages.filter((p) => !measured.get(p).a11y.hasLang)
    check(vp.name, 'a11y: html[lang]', noLang.length === 0,
      noLang.length ? `ontbreekt op ${noLang.join(', ')}` : `alle ${a11yPages.length} pagina's hebben html[lang]`)
  }

  await ctx.close()
}
await browser.close()

// ── 9. build ────────────────────────────────────────────────────────────────
// Bewust buiten de viewportlus: `npm run build` is te traag voor elke ronde en
// draait alleen met --build.
if (!WITH_BUILD) {
  skip('build', 'npm run build', 'niet gedraaid — start met --build')
} else {
  const started = Date.now()
  const out = spawnSync('npm', ['run', 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 15 * 60 * 1000,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const secs = Math.round((Date.now() - started) / 1000)
  const combined = `${out.stdout || ''}${out.stderr || ''}`
  if (out.error) {
    check('build', 'npm run build', false, `kon niet starten: ${out.error.message}`)
  } else if (out.status !== 0) {
    const tail = combined.split('\n').filter((l) => l.trim()).slice(-8).join(' ⏎ ')
    check('build', 'npm run build', false, `exit ${out.status} na ${secs}s — ${tail.slice(0, 900)}`)
  } else {
    check('build', 'npm run build', true, `exit 0 na ${secs}s`)
  }
}

// ── rapport ─────────────────────────────────────────────────────────────────
const pad = (s, n) => (String(s) + ' '.repeat(n)).slice(0, n)
let failed = 0
let passed = 0
let skipped = 0

console.log(`\ngauntlet-gate — ${BASE}${WITH_BUILD ? '  [+ npm run build]' : ''}`)
console.log(`bronnen: src/lib/menu-data.ts (${DISHES.length} gerechten) · src/lib/phone.ts (${PHONES.length} nummers)`)
console.log(`pagina's: ${VISIT_PATHS.join(' ')}\n`)

for (const r of results) {
  if (r.ok === null) {
    skipped++
    console.log(`SKIP  [${pad(r.vp, 7)}] ${pad(r.name, 34)} — ${r.detail}`)
  } else if (r.ok) {
    passed++
    console.log(`PASS  [${pad(r.vp, 7)}] ${pad(r.name, 34)} — ${r.detail}`)
  } else {
    failed++
    console.log(`FAIL  [${pad(r.vp, 7)}] ${pad(r.name, 34)} — ${r.detail}`)
  }
}

console.log(`\n${passed} pass · ${failed} fail · ${skipped} skip`)
process.exit(failed > 0 ? 1 : 0)
