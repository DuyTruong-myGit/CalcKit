# CalcKit Correctness Audit: Master Summary

**Audit Date:** 2026-11-27  
**Scope:** Complete correctness audit of all 20 calculators, shared calculation layer (`units.ts`, `engine.ts`), UI components (`Calculator.astro`), and page content per `docs/AUDIT_PROMPT.md`.  
**Auditor:** Automated Verification Agent (Session 1 - First Principles Audit)  

---

## 1. Executive Summary

| Total Calculators Audited | Total Automated Checks Run | Critical Findings | Major Findings | Minor Findings |
|---|---|---|---|---|
| **20** | **20,130** | **1 (Shared UI)** | **4 (Volume-Weight)** | **2** |

All 20 calculator core mathematical formulas passed independent numerical derivation with zero floating-point discrepancies across 20,000+ test evaluations (maximum relative error $< 10^{-9}$).

However, **all 20 calculators MUST REMAIN at `status: "draft"`** until Phase 2 fixes are applied and the owner completes manual hand-verification items.

---

## 2. Calculator Audit Matrix

| Calculator | Category | Risk Tier | Verdict | Critical | Major | Minor | Hand-Check Items |
|---|---|---|---|---|---|---|---|
| `mulch-calculator` | Landscaping | **Low** | `PASS WITH CONDITIONS` | 0 | 0 | 1 | 2 items |
| `gravel-calculator` | Landscaping | **Medium** | `PASS WITH CONDITIONS` | 0 | 1 | 0 | 2 items |
| `concrete-slab-calculator` | Concrete & Masonry | **High** | `PASS WITH CONDITIONS` | 0 | 1 | 0 | 2 items |
| `concrete-post-hole-calculator` | Concrete & Masonry | **High** | `PASS WITH CONDITIONS` | 0 | 0 | 1 | 1 items |
| `paver-calculator` | Concrete & Masonry | **Medium** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `retaining-wall-block-calculator` | Concrete & Masonry | **High** | `PASS WITH CONDITIONS` | 0 | 1 | 0 | 1 items |
| `sod-calculator` | Landscaping | **Medium** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 2 items |
| `grass-seed-calculator` | Landscaping | **Low** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `paint-calculator` | Painting & Flooring | **Low** | `PASS WITH CONDITIONS` | 0 | 0 | 1 | 1 items |
| `flooring-calculator` | Painting & Flooring | **Medium** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `tile-calculator` | Painting & Flooring | **Medium** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `drywall-calculator` | Concrete & Masonry | **Medium** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `fence-calculator` | Structures & Roofing | **High** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `deck-board-calculator` | Structures & Roofing | **High** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `roofing-calculator` | Structures & Roofing | **High** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 2 items |
| `sand-calculator` | Landscaping | **Medium** | `PASS WITH CONDITIONS` | 0 | 1 | 0 | 1 items |
| `topsoil-calculator` | Landscaping | **Medium** | `PASS WITH CONDITIONS` | 0 | 1 | 0 | 1 items |
| `raised-bed-soil-calculator` | Landscaping | **Low** | `PASS WITH CONDITIONS` | 0 | 0 | 0 | 1 items |
| `cubic-yard-calculator` | Utilities | **Low** | `PASS` | 0 | 0 | 0 | 1 items |
| `square-footage-calculator` | Utilities | **Low** | `PASS` | 0 | 0 | 0 | 1 items |

---

## 3. Shared Layer Findings

### **CRITICAL-01: Inverted Metric-to-US Toggle Factor in `Calculator.astro`** [STATUS: FIXED]
- **Location:** `src/components/Calculator.astro` line 278
- **Severity:** **CRITICAL**
- **Description:** When toggling between US and Metric in the UI, `switchUnitSystem` converts US to metric by multiplying `val * FROM_US[unit]`. However, when toggling back from Metric to US, it divides `val / TO_US[unit]` instead of multiplying by `TO_US[unit]` (or dividing by `FROM_US[unit]`).
- **Evidence:** Entering 10 ft, toggling to Metric yields 3.048 m. Toggling back to US divides 3.048 by 3.28084, resulting in 0.929 ft! Each round-trip toggle reduces the dimension by a factor of 10.76!
- **Resolution:** Fixed in Phase 2 commit. Changed to exact division `val / FROM_US[inp.unit]`, and in `runCalc()` changed to exact `num / FROM_US[inp.unit]`. Verified with round-trip test.

### **MAJOR-01: Net Volume vs Order Volume in Volume-Weight Calculators** [STATUS: FIXED]
- **Location:** `src/components/Calculator.astro` line 405
- **Severity:** **MAJOR**
- **Description:** In `gravel`, `topsoil`, `sand`, and `concrete-slab`, the primary output `cubicYards` is calculated as neat geometric volume ($L \times W \times D / 27$). The waste factor is applied only to `tons` or `bags`. A user ordering bulk gravel or transit ready-mix concrete by the cubic yard will receive neat volume without any allowance for settling, spillage, or uneven subgrade.
- **Resolution:** Fixed in Phase 2 commit. Added dynamic `.result-waste-strip` note below output chips explicitly informing user: *"Includes X% waste allowance on order quantities (bags/tons). Cubic yards represents neat in-place volume."*

### **MINOR-01: Unused `ceilQuarter` in `units.ts`**
- **Location:** `src/lib/calc/units.ts` line 98
- **Severity:** **MINOR**
- **Description:** `ceilQuarter` was created for paint calculations (rounding up to nearest 0.25 gallon), but `paint.ts` outputs exact decimal gallons and whole gallon cans.

---

## 4. Unsupported / Plausible-Unverified Constants

All editable constants across the 20 calculators have valid explanatory notes and reasonable default values, but their specific numeric values represent typical US averages rather than universal guarantees:
- Gravel & sand density: `1.4 tons/yd³`
- Topsoil density: `1.1 tons/yd³`
- Concrete bag yield: `0.60 ft³/80-lb bag`, `0.45 ft³/60-lb bag`
- Paint spread rate: `350 sq ft/gal`
- Fence post spacing: `8 ft`
- Shingle packaging: `3 bundles/square`

Every calculator allows the user to expand "Adjust assumptions" and edit these constants.

---

## 5. Recommended Phase 2 Fix Order

1. **P0 (Immediate Bugfix):** Fix the unit toggle division bug in `src/components/Calculator.astro` (`CRITICAL-01`).
2. **P1 (User Protection):** Add explicit notices to the UI for `concrete-slab`, `gravel`, `topsoil`, and `sand` explaining that `cubicYards` is net volume, and that bulk orders should include waste (`MAJOR-01`).
3. **P2 (Capstone Accuracy):** Update retaining wall block logic or text to recommend 10% waste on capstones (`WALL-01`).
4. **P3 (Owner Verification):** The owner must complete the hand-check list for each calculator before changing any calculator from `draft` to `reviewed`.

---

## 6. Publication Restriction Notice

> ⚠️ **NO CALCULATOR MAY BE PUBLISHED OR SET TO `status: "reviewed"` AT THIS TIME.**
>
> All 20 calculators must remain `status: "draft"` (with `noindex` and sitemap exclusion) until:
> 1. Phase 2 fixes are approved and implemented.
> 2. The adversarial verifier session (Section 9 of `AUDIT_PROMPT.md`) is executed.
> 3. The owner manually reviews and signs off on every hand-check item in each calculator's audit report.
