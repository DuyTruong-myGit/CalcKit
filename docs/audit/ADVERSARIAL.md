# Session 2: Adversarial Verification Report

**Review Date:** 2026-11-27  
**Reviewer:** Adversarial Verifier (Session 2 - Hostile & Boundary Verification)  
**Target:** All 20 Calculators, Shared UI Engine, and Page Copy  
**Test Suite:** `tests/audit/adversarial_runner.test.ts` (200 executed adversarial cases)  

---

## 1. Executive Summary

As an adversarial reviewer, I did not trust the Phase 1 reports. For each of the 20 calculators, I selected **10 rigorous test cases** (total **200 adversarial cases**):
- **3 hostile / boundary edge cases** (zero dimensions, zero waste, extreme commercial dimensions, minimum/maximum thickness limits).
- **2 metric cases** (metric measurements converted to US base, verifying exact volumetric agreement).
- **5 realistic tape-measure projects** representing real-world DIY home installations.

In addition, I conducted a full automated text scan across all JSON definitions for overpromising words, warranties, or misleading engineering claims.

**Result:**
* **200 of 200 adversarial test cases passed.**
* Zero numerical discrepancies found in the core engine math.
* Zero unauthorized structural, safety, or legal code claims detected.
* Floating-point ceiling logic correctly handled boundary rounding with the documented $10^{-8}$ epsilon guard.

---

## 2. Adversarial Test Results by Calculator

### 1. Mulch Calculator (`mulch-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length ($0 \times 10$ ft, 3 in) $\to 0$ bags.
  - Zero depth ($20 \times 10$ ft, 0 in) $\to 0$ bags.
  - Large commercial park ($500 \times 200$ ft, 3 in, 10% waste, 2 ft³ bags) $\to 25,000$ ft³, $925.93$ yd³, $13,750$ bags.
- **Metric Cases:**
  - $5\text{ m} \times 3\text{ m} \times 5\text{ cm}$ (10% waste, 2 ft³ bags) $\to 15$ bags.
  - $10\text{ m} \times 10\text{ m} \times 7.5\text{ cm}$ (10% waste, 2 ft³ bags) $\to 146$ bags.
- **Defects Found:** None. Core logic and bag ceiling work correctly.

### 2. Gravel Calculator (`gravel-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero dimension $\to 0$ tons.
  - Deep trench ($100 \times 1$ ft at 24 in, density 1.4, 0% waste) $\to 200$ ft³, $10.37$ tons.
  - 0% waste subgrade ($30 \times 12$ ft at 4 in) $\to 6.22$ tons.
- **Metric Cases:**
  - $10\text{ m} \times 3\text{ m} \times 10\text{ cm}$ (density 1.4, 10% waste) $\to 6.04$ tons.
  - $5\text{ m} \times 1\text{ m} \times 5\text{ cm}$ path (density 1.3, 5% waste) $\to 0.45$ tons.
- **Defects Found:** None. Phase 2 waste notice accurately clarifies that cubic yards is neat volume.

### 3. Concrete Slab Calculator (`concrete-slab-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero dimension $\to 0$ bags.
  - Heavy 8-inch pad ($20 \times 20$ ft at 8 in, 5% waste) $\to 266.67$ ft³, $467$ bags.
  - Thin 2-inch leveling pour ($10 \times 10$ ft at 2 in, 10% waste) $\to 31$ bags.
- **Metric Cases:**
  - $4\text{ m} \times 3\text{ m} \times 10\text{ cm}$ ($13.12 \times 9.84$ ft at 3.94 in, 10% waste) $\to 78$ bags.
  - $2\text{ m} \times 2\text{ m} \times 15\text{ cm}$ AC pad (10% waste) $\to 39$ bags.
- **Defects Found:** None.

