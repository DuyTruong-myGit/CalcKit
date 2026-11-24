# DESIGN.md: visual plan for the calculator site

Status: **approved** — TASK-05 may proceed.

---

## 1. Concept

**"Clipboard and Tape Measure"** — the site looks like a tool, not a brand. The only visual drama
is the result display. Everything else stays out of the way.

The audience is a person standing in a yard with a tape measure, often on a phone, often in
sunlight. They came for a number. The design gives them that number fast and makes it unmistakable.

---

## 2. Colour palette

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#1a2332` | Body text, headings, button text on light |
| `--page` | `#ffffff` | Page background, input fields |
| `--rule` | `#dde3ec` | Input borders, section dividers, horizontal rules |
| `--muted` | `#64748b` | Help text, placeholders, secondary labels |
| `--action` | `#1d53c4` | Primary button fill, links, focus rings, header accent |
| `--signal` | `#f59e0b` | Result panel accent — the **only** place visual boldness is spent |

Design rationale:
- `--page` is pure white, not off-white or cream — no colour cast that would look tinted on
  low-quality phone screens outdoors.
- `--signal` (amber) is used exclusively on the result panel: a 4 px left border and the primary
  output value in a slightly larger size. It appears nowhere else on the page.
- `--action` is a confident mid-blue used for interactive elements only. Not decorative.
- Contrast: `--ink` on `--page` → 15.1:1. `--page` on `--action` → 7.8:1. Both pass WCAG AA and AAA.

Light theme is required. Dark theme is deferred (not cheap enough to be "optional" in TASK-05).

---

## 3. Typography

Font stack (no webfont download):
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Numeric outputs and inputs:
```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum";
```

| Use | Size | Weight | Notes |
|---|---|---|---|
| H1 (page title) | 1.5 rem (24 px) | 700 | Sentence case |
| H2 (section) | 1.125 rem (18 px) | 600 | Sentence case, no all-caps |
| Body | 1 rem (16 px) | 400 | Max line width 68 ch |
| Input label | 0.875 rem (14 px) | 500 | Above field, never floating |
| Help text | 0.8125 rem (13 px) | 400 | `--muted` |
| **Primary result** | **1.75 rem (28 px)** | **700** | Tabular nums, `--ink` |
| Secondary results | 1 rem (16 px) | 500 | Tabular nums, `--muted` |
| Button | 1 rem (16 px) | 600 | — |

No display font. No serif. No icon font (SVG inline where needed).

---

## 4. Layout

Single column throughout. No grid cards. The page is the tool.

- Max content width: **720 px**, centred with `margin: 0 auto`.
- Horizontal padding: `1 rem` on mobile, `2 rem` above 480 px.
- Calculator section and content sections are separated by `2 rem` vertical space and a `1 px`
  `--rule` divider — not a card shadow, not a rounded box.
- The result panel is the single elevated element: `border-left: 4px solid var(--signal)`,
  `background: #fafcff` (barely perceptible tint), `padding: 1rem 1.25rem`. It sits inside the
  calculator section, not in its own card.

### Mobile wireframe — 360 px wide

```
╔═══════════════════════════════╗  ← full-width
║ [C] CalcKit         [nav ≡]  ║  ← 48px header, --action background
╠═══════════════════════════════╣
║                               ║
║  Mulch Calculator             ║  ← H1
║  Intro text — 80–120 words    ║
║  ...                          ║
║                               ║
╠───────────────────────────────╣  ← --rule 1px divider
║                               ║
║  Length (ft)                  ║  ← label above field, 14px
║  ┌───────────────────────┐    ║
║  │  10               ft  │    ║  ← 48px height, inputmode="decimal"
║  └───────────────────────┘    ║
║  Width (ft)                   ║
║  ┌───────────────────────┐    ║
║  │  10               ft  │    ║
║  └───────────────────────┘    ║
║  Depth (in)                   ║
║  ┌───────────────────────┐    ║
║  │   3    Most beds: 2–3 in   ║  ← help text same line or below
║  └───────────────────────┘    ║
║  Extra for waste (%)          ║
║  ┌───────────────────────┐    ║
║  │  10               %   │    ║
║  └───────────────────────┘    ║
║                               ║
║  ▸ Adjust assumptions         ║  ← collapsed <details>, 44px target
║                               ║
║  ┌───────────────────────────┐║
║  │        Calculate          │║  ← --action bg, full-width, 48px
║  └───────────────────────────┘║
║                               ║
║  ┃ 0.93 yd³                   ║  ← --signal 4px left border
║    PRIMARY RESULT — 28px bold ║
║                               ║
║    25.0 ft³                   ║  ← secondary, 16px --muted
║    13 bags                    ║
║    Waste factor: 10%          ║
║                               ║
║  [Copy result]  [Reset]       ║  ← 44px min height, text buttons
║                               ║
╠───────────────────────────────╣
║  How it works                 ║  ← H2
║  ...                          ║
║  Worked examples              ║
║  ...                          ║
║  Quick reference              ║
║  ...                          ║
║  Common mistakes              ║
║  ...                          ║
║  FAQ                          ║
║  ...                          ║
║  Related calculators          ║
║  › Gravel Calculator          ║
║  › Topsoil Calculator         ║
║  › Raised Bed Soil            ║
╠───────────────────────────────╣
║  Results are estimates.       ║  ← disclaimer, --muted
║  Confirm with your supplier   ║
║  before you buy.              ║
╠───────────────────────────────╣
║ About · Contact · Privacy  ·  ║
║ Terms                         ║
╚═══════════════════════════════╝
```

---

## 5. What makes this site distinct

| Generic look to avoid | What this site does instead |
|---|---|
| Cream/off-white background with serif display type | Pure white background, system sans-serif |
| Near-black background with a neon or bright accent | Light theme only; `--action` blue is used only on interactive elements |
| Identical rounded cards with the same drop shadow | No cards at all; the page is flat and the result panel is the only elevated element |
| All-caps eyebrow labels above every heading | Sentence case throughout, `font-weight: 500` for labels |
| Decorative gradients (hero, section backgrounds) | No gradients anywhere |
| Fade-in / scroll-triggered animations | No motion other than the button press state; respects `prefers-reduced-motion` |
| Illustration or hero image of a garden | No illustrations; the calculator is the first thing on the page after the H1 |

**Where the visual boldness goes:** the primary result number only. Everything else — inputs,
labels, sections, navigation — is quiet. A visitor who scans the page cannot miss the answer.

---

## 6. Component states (to implement in TASK-05)

| Component | States |
|---|---|
| Input | default, focus (2px `--action` outline), error (1px red border + error message below) |
| Calculate button | default, hover (10% darker), active (pressed), disabled (opacity 0.5) |
| Result panel | hidden (pre-first-calculation), visible (aria-live="polite") |
| Adjust assumptions | collapsed (default), expanded |
| Copy button | default, copied (text changes to "Copied!" for 2 s) |

Error messages: red `#c0392b`, placed directly below the offending field with a short instruction
("Length must be 0 or greater."). No modal dialogs, no toast notifications.

---

## 7. Owner checklist before TASK-05 begins

- [ ] Colour palette approved (especially `--signal` amber for results)
- [ ] Type scale approved (28 px bold primary result)
- [ ] Layout concept approved (no cards, divider lines only)
- [ ] ASCII wireframe matches the calculator structure you have in mind
- [ ] Any changes or additions you want to request

Once you mark this approved, TASK-05 begins.
