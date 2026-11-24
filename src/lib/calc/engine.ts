/**
 * engine.ts
 * Calculation engine: reads a calculator definition, validates inputs,
 * executes the pure formula, and formats results.
 *
 * Rules (from CLAUDE.md):
 * - Formulas are pure functions (no DOM, no network, no randomness).
 * - Validate input: reject negative, empty or non-numeric values with a short message.
 * - Never show NaN or Infinity.
 * - Round up (ceiling) any result bought in whole units (roundUp: true).
 */

import type { CalculatorDef, TestCase } from '../schema/types.js';
import { FORMULAS, type FormulaFunction } from './formulas/index.js';
import { parseInput, round, ceilWhole } from './units.js';

export interface CalculationSuccess {
  ok: true;
  /** Numerical values mapped by output id */
  values: Record<string, number>;
  /** Formatted strings mapped by output id (e.g. "1.23", "56") */
  formatted: Record<string, string>;
}

export interface CalculationFailure {
  ok: false;
  /** Field-specific error messages keyed by input or constant id */
  errors: Record<string, string>;
}

export type CalculationResult = CalculationSuccess | CalculationFailure;

/**
 * Execute calculation for a calculator definition given raw inputs and constants.
 */
export function calculate(
  def: Pick<CalculatorDef, 'formulaId' | 'inputs' | 'constants' | 'outputs'>,
  rawInputs: Record<string, unknown>,
  rawConstants?: Record<string, unknown>,
): CalculationResult {
  const formula: FormulaFunction | undefined = FORMULAS[def.formulaId];
  if (!formula) {
    return {
      ok: false,
      errors: { _general: `Formula with id "${def.formulaId}" is not registered.` },
    };
  }

  const errors: Record<string, string> = {};
  const parsedInputs: Record<string, number> = {};

  // 1. Validate inputs
  for (const inp of def.inputs) {
    const rawVal = rawInputs[inp.id] ?? inp.default;
    const parsed = parseInput(rawVal, inp.label, false);
    if (!parsed.ok) {
      errors[inp.id] = parsed.error;
    } else {
      if (inp.min !== undefined && parsed.value < inp.min) {
        errors[inp.id] = `${inp.label} must be at least ${inp.min}.`;
      } else if (inp.max !== undefined && parsed.value > inp.max) {
        errors[inp.id] = `${inp.label} must be at most ${inp.max}.`;
      } else {
        parsedInputs[inp.id] = parsed.value;
      }
    }
  }

  // 2. Validate constants
  const parsedConstants: Record<string, number> = {};
  for (const c of def.constants) {
    const rawVal = rawConstants?.[c.id] ?? c.default;
    const parsed = parseInput(rawVal, c.label, false);
    if (!parsed.ok) {
      errors[c.id] = parsed.error;
    } else {
      parsedConstants[c.id] = parsed.value;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // 3. Execute formula
  let rawOutputs: Record<string, number>;
  try {
    rawOutputs = formula(parsedInputs, parsedConstants);
  } catch (err) {
    return {
      ok: false,
      errors: { _general: err instanceof Error ? err.message : 'Calculation error' },
    };
  }

  // 4. Format outputs according to output definitions
  const values: Record<string, number> = {};
  const formatted: Record<string, string> = {};

  for (const out of def.outputs) {
    const rawVal = rawOutputs[out.id];
    if (rawVal === undefined || !Number.isFinite(rawVal)) {
      return {
        ok: false,
        errors: { [out.id]: `Calculation resulted in an invalid number for ${out.label}.` },
      };
    }

    // Per docs/CALCULATOR_SCHEMA.md:
    // Output values in expected are the unrounded result unless roundUp: true,
    // in which case they are the rounded-up value.
    let val = rawVal;
    if (out.roundUp) {
      val = ceilWhole(val);
    }

    values[out.id] = val;
    formatted[out.id] = (out.roundUp ? val : round(val, out.decimals)).toFixed(out.decimals);
  }

  return { ok: true, values, formatted };
}

/**
 * Validate a single testCase against the calculator definition and formula engine.
 */
export function runTestCase(
  def: Pick<CalculatorDef, 'formulaId' | 'inputs' | 'constants' | 'outputs'>,
  testCase: TestCase,
): { pass: boolean; failures: string[] } {
  const result = calculate(def, testCase.inputs, testCase.constants);
  const failures: string[] = [];

  if (!result.ok) {
    failures.push(`Calculation failed with errors: ${JSON.stringify(result.errors)}`);
    return { pass: false, failures };
  }

  const tolerance = testCase.tolerance ?? 0.01;

  for (const [outputId, expectedVal] of Object.entries(testCase.expected)) {
    const actualVal = result.values[outputId];
    if (actualVal === undefined) {
      failures.push(`Missing expected output "${outputId}" in result.`);
      continue;
    }

    const diff = Math.abs(actualVal - expectedVal);
    if (diff > tolerance) {
      failures.push(
        `Output "${outputId}" expected ${expectedVal} (±${tolerance}), but got ${actualVal} (diff: ${diff.toFixed(4)})`,
      );
    }
  }

  return {
    pass: failures.length === 0,
    failures,
  };
}
