/**
 * formula: volume-weight
 * Used by: gravel, topsoil, sand
 *
 * Inputs:
 *   length  – ft
 *   width   – ft
 *   depth   – in
 *   waste   – pct (0–50, default 0 or 10)
 *
 * Constants:
 *   density – tons per cubic yard (default 1.4 for gravel/sand, 1.1 for topsoil)
 *
 * Outputs:
 *   cubicFeet   – ft³
 *   cubicYards  – yd³
 *   tons        – tons
 *
 * Source: docs/FORMULAS.md
 * cuFt = L × W × D / 12
 * cuYd = cuFt / 27
 * tons = cuYd × (1 + waste / 100) × density
 */

import { ft3ToYd3, pctToFactor } from '../units.js';

export interface VolumeWeightInputs {
  length: number;
  width: number;
  depth: number;  // inches
  waste?: number; // percent
}

export interface VolumeWeightConstants {
  density: number; // tons per cubic yard
}

export interface VolumeWeightOutputs {
  cubicFeet: number;
  cubicYards: number;
  tons: number;
}

export function volumeWeight(
  inputs: VolumeWeightInputs,
  constants: VolumeWeightConstants,
): VolumeWeightOutputs {
  const cubicFeet = inputs.length * inputs.width * (inputs.depth / 12);
  const cubicYards = ft3ToYd3(cubicFeet);
  const wasteFactor = 1 + pctToFactor(inputs.waste ?? 0);
  const tons = cubicYards * wasteFactor * constants.density;

  return { cubicFeet, cubicYards, tons };
}
