# SPEC: home and garden calculator site

## 1. Goal

Build a fast, trustworthy static site where US homeowners estimate how much material a project needs. Visitors arrive from search with one question ("how many bags of mulch for 200 sq ft") and leave with a number they can act on, plus enough explanation to trust it.

Success looks like: correct results, pages indexed by Google, approval for AdSense, steady organic traffic over the following months.

Non-goals: user accounts, saving projects, price lookups, shopping carts, forums, comments, a backend of any kind.

## 2. Audience

- US homeowners and DIYers planning a weekend project.
- Small contractors who want a quick estimate on a phone at a job site.
- Mostly on mobile. Often standing in a yard with a tape measure. Expect imperial units, occasional metric.

## 3. Site map (launch scope)

Home page, a category index, 20 calculator pages (list in `docs/FORMULAS.md`), and the pages About, Contact, Privacy Policy, Terms and Disclaimer, 404.

Categories:
- Landscaping: mulch, gravel, topsoil, sand, sod, grass seed, raised bed soil
- Concrete and masonry: concrete slab, post hole concrete, pavers, retaining wall blocks
- Painting and flooring: paint, flooring, tile, drywall
- Outdoor structures and roofing: fence, deck boards, roofing
- Utilities: cubic yard converter, square footage

## 4. Page anatomy (calculator page)

Generated from one JSON file per calculator (see `docs/CALCULATOR_SCHEMA.md`). Order:

1. H1 and a short intro (80 to 120 words).
2. The calculator: inputs, unit toggle, waste factor where relevant, editable constants in a collapsed "Adjust assumptions" section, results.
3. "How it works": the formula in words and numbers, where defaults come from.
4. Worked examples (1 or 2) using real numbers.
5. Quick reference table.
6. Common mistakes.
7. FAQ (4 or 5 questions).
8. Related calculators (3 or 4 links).
9. Disclaimer.

Target 600 to 900 words of text outside the tool. See `docs/CONTENT_GUIDE.md`.

## 5. Calculator behavior

- Inputs: numeric fields with clear units and sensible defaults, shown as placeholders or initial values that produce a plausible result immediately.
- Shapes: where a project is not rectangular (garden beds, patios), offer a shape selector (rectangle, circle, triangle) or "enter total area" as an alternative.
- Units: imperial by default, metric toggle. Convert internally to one base system.
- Results: show the main number large, secondary numbers below (cubic yards, cubic feet, bags, tons as relevant), and one line stating the waste factor used.
- Copy button for results (plain text). Reset button.
- Shareable state is optional: reflect inputs in the URL hash only if it does not add noticeable weight. No personal data ever.
- Validation and errors: see `CLAUDE.md` section 4.

## 6. Design

- Written to a separate `docs/DESIGN.md` by the agent before UI work starts, and approved by the owner.
- Tone: practical, clean, confident. The tool is the hero of each page; ads and decoration never compete with it.
- Typography: system font stack unless the owner approves a single webfont. Line length under 80 characters for body text.
- Light theme required. Dark theme optional (`prefers-color-scheme`) if cheap.

## 7. Technical requirements

- Astro static output. One dynamic route `[slug].astro` builds pages from `src/data/calculators/*.json`.
- Formula engine in `src/lib/calc/` with unit tests. Data-driven tests read `testCases` from every JSON file.
- Build fails if any JSON fails schema validation or any test case fails.
- Draft pages: `noindex`, excluded from sitemap and index listings.
- `src/config.ts` holds: site name, domain, contact email, `ADS_ENABLED`, analytics settings, last-updated date format.
- Sitemap, robots.txt, canonical tags, Open Graph tags, favicon, 404 page.
- Performance and accessibility targets in `CLAUDE.md` section 8.

## 8. Required legal and trust pages

Use the templates in `docs/CONTENT_GUIDE.md`. Footer links to About, Contact, Privacy Policy, Terms and Disclaimer on every page. The privacy policy must describe what the site really does (no data collected by the calculators, analytics and ads once enabled).

## 9. Monetization phases

1. Launch with no ads. Build pages, get indexed, build content history.
2. After AdSense approval: set `ADS_ENABLED=true`, add `ads.txt` to `public/`, enable `AdSlot` positions defined by the owner. If EU or UK traffic is meaningful, add a consent mechanism before serving personalized ads.
3. Later: affiliate links under "Where to buy" sections, each with a visible disclosure. Added only when the owner supplies the links.

## 10. Deployment

- Git repo, `main` branch deploys to Cloudflare Pages.
- Custom domain with HTTPS. Redirect `www` to the apex (or the reverse) consistently.
- After first deploy: verify the domain in Google Search Console and submit the sitemap.

## 11. Open decisions (the owner fills these in)

- Site name: [SITE_NAME]
- Domain: [DOMAIN]
- Contact email: [EMAIL]
- Analytics choice: [none | Cloudflare Web Analytics | GA4]
