# TASKS: work in this order

Status values: `todo`, `in-progress`, `done`, `blocked`. Update the status line when you finish a task. Work on one task at a time. Each task ends with the checks in `CLAUDE.md` section 11.

## Before you start (owner)

- Fill the open decisions in `docs/SPEC.md` section 11 (site name, domain, email, analytics).
- Create the Git repo and a Cloudflare Pages project.

---

### TASK-01: Scaffold
Status: todo
- Create the Astro project (static output, TypeScript strict, Vitest).
- Add the npm scripts listed in `CLAUDE.md` section 2 and the folder layout in section 3.
- Add `src/config.ts` with site name, domain, email, `ADS_ENABLED=false`, analytics setting.
- Acceptance: `npm run dev`, `test`, `check`, `build` all run. A placeholder home page builds.

### TASK-02: Data schema and validator
Status: todo
- Implement the types and the validator for `docs/CALCULATOR_SCHEMA.md` (`npm run validate:data`).
- Add one invalid fixture per rule in the tests (missing `note`, fewer than 3 test cases, unknown `related` slug, missing primary output).
- Acceptance: validator passes on the valid example and rejects each invalid fixture with a clear message.

### TASK-03: Calculation engine and units
Status: todo
- Implement `units.ts` and `engine.ts`. Implement formulas `volume-bags`, `volume-weight`, `concrete-slab` from `docs/FORMULAS.md`.
- Add a data-driven test that runs every `testCases` entry of every JSON file.
- Acceptance: the hand-calculated cases for mulch, gravel and concrete slab pass. Negative, empty and non-numeric inputs return a clear error, never `NaN`.

### TASK-04: Design plan
Status: todo
- Write `docs/DESIGN.md` following `CLAUDE.md` section 8: palette (4 to 6 named hex values), type, layout concept with an ASCII wireframe of the calculator page on mobile, and what makes the site distinct.
- Review it against the "avoid generic looks" list and revise.
- Acceptance: owner approves `docs/DESIGN.md`. Do not start TASK-05 before approval.

### TASK-05: Base layout and calculator component
Status: todo
- `Base.astro` (head tags, canonical, Open Graph, footer with required links), `Calculator.astro` (inputs, unit toggle, waste, assumptions panel, results, copy and reset), `FAQ.astro`, `RelatedLinks.astro`, `AdSlot.astro` (off by default, reserved space).
- Acceptance: works at 360 px, keyboard only and with JavaScript errors from third parties absent. Results announced via `aria-live`. JS under 30 KB gzipped per page.

### TASK-06: First three pages (mulch, gravel, concrete slab)
Status: todo
- Create the three JSON files with real drafts following `docs/CONTENT_GUIDE.md`. Keep `status: "draft"`.
- Dynamic route `[slug].astro` builds pages from the JSON. Draft pages get `noindex` and are excluded from the sitemap.
- Acceptance: three pages build, tests pass, report a hand-check list for the owner (constants and text to verify).

### TASK-07: Required pages and SEO plumbing
Status: todo
- About, Contact, Privacy Policy, Terms and Disclaimer, 404, home page, category index.
- `@astrojs/sitemap`, `robots.txt`, structured data that matches visible content only.
- Acceptance: all pages build, footer links work, sitemap lists only reviewed pages.

### TASK-08: Performance and accessibility pass
Status: todo
- Check Lighthouse (mobile) on the three pages and fix issues. Check color contrast, focus order, reduced motion.
- Acceptance: performance, accessibility and SEO scores at 90 or above, CLS under 0.1. Report the actual numbers.

### TASK-08B: Correctness audit (repeat for every batch, before anything is set to `reviewed`)
Status: todo
- Run the procedure in `docs/AUDIT_PROMPT.md` in a fresh session (auditor), then the adversarial verifier session described in its section 9.
- Phase 1 is read-only: audit reports in `docs/audit/`, verification scripts in `tests/audit/`.
- Phase 2: fix CRITICAL and MAJOR findings only after the owner has read the reports.
- Acceptance: every calculator has a report with verdict `PASS` or `PASS WITH CONDITIONS`, the owner has completed the hand-check items, and no CRITICAL finding is open. Repeat for each batch added in TASK-10 to TASK-13 and after any change to a formula, constant or unit logic.

### TASK-09: Deploy
Status: todo
- Connect the repo to Cloudflare Pages, set the custom domain, HTTPS, www redirect.
- Acceptance: the production site loads, `robots.txt` and the sitemap are reachable. Owner verifies the domain in Search Console and submits the sitemap.

### TASK-10 to TASK-13: Remaining calculators in batches of five
Status: todo
- Batch A: topsoil, sand, raised bed soil, pavers, retaining wall blocks.
- Batch B: sod, grass seed, paint, flooring, tile.
- Batch C: drywall, fence, deck boards, roofing, post hole concrete.
- Batch D: cubic yard converter, square footage, plus internal-linking pass and a check for near-duplicate text across pages.
- For each batch: implement missing formulas with tests first, then JSON drafts, then the owner reviews and sets `reviewed`.
- Acceptance per batch: tests pass, build passes, hand-check list delivered.

### TASK-14: AdSense readiness (owner decides when)
Status: todo
- Run the checklist: custom domain with HTTPS, 15 to 20 reviewed pages, four required pages linked in the footer, privacy policy matching reality, no thin or duplicate pages.
- Acceptance: written checklist with pass or fail per item. Do not add ad scripts yet.

### TASK-15: Ads on (only after the owner confirms approval)
Status: blocked until approval
- Add `ads.txt`, set `ADS_ENABLED=true`, enable the slot positions the owner chooses. Add a consent mechanism if EU or UK traffic is meaningful.
- Acceptance: no layout shift, ads never above the tool, site still fast. Report Lighthouse before and after.

### TASK-16: Weekly maintenance (ongoing)
Status: ongoing
- Based on Search Console data the owner provides: improve titles and descriptions for pages with impressions but few clicks, expand pages that are close to ranking, add new calculators scored with the method in the owner's planning notes.
