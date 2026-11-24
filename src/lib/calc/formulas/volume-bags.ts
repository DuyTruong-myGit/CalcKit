/**
 * formula: volume-bags
 * Used by: mulch, raised-bed soil
 *
 * Inputs:
 *   length  – ft
 *   width   – ft
 *   depth   – in
 *   waste   – pct (0–50)
 *
 * Constants:
 *   bagSize – ft³ (default 2)
 *
 * Outputs:
 *   cubicFeet   – ft³
 *   cubicYards  – yd³
 *   bags        – whole bags (rounded up)
 *
 * Source: docs/FORMULAS.md
 * cuFt = L × W × D/12
 * cuYd = cuFt / 27
 * bags = ceil(cuFt × (1 + waste/100) / bagSize)
 */

import { ft3ToYd3, pctToFactor, ceilWhole } from '../units.js';

export interface VolumeBagsInputs {
  length: number;
  width: number;
  depth: number;  // inches
  waste: number;  // percent
}

export interface VolumeBagsConstants {
  bagSize: number; // cubic feet
}

export interface VolumeBagsOutputs {
  cubicFeet: number;
  cubicYards: number;
  bags: number;
}

export function volumeBags(
  inputs: VolumeBagsInputs,
  constants: VolumeBagsConstants,
): VolumeBagsOutputs {
  const cubicFeet = inputs.length * inputs.width * (inputs.depth / 12);
  const cubicYards = ft3ToYd3(cubicFeet);
  const bags = ceilWhole(cubicFeet * (1 + pctToFactor(inputs.waste)) / constants.bagSize);

  return { cubicFeet, cubicYards, bags };
}
