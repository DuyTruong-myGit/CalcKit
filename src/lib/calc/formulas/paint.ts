/**
 * formula: paint
 * Used by: paint-calculator
 *
 * Inputs:
 *   length     – ft (room length or perimeter if width=0)
 *   width      – ft (room width, default 0 if perimeter given)
 *   height     – ft (wall height, default 8)
 *   doors      – count (default 1)
 *   windows    – count (default 2)
 *   coats      – count (default 2)
 *   perimeter  – ft (optional direct override)
 *
 * Constants:
 *   coverage   – sq ft per gallon (default 350)
 *   doorArea   – sq ft per door (default 20)
 *   windowArea – sq ft per window (default 15)
 *
 * Outputs:
 *   wallArea   – net wall area in sq ft
 *   gallons    – exact gallons needed
 *   cans       – whole gallon cans to purchase (rounded up)
 *
 * Source: docs/FORMULAS.md lines 43-44 & 76
 */

import { ceilWhole } from '../units.js';

export interface PaintInputs {
  length?: number;
  width?: number;
  height: number;
  doors?: number;
  windows?: number;
  coats?: number;
  perimeter?: number;
}

export interface PaintConstants {
  coverage?: number;   // sq ft per gallon (default 350)
  doorArea?: number;   // sq ft per door (default 20)
  windowArea?: number; // sq ft per window (default 15)
}

export interface PaintOutputs {
  wallArea: number;
  gallons: number;
  cans: number;
}

export function paint(
  inputs: PaintInputs,
  constants: PaintConstants,
): PaintOutputs {
  // Determine room perimeter
  let perimeter = inputs.perimeter ?? 0;
  if (!perimeter) {
    const l = inputs.length ?? 0;
    const w = inputs.width ?? 0;
    if (w > 0) {
      perimeter = 2 * (l + w);
    } else {
      perimeter = l;
    }
  }

  const height = inputs.height ?? 8;
  const grossArea = perimeter * height;

  const doorArea = constants.doorArea ?? 20;
  const windowArea = constants.windowArea ?? 15;
  const doors = inputs.doors ?? 0;
  const windows = inputs.windows ?? 0;

  const deductions = doors * doorArea + windows * windowArea;
  const wallArea = Math.max(0, grossArea - deductions);

  const coverage = constants.coverage && constants.coverage > 0 ? constants.coverage : 350;
  const coats = inputs.coats && inputs.coats > 0 ? inputs.coats : 2;

  const gallons = (wallArea * coats) / coverage;
  const cans = ceilWhole(gallons);

  return {
    wallArea,
    gallons,
    cans,
  };
}