# AUDIT_PROMPT: correctness audit of every calculator

Paste the section "THE PROMPT" into a fresh agent session in the repo root. Run it in two separate sessions: session 1 is the auditor, session 2 is the adversarial verifier (section 9). Do not reuse the context of the session that wrote the code.

Phase 1 is read-only: the agent writes audit reports and verification scripts only. Fixes happen in Phase 2, after the owner has read the reports.

An AI audit lowers the chance of errors. It does not guarantee correctness. Constants (densities, bag yields, coverage rates) can only be confirmed against manufacturer or authoritative sources that a human checks. The owner keeps the final decision on setting any calculator to `reviewed`.

---

# THE PROMPT

## 0. Mission

The site CalcKit tells real people how much material to buy for real projects. A wrong number can waste money, delay a job, or, for structural or roofing work, lead someone to trust an unsafe estimate. Your job is to find every way a calculator could return a wrong, misleading, unsupported or invented result, and to prove each calculator correct or report why it is not.

You are not here to confirm that the code works. You are here to try to break it, and to say plainly what you could not verify.

Read first: `CLAUDE.md`, `docs/SPEC.md`, `docs/FORMULAS.md`, `docs/CALCULATOR_SCHEMA.md`, `docs/CONTENT_GUIDE.md`.

## 1. Scope

Audit every calculator that exists. Do not rely on the list in `docs/FORMULAS.md`; discover the real set by listing `src/data/calculators/*.json`, then compare with the expected 20 and report anything missing or extra. For each calculator audit all of:
- its JSON definition (inputs, constants, outputs, test cases, content text),
- its formula in `src/lib/calc/formulas/`,
- the shared code it uses (`units.ts`, `engine.ts`),
- the UI behavior around units, rounding, validation and display,
- every number and claim in its page text.

Also audit the shared layer once: unit conversion, rounding, input parsing, number formatting, the metric toggle.

## 2. Expert lenses

Review each calculator through the lens that fits it. You do not hold any license or credential and must never write as if you do; the lenses are ways of looking, not claims of authority.

- Concrete and structural lens: concrete slab, post hole concrete, retaining wall blocks, fence, deck boards, roofing (what quantities depend on, what is out of scope, what must not be presented as design advice).
- Landscape and soil lens: mulch, gravel, topsoil, sand, raised bed soil, sod, grass seed (bulk density, moisture, compaction, settling, coverage).
- Finishing lens: paint, flooring, tile, drywall, pavers (waste, pattern, cuts, coverage per container, box sizes).
- Metrology lens: units, exact conversion definitions, significant figures, US versus other unit systems.
- Numerical lens: floating point, rounding, boundary behavior, overflow, parsing.
- Consumer-protection lens: claims, disclaimers, defaults that quietly mislead, anything that could make a user lose money by trusting the result.

## 3. Ground rules (non-negotiable)

1. **Evidence over confidence.** A calculator is only "verified" if you re-derived it independently or checked it against a source you actually opened in this session. "Looks fine" is not a finding. If you cannot verify something, label it `UNVERIFIED` and say what would verify it.
2. **Derive before you read.** For each calculator, first write the formula from first principles with units, without opening the implementation. Only then compare it with `docs/FORMULAS.md`, the JSON and the code. The spec, code and tests may share the same mistake, so none of them counts as proof.
3. **No invented sources.** Cite only sources you retrieved in this session: title, publisher, section or page, URL, date accessed. If you have no web access, say so at the top of each report and list exactly which facts the owner must verify. Never write a citation from memory.
4. **No invented numbers.** If a constant has no source you can name, mark it `UNSUPPORTED` and recommend wording such as "typical value; check the product label" with the constant editable in the UI.
5. **Never weaken a test to make it pass.** Never change an expected value, tolerance or constant to hide a failure. Report it.
6. **Phase 1 is read-only.** Create only: `docs/audit/*.md` and verification scripts under `tests/audit/`. Do not edit calculators, formulas, content or docs.
7. **Report what you did not do.** State checks you skipped and why. Never write "everything looks good" without the number of checks run.
8. **Stop and ask** if the spec itself appears wrong or two authoritative sources disagree.

## 4. Procedure for each calculator

### A. Problem and risk
- Write one sentence on the real question the user is trying to answer and the decision they make with the result (buy, order, schedule).
- List every hidden assumption (flat and level surface, uniform depth, rectangular shape, no compaction, no spillage, standard product size, etc.).
- Assign a risk tier: **Low** (over-buying a little), **Medium** (under-buying causes delay and cost), **High** (result could be mistaken for a structural, safety or code decision: post holes, footings, retaining walls, decks, roofing, fence posts).
- For High tier: confirm the page presents a material quantity estimate only and gives no design advice (no hole depth, footing size, span, load, frost depth or code-compliance statements).