### 4. Concrete Post Hole Calculator (`concrete-post-hole-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Single 6-inch post hole at 12 in depth $\to 1$ bag.
  - Large commercial pier: 24 in diameter, 48 in deep, 10% waste $\to 24$ bags (80-lb).
  - 100 fence holes: 8 in diameter, 24 in deep, 10% waste $\to 128$ bags (80-lb).
- **Metric Cases:**
  - 25 cm diam, 90 cm deep, 4 holes, 10% waste $\to 12$ bags.
  - 30 cm diam, 120 cm deep, 2 holes, 10% waste $\to 11$ bags.
- **Defects Found:** None. Cylinder volume $\pi r^2 h / 1728$ holds exact precision.

### 5. Paver Calculator (`paver-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero area $\to 0$ pavers.
  - Large architectural slabs $24 \times 24$ in ($20 \times 20$ ft patio, 10% waste) $\to 110$ pavers.
  - 0% waste running bond $\to 450$ pavers.
- **Metric Cases:**
  - $6\text{ m} \times 4\text{ m}$ patio (10% waste, 4x8 in pavers) $\to 1,279$ pavers.
  - $3\text{ m} \times 1\text{ m}$ walkway (10% waste) $\to 160$ pavers.
- **Defects Found:** None.

### 6. Retaining Wall Block Calculator (`retaining-wall-block-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ blocks.
  - 100 ft wall at 2 ft high, 0% waste $\to 300$ blocks, $75$ caps.
  - Compact garden blocks ($12 \times 4$ in face) on 20x1 ft wall $\to 66$ blocks.
- **Metric Cases:**
  - $10\text{ m} \times 0.9\text{ m}$ high (10% waste) $\to 160$ blocks.
  - $5\text{ m} \times 0.6\text{ m}$ high (10% waste) $\to 54$ blocks.
- **Defects Found:** None. Text clearly warns that walls over 4 feet require engineered structural design.

### 7. Sod Calculator (`sod-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ rolls.
  - 0% waste ($50 \times 20$ ft) $\to 100$ rolls.
  - 9 sq ft sod farm rolls ($60 \times 30$ ft, 10% waste) $\to 220$ rolls.
- **Metric Cases:**
  - $15\text{ m} \times 10\text{ m}$ (10% waste) $\to 178$ rolls.
  - $20\text{ m} \times 8\text{ m}$ (10% waste) $\to 190$ rolls.
- **Defects Found:** None.

### 8. Grass Seed Calculator (`grass-seed-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero area $\to 0$ lbs.
  - Heavy new fescue lawn ($100 \times 50$ ft, rate 8 lbs/1,000 sq ft, 20 lb bags) $\to 40$ lbs, $2$ bags.
  - Light overseed ($50 \times 20$ ft, rate 1.5, 5 lb bags) $\to 1.5$ lbs, $1$ bag.
- **Metric Cases:**
  - $20\text{ m} \times 15\text{ m}$ lawn (rate 4) $\to 12.9$ lbs, $3$ bags (5-lb).
  - $30\text{ m} \times 20\text{ m}$ lawn (rate 3) $\to 19.4$ lbs, $2$ bags (10-lb).
- **Defects Found:** None.

### 9. Paint Calculator (`paint-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Deductions exceed wall area ($5 \times 5$ ft room with 5 doors, 5 windows) $\to$ correctly clamped to $0$ sq ft, $0$ cans (no negative outputs).
  - High coverage 400 sq ft/gal on primed wall $\to 1.45$ gal, $2$ cans.
  - 4 coats on porous wall (300 sq ft/gal) $\to 3.80$ gal, $4$ cans.
- **Metric Cases:**
  - $4\text{ m} \times 3.5\text{ m}$ room, 2.5m ceiling (1 door, 1 window, 2 coats) $\to 3$ cans.
  - $5\text{ m} \times 4\text{ m}$ room, 3m ceiling (2 doors, 2 windows, 2 coats) $\to 3$ cans.
- **Defects Found:** None. Negative area clamping works cleanly.

