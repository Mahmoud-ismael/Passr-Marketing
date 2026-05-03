# DESIGN.md — Passr Visual Identity & Design System
# Version 1.0 | Industrial Clarity
# Always refer to this file for all UI decisions. Do not deviate from these specifications.

---

## 1. Design Philosophy

The Passr UI language is called **"Industrial Clarity."**

It mimics the aesthetic of:
- Shipping manifests and cargo labels
- Airport departure boards
- Technical compliance manuals
- European government forms, digitized

The goal is **Institutional Trust**. The interface must feel like a piece of infrastructure — authoritative, dense, precise — not a startup app. If it looks like it belongs on a Dribbble portfolio, it is wrong.

**One-line test:** "Does this look like a tool a customs officer and a brand compliance manager would both trust with legal documents?" If yes, proceed.

---

## 2. Color Palette — "Technical Noir"

### CSS Custom Properties (paste into globals.css)

```css
:root {
  /* Core */
  --color-void:        #0A0A0A;   /* Primary bg, headlines, nav. NEVER use pure #000000 */
  --color-paper:       #F4F4F4;   /* Cards, panels, inputs. Looks like physical documents */
  --color-metal:       #858585;   /* Borders, dividers, secondary text, placeholders */

  /* Accent */
  --color-signal:      #FF3B30;   /* CTA buttons, non-compliant alerts ONLY. Do not overuse */

  /* Status */
  --color-verified:    #22C55E;   /* Compliant states, verified badges, success */
  --color-warning:     #F59E0B;   /* Expiring certs, partial compliance, amber states */
  --color-info:        #1A56DB;   /* Informational callouts, links, data labels */

  /* Surface scale (dark mode — portal.passr.eu) */
  --surface-0:         #0A0A0A;   /* Page background */
  --surface-1:         #111111;   /* Card background */
  --surface-2:         #1A1A1A;   /* Elevated card, modal */
  --surface-3:         #242424;   /* Input background, table row hover */

  /* Surface scale (light mode — verify.passr.eu public passport) */
  --surface-light-0:   #F4F4F4;   /* Page background */
  --surface-light-1:   #FFFFFF;   /* Card background */
  --surface-light-2:   #EFEFEF;   /* Table row alt */

  /* Text */
  --text-primary:      #F4F4F4;   /* Main text on dark surfaces */
  --text-secondary:    #858585;   /* Labels, captions, metadata */
  --text-inverse:      #0A0A0A;   /* Text on light surfaces */

  /* Borders */
  --border-default:    #2A2A2A;   /* Subtle structural border on dark bg */
  --border-strong:     #858585;   /* Visible dividers, card edges */
  --border-signal:     #FF3B30;   /* Active state, error, alert border */
  --border-verified:   #22C55E;   /* Compliant product border */
}
```

### Color Usage Rules

| Token | Use | Never Use For |
|---|---|---|
| `--color-void` | Backgrounds, nav, footer, display text | Body text on dark bg (too harsh) |
| `--color-paper` | Light mode surfaces, form inputs | Dark mode backgrounds |
| `--color-metal` | Borders, secondary labels, placeholders | Primary action elements |
| `--color-signal` | Primary CTA button, non-compliant alert badge | Decorative elements, hover states, links |
| `--color-verified` | Compliant badge, success toast, verified shield | Any non-status UI |
| `--color-warning` | Expiring certificate badge, amber traffic light | Errors (use signal red for errors) |

---

## 3. Typography

### Font Stack

```css
/* Import in layout.tsx or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');

:root {
  --font-display:  'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
  --font-data:     'Roboto Mono', 'Courier New', monospace;
}
```

### Usage Rules

| Font | Usage | Weight | Tracking |
|---|---|---|---|
| Space Grotesk | All headings (H1–H4), logo wordmark, nav items, badge labels, section titles | Bold (700) for H1–H2, Semibold (600) for H3–H4 | `-0.02em` (tight, -2%) for H1–H2. `0` for H3–H4 |
| Space Grotesk | Button labels, tab labels, table headers | Semibold (600) | `0.02em` (slightly wide, ALL CAPS preferred) |
| Roboto Mono | ALL data values: GTINs, ppm readings, percentages, dates, IDs, SKU codes, file names, API keys, compliance status codes | Regular (400) | `0` |
| Roboto Mono | Form input fields where data is entered | Regular (400) | `0` |
| Inter (fallback) | Long-form body text, descriptions, help text, legal copy | Regular (400) | `0` |

