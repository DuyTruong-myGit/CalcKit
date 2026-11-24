# CLAUDE.md: instructions for AI coding agents

Read this file fully at the start of every session. Then read `docs/SPEC.md` and `docs/TASKS.md`.

## 1. Project

[SITE_NAME] is a static website of free calculators for home and garden materials (mulch, gravel, concrete, paint, flooring, roofing and similar) for US homeowners. Everything runs in the browser. There is no backend, no database, no accounts and no user data collected.

Revenue: display ads (Google AdSense, only after the owner confirms approval) and later affiliate links. Revenue never outranks correctness or usefulness.

Owner: a solo developer based in Vietnam. Site content is US English. The owner reviews all content before it is published.

Priorities, in order:
1. Correct numbers.
2. Useful, original content that a human would be glad to land on.
3. Speed and usability on phones.
4. Clean, maintainable code.
5. Monetization.

## 2. Stack and commands

- Astro (static output), TypeScript in strict mode.
- Calculator UI in vanilla TypeScript. No React, Vue or other UI framework.
- Plain CSS with custom properties. No CSS framework unless the owner approves.
- Vitest for unit tests. Node 20 or newer, npm.
- Hosting: Cloudflare Pages, build command `npm run build`, output directory `dist`.

Commands (create them in TASK-01 if missing):
- `npm run dev`: local dev server
- `npm run build`: production build
- `npm run test`: run all unit tests, including data-driven formula tests
- `npm run check`: `astro check` plus `tsc --noEmit`
- `npm run validate:data`: validate every file in `src/data/calculators/` against the schema in `docs/CALCULATOR_SCHEMA.md`

## 3. Repo layout

```
CLAUDE.md
docs/                      specs; do not edit unless a task says so
src/
  config.ts                site name, domain, flags (ADS_ENABLED, ANALYTICS)
  data/calculators/*.json  one file per calculator (single source of truth)
  lib/calc/
    units.ts               unit conversion
    engine.ts              reads a calculator definition, runs its formula
    formulas/<formulaId>.ts  pure functions, no DOM, no side effects
  components/              Calculator.astro, FAQ.astro, RelatedLinks.astro, AdSlot.astro
  layouts/Base.astro
  pages/                   index, [slug], about, contact, privacy-policy, terms, 404
  styles/
public/                    robots.txt, favicon, other static files
tests/
```

## 4. Correctness rules (most important)

- Formulas are pure functions in `src/lib/calc/formulas/`. No DOM access, no network, no randomness.
- `docs/FORMULAS.md` is the source of truth for formulas and default constants. If code and that file disagree, stop and ask.
- Every calculator JSON has at least 3 `testCases` with hand-calculated expected values. The test runner executes them automatically.
- Never change an expected value just to make a test pass. If you believe an expected value is wrong, show the hand calculation and ask the owner.
- Default constants (densities, bag yields, coverage rates, waste factors) must have a `note` field saying they are typical values and where to check them. The user can edit every constant in the UI.
- Round up (ceiling) any result bought in whole units (bags, sheets, tiles, posts). Show the unrounded value too when it helps.
- Support US units (ft, in, yd) and a metric toggle. Always show units next to every input and result.
- Validate input: reject negative, empty or non-numeric values with a short message that says what to fix. Never show `NaN` or `Infinity`.

## 5. Content rules

- US English, plain words, short sentences, active voice, sentence case. No hype, no filler, no "In conclusion", no "It is important to note".
- Never invent facts. Do not state prices, statistics, brand names, product specs, building-code claims or safety guarantees unless the owner supplied them.
- Original wording only. Do not copy or closely paraphrase text from other websites.
- Each calculator page has `status: "draft"` or `status: "reviewed"` in its JSON. You may write drafts only. Only the owner sets `reviewed`.
- Draft pages must be built with `noindex`, excluded from the sitemap and excluded from index listings.
- Follow `docs/CONTENT_GUIDE.md` for page structure, length and tone.
- No two pages may be near-duplicates. If two pages would share most of their text, merge them or give each real, distinct content (different examples, different reference table, different mistakes).