### B. Independent derivation
- Write the formula symbolically, with units at every step, and run a dimensional analysis. Confirm each output's unit follows from the inputs.
- Verify every conversion factor against its exact definition, for example: 1 ft = 12 in exactly, 1 yd = 3 ft, 1 yd³ = 27 ft³, 1 in = 25.4 mm exactly, 1 ft = 0.3048 m exactly, 1 US gal = 231 in³, 1 lb = 0.45359237 kg exactly. Check these against a source you open. Check "ton" is consistently the US short ton (2,000 lb), clearly labeled, and not confused with the metric tonne or the long ton. Check US versus imperial gallons, square feet versus square yards, linear feet versus board feet.

### C. Implementation check
- Compare the implementation line by line with your derivation.
- Trace one input through every layer: user entry, parsing, unit conversion to the base unit, formula, conversion back, rounding, display.
- Test the metric toggle in both directions and a round trip (imperial to metric to imperial returns the original within floating tolerance).
- Look for off-by-one errors, wrong operator precedence, integer division, unit applied twice, waste applied twice or not at all, percentage entered as 10 versus 0.10.

### D. Constants
For every default constant (density, bag yield, coverage rate, waste factor, spacing, door and window allowance, bundles per square, seed rate, sheet size):
- State its origin and plausible range, and whether it varies by product, region or moisture.
- Mark status: `VERIFIED` (with the source you opened), `PLAUSIBLE-UNVERIFIED`, or `UNSUPPORTED`.
- Run a sensitivity check: how much does the final result change across the plausible range? If the range changes the purchase quantity by more than about 10%, the page must say so and the constant must be editable.
- Confirm each constant has a `note` that tells the user to check the product label or supplier.

### E. Rounding and floating point
- Whole-unit purchases (bags, sheets, tiles, posts, bundles) must round up. Test inputs where the exact answer is an integer and floating point could push it just above (for example 12.000000000001 becoming 13). Define and apply a documented epsilon guard.
- Never round intermediate values. Round once, at the end, per output.
- Displayed precision must match input precision: no false precision such as 0.92592593 cubic yards.
- Display rounding must not change a purchase quantity (the number shown as "bags needed" must equal the exact ceiling used in the logic).

### F. Edge and hostile inputs
Test at least: zero, negative, empty, spaces, `NaN`, `Infinity`, very large, very small, `1e5`, comma versus period decimals, `1/2`, text, extremely long strings, depth entered in the wrong unit, swapped fields, and maximum values from the schema. Required behavior: a clear message, never `NaN`, `Infinity`, negative quantities or a silent wrong answer. Add plausibility warnings (not blocks) for values that are almost certainly a unit mistake, for example mulch depth of 48 inches.

### G. Property and metamorphic tests
Write executable checks, for example:
- Monotonic: increasing any dimension never decreases a quantity.
- Scaling: doubling length doubles volume; doubling all three dimensions multiplies volume by 8.
- Symmetry: length × width equals width × length.
- Zero: a zero dimension gives zero quantity.
- Unit invariance: the same project entered in feet and in meters gives the same physical answer within tolerance.
- Waste: waste 0 gives the raw value; waste w multiplies by (1 + w) once.
- Cross-calculator consistency: mulch, gravel, topsoil, sand and raised bed soil agree on cubic yards for the same bed; the cubic yard converter agrees with all of them; the square footage page agrees with area logic elsewhere.

### H. Independent numeric verification
Write a separate verification script under `tests/audit/` that does NOT import project code. Use Python with `fractions.Fraction` or `decimal` to compute expected results. Run at least 1,000 seeded random cases per calculator plus all edge cases through the real implementation via a thin harness. Report maximum absolute and relative error. Include commands and raw output in the report.

### I. Domain realism
- Compute 3 to 5 realistic projects per calculator and check that the results are plausible for that kind of project.
- List considerations the calculator ignores that a practitioner would raise. Examples to check for each: compaction and settling for gravel and base, subgrade irregularity and over-excavation for concrete, formwork and rebar being out of scope, ridge, hip, valley, starter and overhang being excluded from roofing, primer, texture and trim being excluded from paint, pallet and full-roll sizes for sod, species-dependent rates for seed, framing and fasteners being excluded from decks, gates and corners for fences, cuts and pattern waste for pavers, tile and flooring.
- For each, decide: handled, disclosed on the page, or missing. Missing items that could cause under-ordering are at least `MAJOR`.

### J. Consequence review
- Search the page text and UI for words that overpromise: "exactly", "guaranteed", "enough", "perfect", "code compliant", "safe", "engineered".
- Confirm the standard disclaimer appears and that High-tier pages add a sentence stating the calculator is not a design tool.
- Confirm no page gives prices, statistics, brand claims or building-code statements that were not supplied by the owner.

### K. Content audit
- Recompute every worked example and every number in the text with your verification script. Report any that do not match the calculator output for the same inputs.
- Check FAQ answers for unsupported factual claims; mark each claim as sourced, derivable from the formula, or unsupported.
- Check unit symbols and spelling are consistent (ft³ versus cu ft, yd³ versus cubic yards) and that no text contradicts the formula.