### Type Scale

```css
:root {
  --text-xs:   0.75rem;   /* 12px — metadata, timestamps, fine print */
  --text-sm:   0.875rem;  /* 14px — table data, labels, captions */
  --text-base: 1rem;      /* 16px — body text, form inputs */
  --text-lg:   1.125rem;  /* 18px — card titles, emphasized labels */
  --text-xl:   1.25rem;   /* 20px — section subheadings */
  --text-2xl:  1.5rem;    /* 24px — H3 */
  --text-3xl:  2rem;      /* 32px — H2, page titles */
  --text-4xl:  2.5rem;    /* 40px — H1, hero headlines */
  --text-hero: 4rem;      /* 64px — landing page hero only */
}
```

---

## 4. Spacing & Layout

```css
:root {
  /* Base unit: 4px */
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
}
```

### Layout Grid

- **Dashboard (portal.passr.eu):** 12-column grid, 24px gutters, 24px page margin. Sidebar: 240px fixed.
- **Public Passport (verify.passr.eu):** Single column, max-width 680px, centered. Mobile-first.
- **Marketing (passr.eu):** Standard 12-col, max-width 1200px.

---

## 5. Border & Shape System

```css
:root {
  /* Border radius — SHARP. Maximum 2px on interactive elements. */
  --radius-none: 0px;
  --radius-sm:   2px;    /* Buttons, inputs, cards — MAXIMUM allowed */
  --radius-badge: 2px;   /* Status badges */

  /* Border widths */
  --border-1: 1px;       /* Default structural borders */
  --border-2: 2px;       /* Focused inputs, active card */
  --border-4: 4px;       /* Left accent border on callout cards */

  /* Shadows: NONE */
  /* Do not use box-shadow for elevation. Use border differentiation instead. */
  /* Exception: focus ring only — 0 0 0 2px var(--color-signal) */
}
```

### Shape Rules

- **No rounded corners** on cards, modals, tables, or containers. `border-radius: 0`
- **Maximum 2px radius** on buttons and inputs (barely perceptible — keeps the sharp feel)
- **No drop shadows** anywhere except focus rings
- **All cards** use `border: 1px solid var(--border-default)` on dark surfaces
- **Active/alert cards** use `border-left: 4px solid var(--color-signal)` for the accent stripe

---

## 6. Component Specifications

### 6.1 Buttons

```
PRIMARY (Signal Red):
  background: var(--color-signal)
  color: #FFFFFF
  font: Space Grotesk Semibold, ALL CAPS, tracking 0.05em
  padding: 10px 20px
  border-radius: 2px
  border: none
  hover: background #E0342A (5% darker)
  active: background #C42D24

SECONDARY (Outlined):
  background: transparent
  color: var(--text-primary)
  border: 1px solid var(--border-strong)
  font: Space Grotesk Semibold, ALL CAPS, tracking 0.05em
  padding: 10px 20px
  border-radius: 2px
  hover: border-color var(--color-paper), background var(--surface-3)

GHOST:
  background: transparent
  color: var(--text-secondary)
  border: none
  font: Space Grotesk Medium
  hover: color var(--text-primary), background var(--surface-3)

DESTRUCTIVE:
  Same as PRIMARY but use --color-signal (red already signals destruction)
  Add a trash/warning icon prefix
```

### 6.2 Status Badges

```
COMPLIANT (Green):
  background: transparent
  border: 1px solid var(--color-verified)
  color: var(--color-verified)
  font: Roboto Mono Regular, UPPERCASE, text-xs
  padding: 3px 8px
  border-radius: 2px
  content: "● COMPLIANT"

NON-COMPLIANT (Signal Red):
  background: transparent
  border: 1px solid var(--color-signal)
  color: var(--color-signal)
  font: Roboto Mono Regular, UPPERCASE, text-xs
  padding: 3px 8px
  content: "● MISSING DATA"

WARNING (Amber):
  border-color: var(--color-warning)
  color: var(--color-warning)
  content: "● EXPIRING SOON"

DRAFT (Metal Grey):
  border-color: var(--color-metal)
  color: var(--color-metal)
  content: "● DRAFT"

VERIFIED SHIELD (Public Passport):
  This is the consumer-facing badge. Larger. More prominent.
  background: var(--color-verified)
  color: #FFFFFF
  font: Space Grotesk Bold
  padding: 8px 16px
  border-radius: 2px
  content: "✓ VERIFIED PFAS-FREE"
  Include: linked PDF icon on right edge
```