## 6. SEO rules

- One H1 per page. Unique `<title>` (60 characters or fewer) and meta description (155 or fewer).
- Canonical URL on every page. Sitemap via `@astrojs/sitemap`. `robots.txt` in `public/`.
- URL pattern: `/<name>-calculator/`, lowercase, hyphens.
- Each page links to 3 or 4 related calculators.
- Add structured data only when it matches content visible on the page.
- No keyword stuffing, hidden text, doorway pages or cloaking.

## 7. Ads, privacy and third-party code

- Do not add any ad script until the owner says AdSense is approved.
- `AdSlot.astro` exists but is switched off by `ADS_ENABLED=false` in `src/config.ts`. Slots reserve their space to avoid layout shift.
- Never place ads above the calculator, between its inputs, or in a way that can be mistaken for results or buttons. At most 2 slots per page on mobile.
- Never write copy that asks users to click ads.
- User inputs never leave the browser. Calculator code makes no network requests.
- Do not add trackers, third-party scripts, fonts from a CDN or cookies without asking. Analytics, if added, must be privacy-friendly and configured in `src/config.ts`.
- Never commit secrets, API keys or `.env` files.

## 8. Frontend and design rules

- Mobile first, one column, readable at 360 px wide. Tap targets at least 44 px. Number inputs use `inputmode="decimal"`. Every input has a visible label.
- Results update as the user types and also on a button press. Results sit in an `aria-live="polite"` region.
- Keyboard accessible, visible focus, AA contrast, respects `prefers-reduced-motion`. The page works fully with ads off and JavaScript errors in third-party code.
- Performance budget per page: JavaScript 30 KB gzipped or less, LCP under 2.5 s on a mid-range phone, CLS under 0.1. Prefer a system font stack. Use inline SVG rather than image files where possible. Every image needs `alt` text and must be original or clearly licensed.
- Design for the subject: a trustworthy tool for people measuring a yard or a room. Avoid generic template looks (cream background with serif display and terracotta accent, near-black with a neon accent, identical rounded cards with the same shadow, all-caps eyebrow labels above every heading, decorative gradients, fade-in animation on every section).
- Before writing UI code for the first time, write a short design plan in `docs/DESIGN.md`: 4 to 6 named hex colors, type choices and roles, layout idea, and what makes this site distinct. Check it against the points above, revise, then ask the owner to approve before building. Spend visual boldness in one place (for example the result display) and keep everything else quiet.
- Copy inside the UI says exactly what will happen: "Calculate", "Copy result", "Reset values". Error messages explain what is wrong and how to fix it, without apologizing.

## 9. Working agreement

- Work on one task from `docs/TASKS.md` at a time. State a short plan before changes that touch more than 2 files.
- Ask before adding a dependency, changing the stack, deleting files or changing anything in `docs/`.
- Before saying a task is done: run `npm run test`, `npm run check` and `npm run build`. Report real results, including failures. Do not claim something works without running it.
- Make small commits with conventional messages: `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
- When finished, update the task status in `docs/TASKS.md` and list anything the owner must verify by hand (for example default constants, copy to review).
- If a requirement is unclear or a number cannot be verified, stop and ask. Do not guess.

## 10. Never do

- Scrape or copy other sites, or reuse their text, tables or images.
- Generate pages in bulk without a reviewed definition for each.
- Fabricate reviews, testimonials, author bios, credentials or statistics.
- Add popups, interstitials, auto-playing media or anything that blocks the tool.
- Click or simulate clicks on ads, or add code that does.
- Give legal, medical, financial or structural-engineering advice. Calculators give estimates only, and every page carries the disclaimer from `docs/CONTENT_GUIDE.md`.

## 11. Definition of done (every task)

- Tests pass and new logic has tests.
- `npm run check` and `npm run build` pass with no warnings you introduced.
- Works at 360 px and at desktop width, with keyboard only, and with ads disabled.
- No new third-party requests.
- `docs/TASKS.md` updated, hand-check list reported.
