# FORMULAS: source of truth for calculation logic

Notation: L = length (ft), W = width (ft), D = depth or thickness (in), unless stated. All values below are defaults; the user can edit every constant in the UI. If code and this file disagree, stop and ask the owner.

Base conversions: 1 yd³ = 27 ft³. 1 ft = 12 in. 1 m³ ≈ 35.3147 ft³ ≈ 1.308 yd³. Round up (ceiling) anything bought in whole units. Waste factor: default 10% unless noted, adjustable.

Constants marked "verify" are typical values, not guarantees. Each must carry a `note` in the JSON telling the user to check the product label or supplier.

## Volume-based materials

1. **mulch-calculator** (formulaId `volume-bags`)
   cuFt = L × W × D / 12. cuYd = cuFt / 27. bags = ceil(cuFt × (1 + waste) / bagSize). bagSize options: 2 or 3 ft³ (default 2).
2. **gravel-calculator** (`volume-weight`)
   cuYd as above. tons = cuYd × density. density default 1.4 tons per yd³ (verify; varies by stone type and moisture).
3. **topsoil-calculator** (`volume-weight`)
   Same as gravel. Weight is optional and density must be user-editable (verify; depends on moisture).
4. **sand-calculator** (`volume-weight`)
   Same as gravel. density default about 1.4 tons per yd³ (verify; range roughly 1.3 to 1.5).
5. **raised-bed-soil-calculator** (`volume-bags`)
   cuFt = L × W × H, with H in feet (input in inches, divide by 12). cuYd = cuFt / 27. bags = ceil(cuFt × (1 + waste) / bagSize). bagSize default 1.5 ft³ (verify).

## Concrete and masonry

6. **concrete-slab-calculator** (`concrete-slab`)
   cuFt = L × W × D / 12. cuYd = cuFt / 27. bags = ceil(cuFt × (1 + waste) / yield). yield per bag: 80 lb ≈ 0.6 ft³, 60 lb ≈ 0.45 ft³ (verify against the bag label). Default waste 10%.
7. **concrete-post-hole-calculator** (`concrete-cylinder`)
   Inputs: hole diameter d (in), depth h (in), number of holes n, optional post size to subtract.
   cuFt per hole = π × (d/2)² × h / 1728. Total = per hole × n. Bags as in slab.
8. **paver-calculator** (`unit-count`)
   area = L × W. pavers = ceil(area × (1 + waste) / areaPerPaver). areaPerPaver includes the joint gap. Waste default 10% (diagonal patterns often need more). Offer an optional base layer using the gravel formula.
9. **retaining-wall-block-calculator** (`unit-count`)
   blocks = ceil(L × wallHeight × (1 + waste) / blockFaceArea). Waste default 5 to 10%. Cap blocks and base gravel are separate lines.

## Lawn

10. **sod-calculator** (`unit-count`)
    rolls = ceil(area × (1 + waste) / areaPerRoll). areaPerRoll must be an input because it varies by supplier. Waste default 5 to 10%.
11. **grass-seed-calculator** (`seed-rate`)
    pounds = area / 1000 × rate. rate (lb per 1,000 ft²) is an input chosen by grass type and by new lawn versus overseeding. Read from the seed label; the page may list typical ranges only if the owner supplies them.

## Interior and finishing

12. **paint-calculator** (`paint`)
    wallArea = perimeter × height − (doors × 20 + windows × 15) in ft² (defaults, adjustable). gallons = ceil(wallArea × coats / coverage × 4) / 4, i.e. round up to the nearest quarter gallon for display, whole gallons for purchase. coverage default 350 ft² per gallon (verify; range 350 to 400). Ceilings are a separate input.
13. **flooring-calculator** (`unit-count`)
    boxes = ceil(area × (1 + waste) / areaPerBox). Waste default 10%, 15% for diagonal layouts.
14. **tile-calculator** (`unit-count`)
    tiles = ceil(area × (1 + waste) / areaPerTile). areaPerTile includes the grout joint. Waste default 10 to 15%.
15. **drywall-calculator** (`unit-count`)
    sheets = ceil(area × (1 + waste) / sheetArea). Default sheet 4 × 8 ft = 32 ft². Waste default 10%. Offer 4 × 12 ft.

## Outdoor structures and roofing

16. **fence-calculator** (`fence`)
    posts = ceil(length / spacing) + 1, plus extra posts for gates and corners (input). panels = ceil(length / panelWidth). Default spacing 8 ft.
17. **deck-board-calculator** (`deck-boards`)
    rows = ceil(W_in / (boardWidth + gap)). totalLinearFt = rows × L. boards = ceil(totalLinearFt × (1 + waste) / boardLength). Waste default 10%. Framing and fasteners are out of scope for launch.
18. **roofing-calculator** (`roofing`)
    pitchFactor = sqrt(1 + (rise / 12)²). roofArea = footprintArea × pitchFactor. squares = roofArea / 100. bundles = ceil(squares × bundlesPerSquare × (1 + waste)). bundlesPerSquare default 3 (verify by product). Waste default 10 to 15%.

## Utilities

19. **cubic-yard-calculator** (`converter`)
    Convert between ft³, yd³, m³ and liters. Offer a volume calculator for a rectangle in addition to the converter.
20. **square-footage-calculator** (`area-shapes`)
    Rectangle L × W. Triangle ½ × base × height. Circle π × r². Compound shapes by adding and subtracting parts.

## Hand-calculated test cases

Use these as the first test cases. Tolerance 0.01 unless stated.

- Mulch: L 10, W 10, D 3, waste 0, bag 2 ft³ → cuFt 25, cuYd 0.9259, bags 13.
- Gravel: L 20, W 10, D 4, density 1.4, waste 0 → cuFt 66.667, cuYd 2.4691, tons 3.4568.
- Concrete slab: L 10, W 10, D 4, waste 0, yield 0.6 → cuFt 33.333, cuYd 1.2346, bags 56.
- Post hole: d 12, h 36, n 1 → cuFt 2.3562.
- Paint: perimeter 44, height 8, 1 door, 2 windows, 2 coats, coverage 350 → wallArea 302, gallons needed 1.7257, purchase 2.
- Roofing: footprint 1000 ft², rise 6, bundlesPerSquare 3, waste 0 → pitchFactor 1.1180, roofArea 1118.03, squares 11.18, bundles 34.
- Drywall: area 400, sheet 32, waste 10% → 13.75, purchase 14.
- Fence: length 100, spacing 8, extra 0 → posts 14.

Each calculator needs at least 3 test cases in its own JSON. Add more for edge cases (zero, very large, metric input, non-rectangular shape).
