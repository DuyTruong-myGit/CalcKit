/**
 * formula: concrete-slab
 * Used by: concrete slab calculator
 *
 * Inputs:
 *   length  – ft
 *   width   – ft
 *   depth   – in
 *   waste   – pct (default 10)
 *
 * Constants:
 *   yield   – ft³ per bag (default 0.6 for 80lb bag, 0.45 for 60lb bag)
 *
 * Outputs:
 *   cubicFeet   – ft³
 *   cubicYards  – yd³
 *   bags        – bags needed (whole units, rounded up)
 *
 * Source: docs/FORMULAS.md
 * cuFt = L × W × D / 12
 * cuYd = cuFt / 27
 * bags = ceil(cuFt × (1 + waste / 100) / yield)
 */

import { ft3ToYd3, pctToFactor, ceilWhole } from '../units.js';

export interface ConcreteSlabInputs {
  length: number;
  width: number;
  depth: number;  // inches
  waste?: number; // percent
}

export interface ConcreteSlabConstants {
  yield: number;  // ft³ per bag
}

export interface ConcreteSlabOutputs {
  cubicFeet: number;
  cubicYards: number;
  bags: number;
}

export function concreteSlab(
  inputs: ConcreteSlabInputs,
  constants: ConcreteSlabConstants,
): ConcreteSlabOutputs {
  const cubicFeet = inputs.length * inputs.width * (inputs.depth / 12);
  const cubicYards = ft3ToYd3(cubicFeet);
  const wasteFactor = 1 + pctToFactor(inputs.waste ?? 0);
  const bags = ceilWhole((cubicFeet * wasteFactor) / constants.yield);

  return { cubicFeet, cubicYards, bags };
}
