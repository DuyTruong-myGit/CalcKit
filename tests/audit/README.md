# CalcKit Independent Audit Verification Suite

This directory contains independent verification scripts for the correctness audit of CalcKit calculators per `docs/AUDIT_PROMPT.md`.

## Contents

- `verify_suite.test.ts`:
  - Fully independent pure JavaScript/TypeScript reference implementation of every calculator formula from first principles (does not import `src/lib/calc/formulas/`).
  - Audits all 20 calculator JSONs for constants notes, schema adherence, and valid ranges.
  - Tests all declared test cases against both independent math and the project engine.
  - Runs 1,000 seeded pseudo-random fuzz cases per calculator (20,000+ total runs) comparing engine results with independent calculations to verify relative error $< 10^{-4}$.
  - Outputs `tests/audit/audit_results.json`.

- `metamorphic_and_content.test.ts`:
  - **Monotonicity**: Verifies that increasing dimensions never decreases outputs.
  - **Symmetry**: Verifies that $L \times W = W \times L$ across 2D rectangular calculators.
  - **Waste factor**: Verifies that waste percentage applies $(1 + w/100)$ exactly once to whole-unit purchase outputs.
  - **Cross-calculator consistency**: Verifies that `mulch`, `gravel`, `topsoil`, `sand`, `raised-bed-soil`, and `cubic-yard-calculator` agree exactly on cubic yards for identical dimensions.
  - **Edge & hostile inputs**: Verifies rejection of negative numbers, empty strings, and `NaN`, and ensures 0-dimensions do not produce `NaN` or `Infinity`.

## How to Run

Run all audit test suites via Vitest:

```bash
# Run the entire audit suite
npx vitest run tests/audit/

# Run specifically the independent verification fuzzing suite
npx vitest run tests/audit/verify_suite.test.ts

# Run the metamorphic and property tests
npx vitest run tests/audit/metamorphic_and_content.test.ts
```