### 10. Flooring Calculator (`flooring-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ boxes.
  - 0% waste $\to 10$ boxes.
  - 20% waste for complex herringbone ($20 \times 15$ ft, 25 sq ft/box) $\to 15$ boxes.
- **Metric Cases:**
  - $5\text{ m} \times 4\text{ m}$ (10% waste, 20 sq ft/box) $\to 12$ boxes.
  - $6\text{ m} \times 5\text{ m}$ (10% waste, 22 sq ft/box) $\to 17$ boxes.
- **Defects Found:** None.

### 11. Tile Calculator (`tile-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero dimension $\to 0$ tiles.
  - Small subway tiles $3 \times 6$ in on $10 \times 3$ ft backsplash (40 tiles/box, 10% waste) $\to 264$ tiles, $7$ boxes.
  - Large format $8 \times 48$ in planks on $20 \times 10$ ft floor (15% waste, 4 tiles/box) $\to 87$ tiles, $22$ boxes.
- **Metric Cases:**
  - $3\text{ m} \times 2\text{ m}$ bathroom (10% waste, 12x12 in tiles, 10/box) $\to 72$ tiles, $8$ boxes.
  - $4\text{ m} \times 3\text{ m}$ kitchen (10% waste, 12x24 in tiles, 8/box) $\to 72$ tiles, $9$ boxes.
- **Defects Found:** None.

### 12. Drywall Calculator (`drywall-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero area $\to 0$ sheets.
  - 0% waste ($40 \times 10$ ft) $\to 13$ sheets.
  - Large $4 \times 12$ ft sheets ($60 \times 10$ ft, 10% waste) $\to 14$ sheets.
- **Metric Cases:**
  - $12\text{ m} \times 3\text{ m}$ (10% waste, 32 sq ft sheets) $\to 14$ sheets.
  - $15\text{ m} \times 2.5\text{ m}$ (10% waste, 48 sq ft sheets) $\to 10$ sheets.
- **Defects Found:** None.

### 13. Fence Calculator (`fence-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero run length with 1 gate and 2 corners $\to 3$ extra posts, $0$ panels.
  - 6-ft high-wind spacing on 60 ft fence $\to 11$ posts, $10$ panels.
  - 4-ft tall fence with 2 rails $\to 12$ rails.
- **Metric Cases:**
  - $30\text{ m}$ run ($98.43$ ft, 1 gate, 2 corners) $\to 17$ posts.
  - $50\text{ m}$ run ($164.04$ ft, 2 gates, 4 corners) $\to 28$ posts.
- **Defects Found:** None.

### 14. Deck Board Calculator (`deck-board-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ boards.
  - Tight 1/8-in gap ($0.125$ in) on 12 ft width $\to 26$ courses.
  - 20 ft boards on 20 ft long deck $\to 38$ boards.
- **Metric Cases:**
  - $5\text{ m} \times 4\text{ m}$ (10% waste, 16 ft boards) $\to 32$ boards.
  - $6\text{ m} \times 3.5\text{ m}$ (10% waste, 20 ft boards) $\to 26$ boards.
- **Defects Found:** None.

### 15. Roofing Calculator (`roofing-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Rise = 1 (near flat) $\to$ pitch factor $1.003$.
  - 12:12 steep pitch (45°) $\to$ pitch factor $1.414$, $43$ bundles.
  - Mansard 18:12 pitch $\to$ pitch factor $1.803$, $60$ bundles.
- **Metric Cases:**
  - $12\text{ m} \times 8\text{ m}$ footprint ($39.37 \times 26.25$ ft, 6:12 pitch, 10% waste) $\to 39$ bundles.
  - $15\text{ m} \times 10\text{ m}$ footprint ($49.21 \times 32.81$ ft, 4:12 pitch, 10% waste) $\to 57$ bundles.
- **Defects Found:** None.

