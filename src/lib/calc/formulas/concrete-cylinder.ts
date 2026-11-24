/**
 * formula: concrete-cylinder
 * Used by: concrete-post-hole-calculator
 *
 * Inputs:
 *   diameter – in (hole diameter)
 *   depth    – in (hole depth)
 *   holes    – count (number of holes)
 *   waste    – pct (default 10)
 *
 * Constants:
 *   yield80  – ft³ per 80-lb bag (default 0.6)
 *   yield60  – ft³ per 60-lb bag (default 0.45)
 *
 * Outputs:
 *   cubicFeet  – total volume in ft³
 *   cubicYards – total volume in yd³
 *   bags80     – whole 80-lb bags (rounded up)
 *   bags60     – whole 60-lb bags (rounded up)
 *   bags       – alias for bags80 (primary)
 *
 * Source: docs/FORMULAS.md lines 26-28 & 75
 * cuFt per hole = π × (d/2)² × h / 1728
 * total = cuFt per hole × n
 * bags = ceil(total × (1 + waste/100) / yield)
 */

import { ft3ToYd3, pctToFactor, ceilWhole } from '../units.js';

export interface ConcreteCylinderInputs {
  diameter: number; // inches
  depth: number;    // inches
  holes?: number;   // default 1
  waste?: number;   // percent
}

export interface ConcreteCylinderConstants {
  yield80?: number; // default 0.6 ft³
  yield60?: number; // default 0.45 ft³
}

export interface ConcreteCylinderOutputs {
  cubicFeet: number;
  cubicYards: number;
  bags80: number;
  bags60: number;
  bags: number;
}

export function concreteCylinder(
  inputs: ConcreteCylinderInputs,
  constants: ConcreteCylinderConstants,
): ConcreteCylinderOutputs {
  const radius = inputs.diameter / 2;
  const areaSqIn = Math.PI * radius * radius;
  const volumePerHoleCuIn = areaSqIn * inputs.depth;
  const cuFtPerHole = volumePerHoleCuIn / 1728;
  const n = inputs.holes && inputs.holes > 0 ? inputs.holes : 1;
  const cubicFeet = cuFtPerHole * n;
  const cubicYards = ft3ToYd3(cubicFeet);

  const wasteFactor = 1 + pctToFactor(inputs.waste ?? 0);
  const totalVolumeWithWaste = cubicFeet * wasteFactor;

  const y80 = constants.yield80 && constants.yield80 > 0 ? constants.yield80 : 0.6;
  const y60 = constants.yield60 && constants.yield60 > 0 ? constants.yield60 : 0.45;

  const bags80 = ceilWhole(totalVolumeWithWaste / y80);
  const bags60 = ceilWhole(totalVolumeWithWaste / y60);

  return {
    cubicFeet,
    cubicYards,
    bags80,
    bags60,
    bags: bags80,
  };
}