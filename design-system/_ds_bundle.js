/* @ds-bundle: {"format":4,"namespace":"Tajine2GoDesignSystem_2aba92","components":[{"name":"ArchFrame","sourcePath":"components/core/ArchFrame.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ContactRow","sourcePath":"components/core/ContactRow.jsx"},{"name":"DishCard","sourcePath":"components/core/DishCard.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"OrderBar","sourcePath":"components/core/OrderBar.jsx"},{"name":"Ornament","sourcePath":"components/core/Ornament.jsx"},{"name":"SectionDark","sourcePath":"components/core/SectionDark.jsx"}],"sourceHashes":{"assets/data/menu.js":"bc3ac3b4ed71","components/core/ArchFrame.jsx":"42279e8fcd92","components/core/Button.jsx":"c8565aae07a2","components/core/ContactRow.jsx":"3e565de923ab","components/core/DishCard.jsx":"9650cfde1914","components/core/Eyebrow.jsx":"d9cf1b7a7991","components/core/OrderBar.jsx":"29896c46a8d2","components/core/Ornament.jsx":"bc5328e2b849","components/core/SectionDark.jsx":"f3d2c0c44a5d","image-slot.js":"fff26d081c8d","ui_kits/website/Contact.jsx":"3d57b6be009d","ui_kits/website/Home.jsx":"cfabacfbfc3e","ui_kits/website/Menu.jsx":"545861b9e7ec","ui_kits/website/SiteNav.jsx":"e25a9c038738","ui_kits/website/tweaks-panel.jsx":"d259e3a86f73"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.Tajine2GoDesignSystem_2aba92 = window.Tajine2GoDesignSystem_2aba92 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/data/menu.js
try { (() => {
// Officiële menudata Tajine2Go (bron: eigenaar, aug 2026). Prijzen M/L of vast.
const menu = {
  tajines: {
    label: {
      nl: 'Tajines',
      fr: 'Tajines',
      en: 'Tagines'
    },
    sizes: ['M', 'L'],
    items: [{
      nl: 'Tajine Royal (Runds)',
      fr: 'Tajine Royale (bœuf)',
      en: 'Tajine Royal (beef)',
      M: '€ 17',
      L: '€ 22'
    }, {
      nl: 'Tajine Kefta',
      fr: 'Tajine Kefta',
      en: 'Kefta tagine',
      M: '€ 13',
      L: '€ 18'
    }, {
      nl: 'Tajine Kip en groenten',
      fr: 'Tajine Poulet et légumes',
      en: 'Chicken & vegetable tagine',
      M: '€ 15',
      L: '€ 20'
    }, {
      nl: 'Tajine Veggie',
      fr: 'Tajine Végé',
      en: 'Veggie tagine',
      M: '€ 13',
      L: '€ 18'
    }, {
      nl: 'Tajine Kip met citroen en olijven',
      fr: 'Tajine Poulet au citron et olives',
      en: 'Chicken tagine with lemon & olives',
      M: '€ 15',
      L: '€ 20'
    }]
  },
  couscous: {
    label: {
      nl: 'Couscous',
      fr: 'Couscous',
      en: 'Couscous'
    },
    sizes: ['M', 'L'],
    items: [{
      nl: 'Couscous Kip Merguez',
      fr: 'Couscous Poulet Merguez',
      en: 'Chicken & merguez couscous',
      M: '€ 17',
      L: '€ 22'
    }, {
      nl: 'Couscous Kip',
      fr: 'Couscous Poulet',
      en: 'Chicken couscous',
      M: '€ 15',
      L: '€ 20'
    }, {
      nl: 'Couscous Runds',
      fr: 'Couscous Bœuf',
      en: 'Beef couscous',
      M: '€ 17',
      L: '€ 22'
    }, {
      nl: 'Couscous Veggie',
      fr: 'Couscous Végé',
      en: 'Veggie couscous',
      M: '€ 13',
      L: '€ 18'
    }]
  },
  stoofpotjes: {
    label: {
      nl: 'Stoofpotjes',
      fr: 'Mijotés',
      en: 'Stews'
    },
    sizes: ['M'],
    items: [{
      nl: 'Lamsstoofpotje',
      fr: "Mijoté d'agneau",
      en: 'Lamb stew',
      M: '€ 23'
    }]
  },
  bstilla: {
    label: {
      nl: 'Bstilla en soep',
      fr: 'Bstilla et soupe',
      en: 'Bstilla & soup'
    },
    sizes: [],
    items: [{
      nl: 'Bstilla Kip',
      fr: 'Bstilla Poulet',
      en: 'Chicken bstilla',
      prijs: '€ 9'
    }, {
      nl: 'Bstilla Vis',
      fr: 'Bstilla Poisson',
      en: 'Fish bstilla',
      prijs: '€ 12'
    }, {
      nl: 'Bstilla Groenten',
      fr: 'Bstilla Légumes',
      en: 'Vegetable bstilla',
      prijs: '€ 9'
    }, {
      nl: 'Harira',
      fr: 'Harira',
      en: 'Harira',
      prijs: '€ 5'
    }]
  },
  dranken: {
    label: {
      nl: 'Dranken',
      fr: 'Boissons',
      en: 'Drinks'
    },
    sizes: [],
    items: [{
      nl: 'Thee',
      fr: 'Thé',
      en: 'Mint tea',
      prijs: '€ 2,5'
    }, {
      nl: 'Koffie',
      fr: 'Café',
      en: 'Coffee',
      prijs: '€ 3'
    }, {
      nl: 'Frisdranken',
      fr: 'Boissons fraîches',
      en: 'Soft drinks',
      prijs: '€ 2,5'
    }]
  },
  zoet: {
    label: {
      nl: 'Zoet',
      fr: 'Douceurs',
      en: 'Sweet'
    },
    sizes: [],
    items: [{
      nl: 'Thee + koekjes',
      fr: 'Thé + biscuits',
      en: 'Tea + cookies',
      prijs: '€ 5,5'
    }, {
      nl: 'Koekje pack',
      fr: 'Pack de biscuits',
      en: 'Cookie pack',
      prijs: '€ 6'
    }]
  }
};
if (typeof window !== 'undefined') window.tajine2goMenu = menu;
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/data/menu.js", error: String((e && e.message) || e) }); }

// components/core/ArchFrame.jsx
try { (() => {
function ArchFrame({
  children,
  width = 280,
  assetsBase = '../../assets'
}) {
  return React.createElement('div', {
    style: {
      position: 'relative',
      width,
      aspectRatio: '2/3'
    }
  }, React.createElement('img', {
    src: assetsBase + '/elements/tajine2go-frame.svg',
    alt: '',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }), React.createElement('div', {
    style: {
      position: 'absolute',
      inset: '16% 12%',
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center',
      overflow: 'hidden'
    }
  }, children));
}
Object.assign(__ds_scope, { ArchFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ArchFrame.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children = 'Bestel nu',
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled,
  style: extra
}) {
  const pad = size === 'lg' ? '16px 28px' : size === 'sm' ? '10px 18px' : '14px 24px';
  const fs = size === 'lg' ? '17px' : size === 'sm' ? '15px' : '16px';
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: fs,
    padding: pad,
    whiteSpace: 'nowrap',
    borderRadius: 'var(--radius-action)',
    cursor: disabled ? 'default' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'background .18s ease,color .18s ease,border-color .18s ease',
    border: '1px solid transparent',
    boxSizing: 'border-box',
    opacity: disabled ? .5 : 1
  };
  const styles = {
    primary: {
      ...base,
      background: 'var(--action)',
      color: 'var(--t2g-papier)'
    },
    secondary: {
      ...base,
      background: 'transparent',
      color: 'var(--t2g-inkt)',
      borderColor: 'var(--t2g-inkt)'
    },
    onDark: {
      ...base,
      background: 'var(--t2g-merkoranje)',
      color: 'var(--t2g-papier)'
    },
    onDarkOutline: {
      ...base,
      background: 'transparent',
      color: 'var(--t2g-papier)',
      borderColor: 'var(--t2g-papier)'
    },
    ghost: {
      ...base,
      background: 'transparent',
      color: 'var(--action)',
      padding: size === 'sm' ? '9px 6px' : '13px 8px'
    }
  };
  const [hover, setHover] = React.useState(false);
  const s = {
    ...styles[variant]
  };
  if (hover && !disabled) {
    if (variant === 'primary') s.background = 'var(--action-hover)';
    if (variant === 'secondary') {
      s.background = 'var(--t2g-inkt)';
      s.color = 'var(--t2g-papier)';
    }
    if (variant === 'onDark') s.background = 'var(--action)';
    if (variant === 'onDarkOutline') {
      s.background = 'var(--t2g-papier)';
      s.color = 'var(--t2g-inkt)';
    }
    if (variant === 'ghost') s.color = 'var(--action-hover)';
  }
  const Tag = href ? 'a' : 'button';
  return React.createElement(Tag, {
    href,
    onClick,
    disabled,
    style: {
      ...s,
      minHeight: 44,
      ...extra
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ContactRow.jsx
try { (() => {
const glyphs = {
  phone: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z',
  pin: 'M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  mail: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-6v-2h4V6h2v7z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z',
  facebook: 'M13.5 22v-8h2.7l.4-3h-3.1V9.2c0-.9.3-1.5 1.6-1.5h1.6V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H7.5v3h2.8v8h3.2z'
};
function ContactRow({
  icon = 'phone',
  onDark = false,
  children
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      color: onDark ? 'var(--text-on-dark)' : 'var(--text-body)'
    }
  }, React.createElement('span', {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--t2g-merkoranje)',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, React.createElement('svg', {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: '#fff'
  }, React.createElement('path', {
    d: glyphs[icon] || glyphs.phone
  }))), React.createElement('span', null, children));
}
Object.assign(__ds_scope, { ContactRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ContactRow.jsx", error: String((e && e.message) || e) }); }

// components/core/DishCard.jsx
try { (() => {
function DishCard({
  name,
  description,
  price,
  image,
  badge
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      overflow: 'hidden',
      transition: 'box-shadow .2s ease',
      fontFamily: 'var(--font-body)'
    }
  }, React.createElement('div', {
    style: {
      height: 150,
      background: 'var(--t2g-merkoranje)',
      position: 'relative'
    }
  }, image ? React.createElement('img', {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--t2g-papier)',
      fontSize: 13,
      opacity: .85
    }
  }, 'foto volgt'), badge ? React.createElement('span', {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'var(--t2g-inkt)',
      color: 'var(--t2g-papier)',
      fontSize: 12,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 999
    }
  }, badge) : null), React.createElement('div', {
    style: {
      padding: '14px 16px 16px'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12
    }
  }, React.createElement('span', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 22,
      color: 'var(--text-heading)'
    }
  }, name), React.createElement('span', {
    style: {
      fontWeight: 700,
      fontSize: 17,
      color: 'var(--text-price)',
      whiteSpace: 'nowrap'
    }
  }, price)), description ? React.createElement('p', {
    style: {
      margin: '6px 0 0',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--text-soft)'
    }
  }, description) : null));
}
Object.assign(__ds_scope, { DishCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DishCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children,
  onDark = false
}) {
  return React.createElement('div', {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: onDark ? 'var(--line-on-dark)' : 'var(--action)'
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/OrderBar.jsx
try { (() => {
function OrderBar({
  label = 'Bestel nu',
  href = '#',
  note = 'Afhalen in Gentbrugge'
}) {
  return React.createElement('div', {
    style: {
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--t2g-papier)',
      borderTop: '1px solid var(--border-soft)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      fontFamily: 'var(--font-body)'
    }
  }, React.createElement('span', {
    style: {
      fontSize: 14,
      color: 'var(--text-soft)'
    }
  }, note), React.createElement(__ds_scope.Button, {
    href,
    size: 'md'
  }, label));
}
Object.assign(__ds_scope, { OrderBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/OrderBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Ornament.jsx
try { (() => {
function Ornament({
  width = 320,
  flip = false,
  assetsBase = '../../assets'
}) {
  return React.createElement('img', {
    src: assetsBase + '/elements/tajine2go-ornament.svg',
    alt: '',
    style: {
      width,
      display: 'block',
      margin: '0 auto',
      transform: flip ? 'scaleY(-1)' : 'none'
    }
  });
}
Object.assign(__ds_scope, { Ornament });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Ornament.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionDark.jsx
try { (() => {
function SectionDark({
  children,
  style
}) {
  return React.createElement('section', {
    style: {
      background: 'var(--surface-dark)',
      color: 'var(--text-on-dark)',
      padding: '64px 24px',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { SectionDark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionDark.jsx", error: String((e && e.message) || e) }); }

// image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
let Button, Eyebrow, ContactRow, SectionDark;
const A = '../../assets';
const Wrap = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 24px',
    ...style
  }
}, children);
function useIsMobile() {
  const [m, setM] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);
  React.useEffect(() => {
    const on = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
}
const label = {
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-soft)',
  display: 'block',
  marginBottom: 'var(--space-1)'
};
const field = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: 16,
  color: 'var(--text-body)',
  background: '#fff',
  border: '1px solid var(--border-soft)',
  borderRadius: 'var(--radius-action)',
  padding: '12px 14px'
};
function Formulier() {
  const mob = useIsMobile();
  const [sent, setSent] = React.useState(false);
  const sub = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: 'var(--action)',
    marginTop: 'var(--space-3)'
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sub
  }, "Persoonlijke gegevens"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "voornaam"
  }, "Voornaam"), /*#__PURE__*/React.createElement("input", {
    id: "voornaam",
    style: field,
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "naam"
  }, "Naam"), /*#__PURE__*/React.createElement("input", {
    id: "naam",
    style: field,
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "mail"
  }, "E-mail"), /*#__PURE__*/React.createElement("input", {
    id: "mail",
    type: "email",
    style: field,
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "tel"
  }, "Telefoon"), /*#__PURE__*/React.createElement("input", {
    id: "tel",
    style: field
  }))), /*#__PURE__*/React.createElement("div", {
    style: sub
  }, "Evenement"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "soort"
  }, "Type"), /*#__PURE__*/React.createElement("select", {
    id: "soort",
    style: field
  }, /*#__PURE__*/React.createElement("option", null, "Evenementen"), /*#__PURE__*/React.createElement("option", null, "Recepties"), /*#__PURE__*/React.createElement("option", null, "Feesten"), /*#__PURE__*/React.createElement("option", null, "Andere"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "datum"
  }, "Datum"), /*#__PURE__*/React.createElement("input", {
    id: "datum",
    type: "date",
    style: field
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: label,
    htmlFor: "gasten"
  }, "Aantal gasten"), /*#__PURE__*/React.createElement("input", {
    id: "gasten",
    type: "number",
    min: "1",
    style: field,
    placeholder: "bv. 25"
  }))), /*#__PURE__*/React.createElement("div", {
    style: sub
  }, "Persoonlijk bericht"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    id: "bericht",
    rows: "5",
    style: {
      ...field,
      resize: 'vertical'
    },
    placeholder: "Vertel ons kort waarmee we je kunnen helpen.",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Verstuur bericht"), sent && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-soft)'
    }
  }, "Bedankt, we nemen snel contact op.")));
}
function Contact() {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.T2GNav.SiteNav, {
    base: "index.html",
    home: "index.html"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: useIsMobile() ? 60 : 76
    }
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: 'var(--space-8) 24px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Contact"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'var(--size-h1)',
      lineHeight: 1.05,
      margin: 'var(--space-2) 0 0'
    }
  }, "Laat ons weten wat je nodig hebt"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--size-body)',
      lineHeight: 1.6,
      maxWidth: 560,
      marginTop: 'var(--space-4)'
    }
  }, "Een vraag over het menu, een bestelling voor meerdere personen of een cateringaanvraag: bel ons of vul het formulier in. We antwoorden zo snel we kunnen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1.2fr .8fr',
      gap: 'var(--space-7)',
      marginTop: 'var(--space-7)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Formulier, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + '/elements/tajine2go-frame-pattern.png',
    alt: "",
    style: {
      width: 'min(200px,50%)',
      display: 'block',
      marginBottom: 'var(--space-3)'
    }
  }), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "pin"
  }, "Brusselsesteenweg 455, 9050 Gentbrugge"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "phone"
  }, "Tel. 09 377 32 51 \xB7 0451 01 61 44"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "mail"
  }, "info@tajine2go.be"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "instagram"
  }, "@tajine2go.gent"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "facebook"
  }, "Tajine2Go")))), /*#__PURE__*/React.createElement(SectionDark, {
    style: {
      padding: mob ? 'var(--space-8) 16px' : 'var(--space-8) 24px',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      justifyItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true
  }, "Catering"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'var(--size-h2)',
      margin: 0,
      color: 'var(--text-on-dark)'
    }
  }, "Bestellen voor een groep?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--size-body)',
      lineHeight: 1.6,
      color: 'var(--text-on-dark)',
      opacity: .9,
      maxWidth: 560
    }
  }, "Vertel ons de gelegenheid, het aantal personen en de datum. Wij stellen een menu op maat voor."), /*#__PURE__*/React.createElement(Button, {
    variant: "onDark",
    href: "index.html#catering"
  }, "Meer over catering"))), /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: 'var(--space-8) 24px',
      background: 'var(--surface-dark)'
    }
  }, /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + '/logo/tajine2go-wordmark-dark.svg',
    alt: "Tajine2Go",
    style: {
      width: 'min(1100px,92vw)',
      display: 'block'
    }
  }))));
}
(function mount(tries) {
  const ns = window.Tajine2GoDesignSystem_2aba92;
  if (!ns || !window.T2GNav) {
    if (tries < 100) setTimeout(() => mount(tries + 1), 100);
    return;
  }
  ({
    Button,
    Eyebrow,
    ContactRow,
    SectionDark
  } = ns);
  const el = document.getElementById('root');
  if (!window.__t2gRoot) {
    window.__t2gRoot = ReactDOM.createRoot(el);
  }
  window.__t2gRoot.render(/*#__PURE__*/React.createElement(Contact, null));
})(0);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let Button, Eyebrow, Ornament, ArchFrame, DishCard, ContactRow, SectionDark, OrderBar;
let useTweaks, TweaksPanel, TweakSection, TweakSelect;
const BestelKnop = p => /*#__PURE__*/React.createElement(window.T2GNav.BestelKnop, p);
const A = '../../assets';
const PhoneIcon = ({
  size = 17
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  style: {
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"
}));
function useIsMobile() {
  const [m, setM] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);
  React.useEffect(() => {
    const on = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
}
const H2 = {
  fontFamily: 'var(--font-display)',
  fontWeight: 500,
  fontSize: 'var(--size-h2)',
  margin: 'var(--space-2) 0 0',
  color: 'var(--text-heading)',
  lineHeight: 1.1
};
const P = {
  fontSize: 'var(--size-body)',
  lineHeight: 1.6,
  color: 'var(--text-body)',
  maxWidth: 560
};
const Wrap = ({
  children,
  style
}) => {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '0 16px' : '0 24px',
      ...style
    }
  }, children);
};
function Foto({
  h = 220,
  label = 'foto volgt'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      background: 'var(--t2g-merkoranje)',
      borderRadius: 'var(--radius-card)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--t2g-papier)',
      fontSize: 13
    }
  }, label);
}
function Hero() {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: mob ? '100svh' : '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--surface-dark)',
      overflow: 'hidden',
      padding: mob ? 'var(--space-8) 20px' : 'var(--space-8) 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "url('../../assets/elements/tajine2go-pattern.png')",
      backgroundSize: '320px',
      opacity: .5,
      mixBlendMode: 'luminosity'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at center, rgba(68,12,0,.62) 0%, rgba(68,12,0,.88) 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      textAlign: 'center',
      display: 'grid',
      justifyItems: 'center',
      gap: 'var(--space-6)',
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(20px,2.2vw,26px)',
      color: 'var(--line-on-dark)',
      whiteSpace: 'nowrap'
    }
  }, "Welkom bij"), /*#__PURE__*/React.createElement("img", {
    src: A + '/logo/tajine2go-horizontal-dark.svg',
    alt: "Tajine2Go",
    style: {
      width: mob ? '88%' : 'auto',
      height: mob ? 'auto' : 130
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      width: '100%'
    }
  }, !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--line-on-dark)',
      opacity: .55
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: mob ? 11 : 13,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--line-on-dark)',
      whiteSpace: mob ? 'normal' : 'nowrap',
      textAlign: 'center'
    }
  }, "Marokkaanse afhaalgerechten en catering"), !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--line-on-dark)',
      opacity: .55
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center',
      flexDirection: mob ? 'column' : 'row',
      justifyContent: 'center',
      width: mob ? '100%' : 'auto'
    }
  }, /*#__PURE__*/React.createElement(BestelKnop, {
    size: "lg",
    variant: "onDark",
    full: mob,
    style: mob ? null : {
      minWidth: 230
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "onDarkOutline",
    size: "lg",
    href: "contact.html",
    style: mob ? null : {
      minWidth: 230
    }
  }, "Catering aanvragen"))), /*#__PURE__*/React.createElement("a", {
    href: "#menu",
    style: {
      position: 'absolute',
      bottom: 'var(--space-6)',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'var(--text-on-dark)',
      opacity: .8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "34",
    height: "34",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))));
}
function Concept() {
  const mob = useIsMobile();
  const w = mob ? 130 : 210,
    h = w * 0.264,
    lineY = h * 0.21;
  return /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 24px var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: 'var(--t2g-espresso)',
      marginTop: lineY - 1,
      marginRight: -6
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: A + '/elements/tajine2go-ornament.svg',
    alt: "",
    style: {
      width: w,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: 'var(--t2g-espresso)',
      marginTop: lineY - 1,
      marginLeft: -6
    }
  })));
}
function MenuRow({
  it
}) {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      padding: 'var(--space-3) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: mob ? 56 : 72,
      height: mob ? 56 : 72,
      flexShrink: 0,
      borderRadius: 12,
      background: 'var(--t2g-merkoranje)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--t2g-papier)',
      fontSize: 9,
      textAlign: 'center'
    }
  }, "foto volgt"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: mob ? 19 : 22,
      lineHeight: 1.15
    }
  }, it.nl), !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderBottom: '1.5px dotted var(--border-soft)',
      transform: 'translateY(-5px)'
    }
  }), mob && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: mob ? 15 : 17,
      whiteSpace: 'nowrap',
      color: 'var(--text-price)',
      lineHeight: 1.15
    }
  }, it.prijs || (it.L ? it.M + ' / ' + it.L : it.M))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-soft)',
      marginTop: 'var(--space-1)'
    }
  }, it.fr, " \xB7 ", it.en)));
}
function MenuSection({
  sec
}) {
  const titleRef = React.useRef(null);
  const [tw, setTw] = React.useState(0);
  React.useLayoutEffect(() => {
    if (titleRef.current) setTw(titleRef.current.offsetWidth);
  }, [sec]);
  return /*#__PURE__*/React.createElement("section", {
    id: slug(sec.label.nl),
    style: {
      marginTop: 'var(--space-7)',
      scrollMarginTop: 150
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    ref: titleRef,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'clamp(24px,5vw,28px)',
      margin: 0
    }
  }, sec.label.nl), /*#__PURE__*/React.createElement("img", {
    src: A + '/elements/tajine2go-ornament.svg',
    alt: "",
    style: {
      width: 72,
      height: 14,
      display: 'block',
      margin: 'var(--space-1) auto 0'
    }
  })), sec.sizes.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      fontSize: 12,
      color: 'var(--text-soft)',
      fontWeight: 600,
      letterSpacing: '.06em',
      whiteSpace: 'nowrap'
    }
  }, sec.sizes.length > 1 ? 'M · L' : 'M')), sec.items.map(it => /*#__PURE__*/React.createElement(MenuRow, {
    key: it.nl,
    it: it
  })));
}
function SerifCat({
  sec,
  on,
  a
}) {
  const mob = useIsMobile();
  const [h, setH] = React.useState(false);
  const active = on || !mob && h;
  return /*#__PURE__*/React.createElement("a", _extends({}, a, {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      flex: '0 0 auto',
      position: 'relative',
      fontFamily: 'var(--font-display)',
      fontSize: mob ? 18 : 22,
      color: active ? 'var(--action)' : 'var(--text-body)',
      padding: mob ? '6px 11px' : '6px 16px',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'color .18s ease'
    }
  }), sec.label.nl);
}
function slug(s) {
  return 'cat-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
function CatNav({
  secs,
  variant,
  active,
  onPick
}) {
  const mob = useIsMobile();
  const rowBase = {
    display: 'flex',
    gap: 'var(--space-2)',
    overflowX: 'auto',
    paddingBottom: 4
  };
  const A2 = sec => ({
    key: sec.label.nl,
    href: '#' + slug(sec.label.nl),
    onClick: () => onPick(sec.label.nl)
  });
  const on = sec => sec.label.nl === active;
  if (variant === 'pills') return /*#__PURE__*/React.createElement("div", {
    style: {
      ...rowBase,
      justifyContent: mob ? 'flex-start' : 'center'
    }
  }, secs.map(s => /*#__PURE__*/React.createElement("a", _extends({}, A2(s), {
    style: {
      flex: '0 0 auto',
      padding: '10px 18px',
      borderRadius: 999,
      border: '1px solid ' + (on(s) ? 'var(--action)' : 'var(--border-soft)'),
      background: on(s) ? 'var(--action)' : 'transparent',
      color: on(s) ? 'var(--t2g-papier)' : 'var(--text-body)',
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }), s.label.nl)));
  if (variant === 'tabs') return /*#__PURE__*/React.createElement("div", {
    style: {
      ...rowBase,
      gap: 'var(--space-6)',
      borderBottom: '1px solid var(--border-soft)',
      justifyContent: mob ? 'flex-start' : 'center'
    }
  }, secs.map(s => /*#__PURE__*/React.createElement("a", _extends({}, A2(s), {
    style: {
      flex: '0 0 auto',
      padding: '10px 0 12px',
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: on(s) ? 'var(--text-heading)' : 'var(--text-soft)',
      borderBottom: '2px solid ' + (on(s) ? 'var(--action)' : 'transparent'),
      marginBottom: -1,
      textDecoration: 'none'
    }
  }), s.label.nl)));
  if (variant === 'inkbar') return /*#__PURE__*/React.createElement("div", {
    style: {
      ...rowBase,
      background: 'var(--surface-dark)',
      borderRadius: 'var(--radius-action)',
      padding: 8,
      gap: 4
    }
  }, secs.map(s => /*#__PURE__*/React.createElement("a", _extends({}, A2(s), {
    style: {
      flex: '0 0 auto',
      padding: '10px 16px',
      borderRadius: 4,
      background: on(s) ? 'var(--action)' : 'transparent',
      color: 'var(--text-on-dark)',
      opacity: on(s) ? 1 : .75,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }), s.label.nl)));
  if (variant === 'serif') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: mob ? 'nowrap' : 'wrap',
      alignItems: 'center',
      justifyContent: mob ? 'flex-start' : 'center',
      overflowX: mob ? 'auto' : 'visible',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch'
    }
  }, secs.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s.label.nl
  }, i > 0 && /*#__PURE__*/React.createElement("i", {
    style: {
      flex: '0 0 auto',
      width: 4,
      height: 4,
      transform: 'rotate(45deg)',
      background: 'var(--t2g-espresso)',
      opacity: .5
    }
  }), /*#__PURE__*/React.createElement(SerifCat, {
    sec: s,
    on: on(s),
    a: A2(s)
  }))));
  if (variant === 'blocks') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(3,1fr)',
      gap: 'var(--space-2)'
    }
  }, secs.map(s => /*#__PURE__*/React.createElement("a", _extends({}, A2(s), {
    style: {
      padding: '16px 12px',
      border: '1px solid ' + (on(s) ? 'var(--t2g-inkt)' : 'var(--border-soft)'),
      background: on(s) ? 'var(--t2g-inkt)' : 'transparent',
      color: on(s) ? 'var(--t2g-papier)' : 'var(--text-body)',
      borderRadius: 'var(--radius-action)',
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      textDecoration: 'none'
    }
  }), s.label.nl)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...rowBase,
      gap: 'var(--space-5)',
      borderTop: '1px solid var(--border-soft)',
      borderBottom: '1px solid var(--border-soft)',
      padding: '10px 0',
      justifyContent: mob ? 'flex-start' : 'center'
    }
  }, secs.map(s => /*#__PURE__*/React.createElement("a", _extends({}, A2(s), {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      fontSize: 15,
      fontWeight: 600,
      color: on(s) ? 'var(--action)' : 'var(--text-soft)',
      textDecoration: 'none'
    }
  }), s.label.nl, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      opacity: .7
    }
  }, s.items.length))));
}
function Menu({
  navVariant
}) {
  const m = window.tajine2goMenu;
  const secs = Object.values(m);
  const mobNav = useIsMobile();
  const [active, setActive] = React.useState(secs[0].label.nl);
  React.useEffect(() => {
    const on = () => {
      let cur = secs[0].label.nl;
      for (const s of secs) {
        const el = document.getElementById(slug(s.label.nl));
        if (el && el.getBoundingClientRect().top < 160) cur = s.label.nl;
      }
      setActive(cur);
    };
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  return /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: 'var(--space-8) 24px var(--space-8)',
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "menu",
    style: {
      scrollMarginTop: 130
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Uit onze keuken")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: mobNav ? 60 : 76,
      zIndex: 20,
      background: 'var(--surface-page)',
      marginTop: 'var(--space-5)',
      paddingTop: 'var(--space-2)',
      paddingBottom: 'var(--space-2)',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement(CatNav, {
    secs: secs,
    variant: navVariant,
    active: active,
    onPick: setActive
  })), secs.map(sec => /*#__PURE__*/React.createElement(MenuSection, {
    key: sec.label.nl,
    sec: sec
  })));
}
function Verhaal() {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement(SectionDark, {
    style: {
      ...(mob ? {
        padding: 'var(--space-8) 16px'
      } : null),
      position: 'relative',
      scrollMarginTop: 76
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "verhaal",
    style: {
      position: 'absolute',
      top: -130
    }
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: 'var(--space-6)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true
  }, "Ons verhaal"), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...H2,
      color: 'var(--text-on-dark)'
    }
  }, "De warmte van Marokko, klaar om mee te nemen."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...P,
      color: 'var(--text-on-dark)',
      opacity: .9,
      marginTop: 'var(--space-4)'
    }
  }, "Afhaaleten hoeft niet onpersoonlijk te zijn. Bij Tajine2Go krijgt elk gerecht de tijd die het nodig heeft, met kruiden uit Marokko en verse groenten van de markt. Kom binnen, voel je thuis en eet iets lekkers."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 2,
      background: 'var(--line-on-dark)',
      marginTop: 'var(--space-5)'
    }
  })), /*#__PURE__*/React.createElement(Foto, {
    h: 300,
    label: "foto: familietafel"
  })));
}
function Catering() {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "catering",
    style: {
      position: 'absolute',
      top: -130
    }
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: 'var(--space-8) 24px',
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: 'var(--space-6)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Foto, {
    h: mob ? 200 : 280,
    label: "foto: cateringbuffet"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Catering"), /*#__PURE__*/React.createElement("h2", {
    style: H2
  }, "Voor feesten, families en collega's"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...P,
      marginTop: 'var(--space-4)'
    }
  }, "Van een familiefeest tot een lunch op kantoor: wij verzorgen Marokkaanse gerechten voor kleine en grotere groepen. Vertel ons je gelegenheid en het aantal personen, wij doen een voorstel."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 24,
      color: 'var(--text-price)',
      marginTop: 'var(--space-5)'
    }
  }, "Op aanvraag"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)',
      flexDirection: mob ? 'column' : 'row'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    href: "contact.html"
  }, "Catering aanvragen")))));
}
function Bereikbaarheid() {
  const mob = useIsMobile();
  const items = [['Met de auto', 'Vlot bereikbaar. Parkeren kan in de straat, of vlakbij aan het Arsenaal — vandaar is het een korte wandeling.'], ['Met het openbaar vervoer', 'Vlot bereikbaar met tram en bus. Tramlijn 2 stopt aan Gentbrugge Schooldreef, buslijn 9 aan Gentbrugge Arsenaal — beide op een korte wandeling van de zaak.'], ['Met de fiets', 'Je zet je fiets voor de deur in de stallingen langs de Brusselsesteenweg. Wie van verder komt: op de site van Het Arsenaal, enkele honderden meters verderop, staan ruim 250 (deels overdekte) fietsenstallingen.']];
  return /*#__PURE__*/React.createElement(SectionDark, {
    style: {
      padding: mob ? 'var(--space-8) 16px' : 'var(--space-8) 24px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "bereikbaarheid",
    style: {
      position: 'absolute',
      top: -130
    }
  }), /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true
  }, "Bereikbaarheid"), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...H2,
      color: 'var(--text-on-dark)'
    }
  }, "Zo vind je ons in Gentbrugge"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-6)'
    }
  }, items.map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 22,
      color: 'var(--text-on-dark)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--text-on-dark)',
      opacity: .85,
      marginTop: 'var(--space-2)'
    }
  }, d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Foto, {
    h: mob ? 200 : 280,
    label: "kaart of foto: gevel Brusselsesteenweg 455"
  }))));
}
function Praktisch() {
  const mob = useIsMobile();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: mob ? 'var(--space-8) 16px' : 'var(--space-8) 24px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "praktisch",
    style: {
      position: 'absolute',
      top: -130
    }
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr auto',
      gap: 'var(--space-6)',
      alignItems: 'center',
      justifyItems: mob ? 'start' : 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Praktisch"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(ContactRow, {
    icon: "pin"
  }, "Brusselsesteenweg 455, 9050 Gentbrugge"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "phone"
  }, "Tel. 09 377 32 51 \xB7 0451 01 61 44"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "mail"
  }, "info@tajine2go.be"), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "instagram"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--text-body)',
      textDecoration: 'none'
    }
  }, "@tajine2go.gent")), /*#__PURE__*/React.createElement(ContactRow, {
    icon: "facebook"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--text-body)',
      textDecoration: 'none'
    }
  }, "Tajine2Go")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      display: 'grid',
      gap: 'var(--space-2)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 22,
      marginBottom: 'var(--space-1)'
    }
  }, "Openingsuren"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 280,
      color: 'var(--text-soft)'
    }
  }, "Openingsuren volgen binnenkort. Bel ons gerust voor afhaalmomenten."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--action)'
    }
  }, "Snelle links"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-4)',
      fontSize: 16,
      marginTop: 'var(--space-3)'
    }
  }, [['Menu', '#menu'], ['Catering', '#catering'], ['Over ons', '#verhaal'], ['Contact', 'mailto:info@tajine2go.be']].map(([x, href]) => /*#__PURE__*/React.createElement("a", {
    key: x,
    href: href,
    style: {
      color: 'var(--text-body)',
      textDecoration: 'none'
    }
  }, x))))), /*#__PURE__*/React.createElement("img", {
    src: A + '/qr/tajine2go-qr-ink-on-paper.svg',
    alt: "QR naar tajine2go.be",
    style: {
      height: mob ? 120 : 150
    }
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      marginTop: 'var(--space-7)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-soft)',
      fontSize: 14,
      color: 'var(--text-soft)'
    }
  }, "\xA9 2026 Tajine2Go \xB7 BTW BE 1019936687"));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: 'var(--space-8) 24px',
      background: 'var(--surface-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + '/logo/tajine2go-wordmark-dark.svg',
    alt: "Tajine2Go",
    style: {
      width: 'min(1100px,92vw)',
      display: 'block'
    }
  })));
}
function MobileOrderBar() {
  const mob = useIsMobile();
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!mob) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      background: 'var(--t2g-papier)',
      borderTop: '1px solid var(--border-soft)',
      padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
      transform: show ? 'translateY(0)' : 'translateY(120%)',
      transition: 'transform .25s ease'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "tel:093773251",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      background: 'var(--action)',
      color: 'var(--t2g-papier)',
      fontWeight: 700,
      fontSize: 17,
      padding: '14px 24px',
      borderRadius: 'var(--radius-action)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(PhoneIcon, {
    size: 18
  }), "Bestel nu"));
}
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "menuNav": "serif"
} /*EDITMODE-END*/;
function Home() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return /*#__PURE__*/React.createElement("div", {
    id: "top"
  }, /*#__PURE__*/React.createElement(window.T2GNav.SiteNav, {
    reveal: true
  }), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Menu, {
    navVariant: t.menuNav
  }), /*#__PURE__*/React.createElement(Verhaal, null), /*#__PURE__*/React.createElement(Catering, null), /*#__PURE__*/React.createElement(Bereikbaarheid, null), /*#__PURE__*/React.createElement(Praktisch, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(MobileOrderBar, null), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Menunavigatie"
  }), /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Variant",
    value: t.menuNav,
    options: ['pills', 'tabs', 'inkbar', 'serif', 'blocks', 'teller'],
    onChange: v => setTweak('menuNav', v)
  })));
}
(function mount(tries) {
  const ns = window.Tajine2GoDesignSystem_2aba92;
  if (!ns || !window.tajine2goMenu) {
    if (tries < 100) setTimeout(() => mount(tries + 1), 100);
    return;
  }
  ({
    Button,
    Eyebrow,
    Ornament,
    ArchFrame,
    DishCard,
    ContactRow,
    SectionDark,
    OrderBar
  } = ns);
  if (!window.useTweaks || !window.T2GNav) {
    if (tries < 100) setTimeout(() => mount(tries + 1), 100);
    return;
  }
  ({
    useTweaks,
    TweaksPanel,
    TweakSection,
    TweakSelect
  } = window);
  const el = document.getElementById('root');
  if (!window.__t2gRoot) {
    el.innerHTML = '';
    window.__t2gRoot = ReactDOM.createRoot(el);
  }
  window.__t2gRoot.render(/*#__PURE__*/React.createElement(Home, null));
})(0);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Menu.jsx
try { (() => {
let Button, Eyebrow, Ornament, OrderBar;
const A2 = '../../assets';
function MenuSection({
  sec
}) {
  const hasSizes = sec.sizes.length > 0;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      borderBottom: '2px solid var(--border-soft)',
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      margin: 0
    }
  }, sec.label.nl), hasSizes && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-soft)',
      fontWeight: 600,
      letterSpacing: '.06em'
    }
  }, sec.sizes.length > 1 ? 'M · L' : 'M')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 0
    }
  }, sec.items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.nl,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 22
    }
  }, it.nl), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-soft)',
      marginTop: 2
    }
  }, it.fr, " \xB7 ", it.en)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 17,
      whiteSpace: 'nowrap',
      color: 'var(--text-price)'
    }
  }, it.prijs || (it.L ? it.M + ' / ' + it.L : it.M))))));
}
function MenuPage() {
  const m = window.tajine2goMenu;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 76
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A2 + '/logo/tajine2go-horizontal-light.svg',
    alt: "Tajine2Go",
    style: {
      height: 46
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Bestel nu"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '0 auto',
      padding: '56px 24px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Ons menu"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'var(--size-h1)',
      margin: '10px 0 0',
      lineHeight: 1.05
    }
  }, "Tajines, couscous en meer"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--text-soft)',
      maxWidth: 520,
      margin: '16px auto 0'
    }
  }, "Alles wordt langzaam en met zorg bereid. Prijzen per portie, M of L waar aangegeven."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Ornament, {
    width: 280,
    assetsBase: A2
  }))), Object.values(m).map(sec => /*#__PURE__*/React.createElement(MenuSection, {
    key: sec.label.nl,
    sec: sec
  }))), /*#__PURE__*/React.createElement(OrderBar, {
    note: "Afhalen in Gentbrugge",
    href: "#"
  }));
}
(function mount(tries) {
  const ns = window.Tajine2GoDesignSystem_2aba92;
  if (!ns || !window.tajine2goMenu) {
    if (tries < 100) setTimeout(() => mount(tries + 1), 100);
    return;
  }
  ({
    Button,
    Eyebrow,
    Ornament,
    OrderBar
  } = ns);
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(MenuPage, null));
})(0);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Menu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteNav.jsx
try { (() => {
// Gedeelde navigatiebalk — één bron voor alle pagina's.
(function () {
  const A = '../../assets';
  const DS = () => window.Tajine2GoDesignSystem_2aba92;
  const Wrap = ({
    children,
    style
  }) => {
    const mob = useIsMobile();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1120,
        margin: '0 auto',
        padding: mob ? '0 16px' : '0 24px',
        ...style
      }
    }, children);
  };
  function useIsMobile() {
    const [m, setM] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);
    React.useEffect(() => {
      const on = () => setM(window.innerWidth < 768);
      window.addEventListener('resize', on);
      return () => window.removeEventListener('resize', on);
    }, []);
    return m;
  }
  function useCompactNav() {
    const [c, setC] = React.useState(typeof window !== 'undefined' && window.innerWidth < 1080);
    React.useEffect(() => {
      const on = () => setC(window.innerWidth < 1080);
      window.addEventListener('resize', on);
      return () => window.removeEventListener('resize', on);
    }, []);
    return c;
  }
  const PhoneIcon = ({
    size = 17
  }) => /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"
  }));
  function BestelKnop({
    size = 'lg',
    align = 'left',
    variant = 'primary',
    full = false,
    style: extra
  }) {
    const {
      Button
    } = DS();
    const [open, setOpen] = React.useState(false);
    const [up, setUp] = React.useState(false);
    const ref = React.useRef(null);
    const toggle = () => {
      if (!open && ref.current) {
        const r = ref.current.getBoundingClientRect();
        setUp(window.innerHeight - r.bottom < 140);
      }
      setOpen(o => !o);
    };
    React.useEffect(() => {
      if (!open) return;
      const close = e => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }, [open]);
    return /*#__PURE__*/React.createElement("div", {
      ref: ref,
      style: {
        position: 'relative',
        display: full ? 'block' : 'inline-block'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: size,
      variant: variant,
      onClick: toggle,
      style: {
        ...(full ? {
          width: '100%',
          justifyContent: 'center'
        } : null),
        ...extra
      }
    }, /*#__PURE__*/React.createElement(PhoneIcon, {
      size: 18
    }), "Bestel nu"), open && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        [align]: 0,
        [up ? 'bottom' : 'top']: 'calc(100% + 8px)',
        zIndex: 20,
        background: 'var(--t2g-papier)',
        borderRadius: 'var(--radius-action)',
        boxShadow: 'var(--shadow-card-hover)',
        border: '1px solid var(--border-soft)',
        padding: '10px 0',
        minWidth: 230
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 18px 8px',
        fontSize: 12,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: 'var(--action)'
      }
    }, "Bestel telefonisch"), /*#__PURE__*/React.createElement("a", {
      href: "tel:093773251",
      style: {
        display: 'block',
        padding: '10px 18px',
        fontWeight: 700,
        fontSize: 17,
        color: 'var(--t2g-inkt)',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
      }
    }, "09 377 32 51"), /*#__PURE__*/React.createElement("a", {
      href: "tel:0451016144",
      style: {
        display: 'block',
        padding: '10px 18px',
        fontWeight: 700,
        fontSize: 17,
        color: 'var(--t2g-inkt)',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
      }
    }, "0451 01 61 44")));
  }
  function navItems(base) {
    return [['Menu', base + '#menu'], ['Over ons', base + '#verhaal'], ['Catering', 'contact.html'], ['Bereikbaarheid', base + '#bereikbaarheid'], ['Praktisch', base + '#praktisch'], ['Contact', 'contact.html']];
  }
  function LogoLink({
    mob,
    home
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("a", {
      href: home,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        display: 'block',
        lineHeight: 0
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: A + '/logo/tajine2go-horizontal-light.svg',
      alt: "Tajine2Go",
      style: {
        height: mob ? 34 : 46,
        transform: h ? 'scale(1.06)' : 'scale(1)',
        transformOrigin: 'left center',
        transition: 'transform .22s ease'
      }
    }));
  }
  function bgAt(x, y) {
    let el = document.elementFromPoint(x, y);
    while (el) {
      const c = getComputedStyle(el).backgroundColor;
      const m = c && c.match(/rgba?\(([\d.]+), ?([\d.]+), ?([\d.]+)(?:, ?([\d.]+))?\)/);
      if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) return [+m[1], +m[2], +m[3]];
      el = el.parentElement;
    }
    return [253, 243, 226];
  }
  function BurgerMenu({
    items
  }) {
    const [open, setOpen] = React.useState(false);
    const [dark, setDark] = React.useState(false);
    const wrap = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const close = e => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }, [open]);
    React.useEffect(() => {
      const on = () => {
        const [r, g, b] = bgAt(Math.round(window.innerWidth * 0.3), Math.round(window.innerHeight * 0.5));
        setDark(0.299 * r + 0.587 * g + 0.114 * b < 128);
      };
      on();
      window.addEventListener('scroll', on);
      return () => window.removeEventListener('scroll', on);
    }, [open]);
    const panelBg = dark ? 'var(--surface-dark)' : 'var(--t2g-papier)';
    const panelText = dark ? 'var(--text-on-dark)' : 'var(--text-body)';
    const panelLine = dark ? 'rgba(253,243,226,.22)' : 'var(--border-soft)';
    return /*#__PURE__*/React.createElement("div", {
      ref: wrap,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(o => !o),
      "aria-label": "Menu",
      style: {
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        background: 'transparent',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-action)',
        cursor: 'pointer',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8"
    }, open ? /*#__PURE__*/React.createElement("path", {
      d: "M6 6l12 12M18 6L6 18"
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 7h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 12h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 17h16"
    })))), open && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 10px)',
        zIndex: 61,
        minWidth: 220,
        background: panelBg,
        border: '1px solid ' + panelLine,
        borderRadius: 'var(--radius-action)',
        boxShadow: 'var(--shadow-card-hover)',
        padding: 'var(--space-2) var(--space-4) var(--space-3)',
        display: 'grid',
        gap: 0
      }
    }, items.map(([x, href], i) => /*#__PURE__*/React.createElement("a", {
      key: x,
      href: href,
      onClick: () => setOpen(false),
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        color: panelText,
        textDecoration: 'none',
        padding: '11px 0',
        borderTop: i === 0 ? 'none' : '1px solid ' + panelLine
      }
    }, x))));
  }
  function NavLink({
    label,
    href
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("a", {
      href: href,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        position: 'relative',
        textDecoration: 'none',
        color: h ? 'var(--action)' : 'var(--text-body)',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        transform: h ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform .22s ease,color .18s ease'
      }
    }, label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -4,
        height: 1,
        background: 'var(--action)',
        transform: h ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'center',
        transition: 'transform .22s ease'
      }
    }));
  }

  /** base: '' op de homepagina, 'index.html' elders. reveal: pas tonen na de hero. */
  function SiteNav({
    base = '',
    reveal = false,
    home = '#top'
  }) {
    const mob = useIsMobile();
    const compact = useCompactNav();
    const items = navItems(base);
    const [show, setShow] = React.useState(!reveal);
    React.useEffect(() => {
      if (!reveal) return;
      const on = () => setShow(window.scrollY > window.innerHeight * 0.7);
      on();
      window.addEventListener('scroll', on);
      return () => window.removeEventListener('scroll', on);
    }, [reveal]);
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: 'var(--surface-page)',
        borderBottom: '1px solid var(--border-soft)',
        transform: show ? 'translateY(0)' : 'translateY(-100%)',
        opacity: show ? 1 : 0,
        transition: 'transform .25s ease,opacity .25s ease'
      }
    }, /*#__PURE__*/React.createElement(Wrap, {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: mob ? 60 : 76,
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement(LogoLink, {
      mob: mob,
      home: home
    }), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        gap: compact ? 'var(--space-3)' : 'var(--space-4)',
        fontSize: 16,
        fontWeight: 500
      }
    }, !compact && items.map(([x, href]) => /*#__PURE__*/React.createElement(NavLink, {
      key: x,
      label: x,
      href: href
    })), /*#__PURE__*/React.createElement(BestelKnop, {
      size: "sm",
      align: "right"
    }), compact && /*#__PURE__*/React.createElement(BurgerMenu, {
      items: items
    }))));
  }
  window.T2GNav = {
    SiteNav,
    BestelKnop,
    PhoneIcon,
    BurgerMenu,
    LogoLink,
    navItems,
    useIsMobile
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // data-om-starter: inert presence marker — Claude Design's starter-usage
  // probe reads it. The closed panel renders nothing, so the marker rides
  // the <html> element as an attribute instead of a rendered node — zero
  // elements added, so page CSS (even structural selectors like
  // :nth-child) can never observe it. It records that the page WIRES a
  // tweaks panel, whether or not the panel is open. Keep this effect.
  React.useEffect(() => {
    document.documentElement.setAttribute('data-om-starter', 'tweaks-panel');
    return () => document.documentElement.removeAttribute('data-om-starter');
  }, []);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ArchFrame = __ds_scope.ArchFrame;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ContactRow = __ds_scope.ContactRow;

__ds_ns.DishCard = __ds_scope.DishCard;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.OrderBar = __ds_scope.OrderBar;

__ds_ns.Ornament = __ds_scope.Ornament;

__ds_ns.SectionDark = __ds_scope.SectionDark;

})();