### 6.3 Data Tables

```
Header row:
  background: var(--surface-3)
  font: Space Grotesk Semibold, ALL CAPS, text-xs, tracking 0.08em
  color: var(--text-secondary)
  border-bottom: 1px solid var(--border-strong)
  padding: 10px 16px

Data rows:
  font: Roboto Mono Regular, text-sm  ← ALL DATA IN MONO
  color: var(--text-primary)
  border-bottom: 1px solid var(--border-default)
  padding: 12px 16px
  hover: background var(--surface-3)

Alternating rows: DO NOT use alternating bg colors. Use border-bottom only.

Column alignment:
  Text/names: left-align
  Numbers/percentages/ppm: right-align (Roboto Mono makes this look perfect)
  Status badges: center-align
  Dates: right-align, Roboto Mono
```

### 6.4 Form Inputs

```
Input field:
  background: var(--surface-3)
  border: 1px solid var(--border-default)
  border-radius: 2px
  font: Roboto Mono Regular, text-sm  ← data entry always in mono
  color: var(--text-primary)
  padding: 10px 14px
  focus: border-color var(--color-signal), outline: none
  placeholder: color var(--text-secondary)

Label:
  font: Space Grotesk Semibold, text-xs, ALL CAPS, tracking 0.06em
  color: var(--text-secondary)
  margin-bottom: 6px
  display: block

Helper text / error:
  font: Roboto Mono Regular, text-xs
  error color: var(--color-signal)
  helper color: var(--text-secondary)

Toggle (Yes/No):
  OFF state: border 1px solid var(--border-strong), bg var(--surface-3)
  ON state: bg var(--color-signal), border var(--color-signal)
  Knob: white square (border-radius: 1px), not circle

File upload zone:
  border: 2px dashed var(--border-strong)
  background: var(--surface-1)
  border-radius: 0px
  hover: border-color var(--color-paper)
  active drag: border-color var(--color-signal), bg var(--surface-3)
  Label: Space Grotesk Semibold, centered
  Sub-label: Roboto Mono, text-xs, metal grey
```

### 6.5 Navigation (Sidebar — portal.passr.eu)

```
Sidebar width: 240px fixed
Background: var(--surface-1) — slightly lighter than page bg for separation
Top: PASSR wordmark (Space Grotesk Bold, white) + orange dot favicon

Nav items:
  font: Space Grotesk Medium, text-sm
  color: var(--text-secondary)
  padding: 10px 16px
  border-radius: 0px
  hover: background var(--surface-3), color var(--text-primary)
  active: border-left: 3px solid var(--color-signal), background var(--surface-3),
          color var(--text-primary), padding-left: 13px (compensate for border)

Section labels (e.g. "COMPLIANCE", "SETTINGS"):
  font: Roboto Mono Regular, text-xs, ALL CAPS, tracking 0.1em
  color: var(--text-secondary)
  padding: 16px 16px 6px 16px
  non-interactive

Bottom of sidebar:
  Brand logo + name (small)
  Subscription tier badge (Roboto Mono, text-xs)
  Settings icon link
```

### 6.6 Compliance Traffic Light Widget

```
Container:
  border: 1px solid var(--border-default)
  background: var(--surface-1)
  padding: var(--space-6)

ALL COMPLIANT state:
  Left accent stripe: 4px solid var(--color-verified)
  Headline: "ALL SYSTEMS COMPLIANT" — Space Grotesk Bold, color-verified
  Sub: "50 / 50 products verified" — Roboto Mono, text-sm, text-secondary

WARNING state:
  Left accent stripe: 4px solid var(--color-warning)
  Headline: "ACTION REQUIRED" — Space Grotesk Bold, color-warning

CRITICAL state:
  Left accent stripe: 4px solid var(--color-signal)
  Headline: "COMPLIANCE GAPS DETECTED" — Space Grotesk Bold, color-signal
  List: each missing item is a clickable Roboto Mono row with → arrow
```

### 6.7 Cards