### 16. Sand Calculator (`sand-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ tons.
  - Packed wet sand (density 1.55) $\to 4.21$ tons.
  - Dry loose sand (density 1.25) $\to 0.77$ tons.
- **Metric Cases:**
  - $4\text{ m} \times 3\text{ m} \times 5\text{ cm}$ (density 1.4, 10% waste) $\to 1.21$ tons.
  - $5\text{ m} \times 5\text{ m} \times 5\text{ cm}$ (density 1.4, 10% waste) $\to 2.52$ tons.
- **Defects Found:** None.

### 17. Topsoil Calculator (`topsoil-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ tons.
  - Heavy unscreened loam (density 1.35) $\to 5.50$ tons.
  - Light compost blend (density 0.90) $\to 1.67$ tons.
- **Metric Cases:**
  - $10\text{ m} \times 5\text{ m} \times 10\text{ cm}$ (density 1.1, 10% waste) $\to 7.92$ tons.
  - $6\text{ m} \times 4\text{ m} \times 5\text{ cm}$ (density 1.1, 10% waste) $\to 1.90$ tons.
- **Defects Found:** None.

### 18. Raised Bed Soil Calculator (`raised-bed-soil-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ bags.
  - Deep 24-in planter ($8 \times 4$ ft at 24 in, 5% waste) $\to 45$ bags.
  - 2.0 cu ft large bag $\to 6$ bags.
- **Metric Cases:**
  - $2.4\text{ m} \times 1.2\text{ m} \times 30\text{ cm}$ deep (5% waste) $\to 22$ bags.
  - $1.2\text{ m} \times 1.2\text{ m} \times 20\text{ cm}$ deep (5% waste) $\to 8$ bags.
- **Defects Found:** None.

### 19. Cubic Yard Calculator (`cubic-yard-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Zero length $\to 0$ yd³.
  - Exactly 27 cu ft ($3 \times 3 \times 3$ ft) $\to 1.00$ yd³.
  - Thin 0.5 in depth over $100 \times 100$ ft $\to 15.43$ yd³.
- **Metric Cases:**
  - $10\text{ m} \times 10\text{ m} \times 1\text{ m} \to 100\text{ m}^3$.
  - $1\text{ m} \times 1\text{ m} \times 1\text{ m} \to 1,000\text{ L}$.
- **Defects Found:** None. Exact NIST conversion factors confirmed.

### 20. Square Footage Calculator (`square-footage-calculator`)
- **Cases Tested:** 10 (3 edge, 2 metric, 5 realistic).
- **Edge Cases Tested:**
  - Rectangle length 0 $\to 0$ sq ft.
  - Circle diameter 0 $\to 0$ sq ft.
  - Triangle base 0 $\to 0$ sq ft.
- **Metric Cases:**
  - $10\text{ m} \times 10\text{ m} \to 100\text{ m}^2$.
  - Circle diameter 10 m $\to 78.54\text{ m}^2$.
- **Defects Found:** None. Exact 0.09290304 conversion holds.

---

## 3. Hostile Copy & Claims Review

A regex scan of all JSON copy across `src/data/calculators/*.json` for prohibited overpromising words:
- `guarantee` / `guaranteed`: **0 occurrences**.
- `perfect`: **0 occurrences**.
- `code compliant`: **0 occurrences**.
- `structurally sound`: **0 occurrences**.
- `engineered`: 2 occurrences, both legitimate (referring to "engineered wood flooring" product type and stating that walls over 4 feet require engineered plans).
- `safe`: 2 occurrences, both disclaimers describing extra safety buffers.

Every single calculator page displays the required estimate disclaimer. High-tier structural calculators (slab, post hole, deck boards, fence, roofing, retaining wall) explicitly state they are material estimation tools only and not structural design advice.

---

## 4. Final Verdict

### **ADVERSARIAL VERIFICATION: PASS**

The system has proven resilient against hostile boundaries, decimal precision shifts, metric conversions, and realistic construction scenarios. All 200 adversarial test cases pass.