### L. UX pitfalls that cause wrong results
- Labels, placeholders and tooltips: is it unmistakable whether depth is in inches or feet? Whether bag size is cubic feet or pounds? Whether "tons" means US tons?
- Defaults: does the initial state produce a plausible, correct example?
- Does any default quietly bias the answer, for example a waste factor or density the user will not notice?

## 5. Severity and tolerance

- **CRITICAL**: wrong result for valid input, wrong unit conversion, unsafe or design-advice claim, invented or unsupported number presented as fact.
- **MAJOR**: wrong in edge cases or the metric path, rounding that can under-order, undisclosed assumption that materially changes the result, constant with no support and no note, a missing consideration that causes under-ordering.
- **MINOR**: wording, display precision, inconsistent symbols, missing warning for implausible input.
- **INFO**: observations and suggestions.

Tolerance policy: formula outputs must match your independent computation to a relative error of 1e-9 or better. Displayed values must be correct to half of the last displayed digit. Whole-unit outputs must equal the exact ceiling. Any larger deviation is a finding. Uncertainty in constants is reported separately in section D and is not a "pass" for the formula.

## 6. Deliverables

Create `docs/audit/<slug>.md` for each calculator:

1. Verdict: `PASS`, `PASS WITH CONDITIONS`, `FAIL` or `UNVERIFIED`.
2. Risk tier and the one-sentence user decision.
3. Assumptions the tool makes and whether the page discloses them.
4. Independent derivation with units.
5. Conversion factors checked, with sources.
6. Constants table: constant, default, plausible range, status, source, sensitivity.
7. Test evidence: commands run, number of cases, max error, raw output.
8. Findings table: ID, severity, location (file and line), what is wrong, evidence, proposed fix.
9. Items the owner must verify by hand.

Create `docs/audit/SUMMARY.md`: one row per calculator (verdict, risk tier, count of findings by severity), shared-layer findings, cross-calculator inconsistencies, constants still unsupported, and a recommended fix order starting with the CRITICAL items.

Create `tests/audit/` with the verification scripts and a `README.md` showing how to rerun them.

Finish by printing: the number of calculators audited, the number of checks run, the count of findings by severity, and the list of calculators that must not be published yet.

## 7. Starting hypotheses (verify; do not assume they are true)

The authors suspect these areas and want them examined first:
- Constants in `docs/FORMULAS.md` are typical values only: gravel, sand and topsoil density, bag yields for concrete, paint coverage, bundles per square, seed rates, sod roll size.
- The paint formula's rounding description mixes "nearest quarter gallon" with "whole gallons for purchase"; confirm exactly what is displayed and what is rounded up.
- Roofing uses footprint times pitch factor and ignores overhang, valleys, hips, ridge and starter; confirm the page states this.
- Post hole concrete ignores soil irregularity and the volume of the post (the formula only subtracts it optionally); confirm the page says it is an estimate and gives no depth or diameter recommendations.
- Gravel, sand and base layers ignore compaction; confirm the page says so or offers an adjustment.
- "Tons" must be US short tons everywhere, including the metric toggle path.
- Any place where depth is in inches but length and width are in feet.

## 8. Phase 2 (only after the owner approves the reports)

- Fix CRITICAL and MAJOR findings first, one calculator per commit, tests first.
- Update `docs/FORMULAS.md` only for changes the owner approves.
- Rerun the verification scripts and rewrite the affected audit reports.
- Do not set any calculator to `status: "reviewed"`. Only the owner does that, and only for calculators whose latest report is `PASS` or `PASS WITH CONDITIONS` with every owner-verification item completed.

## 9. Second session: adversarial verifier

Open a new session with this prompt:

> You are an adversarial reviewer. Read `docs/audit/SUMMARY.md` and the calculator reports, but do not trust them. For each calculator, choose 10 inputs yourself (including at least 3 edge cases and 2 metric cases), compute the expected results by hand or with an independent script you write now, and compare them with the running calculator. Try to find a wrong result, a misleading label, an overpromising sentence, or an unsupported number the first audit missed. Report each failure with exact inputs, expected value, actual value and evidence. If you find nothing for a calculator, say how many cases you tried. Do not edit any file except `docs/audit/ADVERSARIAL.md`.

## 10. Owner checklist after the audit

- [ ] Read `SUMMARY.md` and every `FAIL` or `UNVERIFIED` report.
- [ ] Hand-check 3 results per calculator with a calculator and a tape-measure example.
- [ ] Check every constant marked `UNSUPPORTED` or `PLAUSIBLE-UNVERIFIED` against a product label or manufacturer data, or keep it editable with a note.
- [ ] For High-tier pages, read the full text once and confirm it never reads like engineering or code advice.
- [ ] Only then set `status: "reviewed"`.
