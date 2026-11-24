# AdSense Readiness Audit Report

Date: 2026-11-24
Site: CalcKit (Material Calculators)
Audited by: Automated Quality Suite

---

## 1. Executive Summary

| Checklist Item | Target Requirement | Current Status | Notes / Action Items |
|---|---|---|---|
| **Custom Domain & HTTPS** | Custom domain, active SSL/TLS, apex/www redirect | ⚠️ **PENDING OWNER** | Waiting on owner domain registration (TASK-09 deferred Option A). Configured with placeholder `https://example.com`. |
| **Reviewed Content Pages** | 15–20 pages reviewed with substantive text | ⚠️ **PENDING OWNER REVIEW** | All 20 calculator pages are drafted with rich content (600–900 words each), but remain in `status: "draft"` per protocol until owner review. |
| **Required Trust Pages in Footer** | About, Contact, Privacy Policy, Terms & Disclaimer | ✅ **PASS** | All 4 pages are built, fully populated, accessible, and linked in `Base.astro` footer across all 27 routes. |
| **Privacy Policy Accuracy** | Accurately describes data practices | ✅ **PASS** | Accurately states pure client-side execution, zero data collection/cookies for calculators, and outlines future ad/cookie policy for AdSense. |
| **No Thin / Duplicate Content** | Substantial original content, 0 duplicates | ✅ **PASS** | Verified by `scripts/check-quality-content.js`: 0 duplicate intros, 0 broken cross-links, unique examples and tables on every page. |
| **Mobile Performance & UX** | Mobile-first, tap targets $\ge 44$px, LCP $< 2.5$s, CLS $< 0.1$ | ✅ **PASS** | Mobile Lighthouse: 100 Performance, 100 A11y, 100 Best Practices, CLS 0.0000, LCP 0.7s–1.3s. |
| **Ad Scripts State** | No ad scripts before AdSense approval | ✅ **PASS** | `ADS_ENABLED = false` in `src/config.ts`. `AdSlot.astro` is present but deactivated until formal AdSense approval. |

---

## 2. Page Inventory (27 Routes Total)

### A. Core Trust & Utility Pages (7 routes)
1. `/` (Home page / Featured calculators)
2. `/categories/` (Complete category index across all 5 trades)
3. `/about/` (Mission, methodology, and editorial standards)
4. `/contact/` (Direct contact details and user support info)
5. `/privacy-policy/` (Comprehensive data privacy disclosures)
6. `/terms/` (Terms of service and construction liability disclaimers)
7. `/404.html` (Accessible, clean error fallback)

### B. Calculator Pages (20 routes)
1. `/mulch-calculator/` — Landscaping
2. `/gravel-calculator/` — Landscaping
3. `/topsoil-calculator/` — Landscaping
4. `/sand-calculator/` — Landscaping
5. `/raised-bed-soil-calculator/` — Landscaping
6. `/sod-calculator/` — Landscaping
7. `/grass-seed-calculator/` — Landscaping
8. `/concrete-slab-calculator/` — Concrete & Masonry
9. `/concrete-post-hole-calculator/` — Concrete & Masonry
10. `/paver-calculator/` — Concrete & Masonry
11. `/retaining-wall-block-calculator/` — Concrete & Masonry
12. `/paint-calculator/` — Painting & Flooring
13. `/flooring-calculator/` — Painting & Flooring
14. `/tile-calculator/` — Painting & Flooring
15. `/drywall-calculator/` — Painting & Flooring
16. `/fence-calculator/` — Outdoor Structures & Roofing
17. `/deck-board-calculator/` — Outdoor Structures & Roofing
18. `/roofing-calculator/` — Outdoor Structures & Roofing
19. `/cubic-yard-calculator/` — Measurement Utilities
20. `/square-footage-calculator/` — Measurement Utilities

---

## 3. Immediate Action Items for Owner (To Launch & Apply for AdSense)

1. **Provide Domain Name & Site Identity**:
   - Register the chosen domain (e.g., via Cloudflare Registrar, Namecheap, etc.).
   - Update `src/config.ts`:
     - `siteName`: Chosen brand name
     - `domain`: `https://yourdomain.com`
     - `contactEmail`: `contact@yourdomain.com`
2. **Review & Promote Drafts to Reviewed**:
   - Review default constants and guidance across the 20 calculator JSON files in `src/data/calculators/`.
   - Update `"status": "draft"` to `"status": "reviewed"` in the JSON files.
   - This automatically removes the `noindex` robots meta tag and generates the complete `sitemap.xml` for Google Search Console.
3. **Deploy to Cloudflare Pages (TASK-09)**:
   - Connect repository to Cloudflare Pages (`npm run build`, output dir: `dist`).
   - Add custom domain with automated SSL/TLS certificate.
   - Submit sitemap `https://yourdomain.com/sitemap-index.xml` in Google Search Console.
4. **Apply for Google AdSense**:
   - Submit site URL in Google AdSense dashboard.
   - Once approved, proceed to **TASK-15** (`ADS_ENABLED = true`, add `ads.txt`).
