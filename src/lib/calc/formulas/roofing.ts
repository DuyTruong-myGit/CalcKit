/**
 * formula: roofing
 * Used by: roofing-calculator
 *
 * Inputs:
 *   length    – ft (building footprint length or direct footprintArea if width=0)
 *   width     – ft (building footprint width)
 *   rise      – in per 12 in run (e.g. 4 for 4:12 pitch, 6 for 6:12)
 *   waste     – pct (default 10)
 *   footprint – sq ft (optional direct override)
 *
 * Constants:
 *   bundlesPerSquare – count (default 3)
 *
 * Outputs:
 *   bundles     – shingle bundles to buy (rounded up)
 *   squares     – roofing squares (1 square = 100 sq ft)
 *   roofArea    – total true sloped roof area in sq ft
 *   pitchFactor – slope multiplier
 *
 * Source: docs/FORMULAS.md lines 58-59 & 77
 * pitchFactor = sqrt(1 + (rise / 12)²)
 * roofArea = footprintArea × pitchFactor
 * squares = roofArea / 100
 * bundles = ceil(squares × bundlesPerSquare × (1 + waste/100))
 */

import { pctToFactor, ceilWhole } from '../units.js';

export interface RoofingInputs {
  length?: number;
  width?: number;
  rise: number;
  waste?: number;
  footprint?: number;
}

export interface RoofingConstants {
  bundlesPerSquare?: number; // default 3
}

export interface RoofingOutputs {
  bundles: number;
  squares: number;
  roofArea: number;
  pitchFactor: number;
}

export function roofing(
  inputs: RoofingInputs,
  constants: RoofingConstants,
): RoofingOutputs {
  let footprintArea = inputs.footprint ?? 0;
  if (!footprintArea) {
    const l = inputs.length ?? 0;
    const w = inputs.width ?? 0;
    footprintArea = w > 0 ? l * w : l;
  }

  const pitchFactor = Math.sqrt(1 + Math.pow(inputs.rise / 12, 2));
  const roofArea = footprintArea * pitchFactor;
  const squares = roofArea / 100;

  const bundlesPerSq = constants.bundlesPerSquare && constants.bundlesPerSquare > 0 ? constants.bundlesPerSquare : 3;
  const wasteFactor = 1 + pctToFactor(inputs.waste ?? 0);
  const bundles = ceilWhole(squares * bundlesPerSq * wasteFactor);

  return {
    bundles,
    squares,
    roofArea,
    pitchFactor,
  };
}