```
Standard card:
  background: var(--surface-1)
  border: 1px solid var(--border-default)
  border-radius: 0px
  padding: var(--space-6)

Card header:
  font: Space Grotesk Semibold, text-sm, ALL CAPS, tracking 0.06em
  color: var(--text-secondary)
  border-bottom: 1px solid var(--border-default)
  padding-bottom: var(--space-4)
  margin-bottom: var(--space-4)

Metric card (dashboard stat):
  Value: Space Grotesk Bold, text-3xl, color text-primary
  Label: Roboto Mono, text-xs, ALL CAPS, text-secondary
  Optional trend: Roboto Mono, text-xs, color-verified (up) or color-signal (down)
```

---

## 7. Page-Specific Rules

### 7.1 portal.passr.eu (Command Center)
- **Theme:** Dark. `--surface-0` as page background.
- **Density:** High. Show maximum data per screen. Users are professionals.
- **No onboarding illustrations** or friendly empty states with cartoon icons.
- **Empty states** use Roboto Mono text: `— NO PRODUCTS IMPORTED —` centered in a dashed border box.

### 7.2 verify.passr.eu (Public Passport)
- **Theme:** Light. `--surface-light-0` as page background.
- **Mobile-first.** Designed for a 390px viewport (iPhone 15 Pro). Test on mobile first.
- **Max-width 680px,** centered on desktop.
- **Brand logo** is the hero element. Large, centered, top of page.
- **Passr branding:** footer only. Small. `"Digital Passport secured by PASSR"` in Roboto Mono text-xs, metal grey.
- **Tab navigation** for the 4 sections (Overview / Compliance / Care & Repair / Supply Chain).
- **Performance:** Target < 1.5s LCP on 4G. No heavy JS bundles.

### 7.3 passr.eu (Marketing Site)
- **Theme:** Can be dark or mixed. Hero is dark (void black). Content sections can be light.
- **Imagery:** Macro black-and-white fabric textures. No people. No hiking photos.
- **Copy tone:** Short, dry, institutional. "Compliance protocols active." Not "We're excited to help!"

---

## 8. Iconography

- **Library:** Lucide React exclusively.
- **Stroke width:** 1.5px on all icons. Never filled icons.
- **Size:** 16px inline with text, 20px standalone, 24px feature icons.
- **Color:** Always inherit from text color. Never use orange on icons unless the icon IS an alert.
- **Never use emoji** as UI elements.

---

## 9. Motion & Transitions

```css
/* Minimal. Purposeful. Nothing decorative. */
--transition-fast:   100ms ease;   /* Hover states, focus rings */
--transition-base:   200ms ease;   /* Modal open, dropdown, tab switch */
--transition-slow:   300ms ease;   /* Page transitions, large content loads */

/* No bounce, spring, or elastic animations. */
/* No parallax. No scroll animations. */
/* Loading states: use a 1px signal-red progress bar at top of screen (NProgress style). */
```

---

## 10. Do / Do Not Reference

| ✅ DO | ❌ DO NOT |
|---|---|
| Use 1px borders to define structure | Use drop shadows for elevation |
| Use Roboto Mono for all data values | Use Inter for GTIN numbers or ppm values |
| Keep border-radius at 0–2px | Round any card corners |
| Use ALL CAPS for section labels and table headers | Use title case for metadata labels |
| Use the left-border stripe pattern for callout cards | Use colored backgrounds for callout cards |
| Design for data density — trust the user | Add empty padding to "look clean" |
| Use status badges with monochrome outlines | Use colored pill badges for everything |
| Show compliance data immediately on load | Hide data behind "click to expand" unless necessary |
| Use dashed borders for drag-and-drop zones | Use colored backgrounds for upload areas |
| Signal orange for non-compliance alerts ONLY | Use orange for hover states, links, or decorative elements |

---

## 11. Tailwind Config Reference

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        void:     '#0A0A0A',
        paper:    '#F4F4F4',
        metal:    '#858585',
        signal:   '#FF3B30',
        verified: '#22C55E',
        warning:  '#F59E0B',
        info:     '#1A56DB',
        surface: {
          0: '#0A0A0A',
          1: '#111111',
          2: '#1A1A1A',
          3: '#242424',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:    ['Roboto Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        none:    '0px',
        sm:      '2px',
      },
      boxShadow: {
        none:  'none',
        focus: '0 0 0 2px #FF3B30',  // focus ring only
      },
    },
  },
}
```

---

*End of DESIGN.md — Do not modify without updating the version number.*