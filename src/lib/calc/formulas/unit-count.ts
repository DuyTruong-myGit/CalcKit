/**
 * formula: unit-count
 * Used by: paver, retaining wall block, flooring, tile, drywall, sod
 *
 * Inputs:
 *   length      – ft
 *   width       – ft (or wall height)
 *   waste       – pct (default 10)
 *
 * Constants:
 *   unitLength  – in (e.g. 8 for 4x8 paver, 16 for wall block)
 *   unitWidth   – in (e.g. 4 for 4x8 paver, 6 for wall block height)
 *   areaPerUnit – sq ft (optional direct override, e.g. 10 for sod roll)
 *   areaPerBox  – sq ft (optional, for flooring boxes)
 *   boxSize     – count of units per box (optional, for tile)
 *
 * Outputs:
 *   area        – sq ft
 *   units       – count (rounded up)
 *   pavers      – alias for units
 *   blocks      – alias for units
 *   capBlocks   – linear count along top of wall (rounded up)
 *   rolls       – alias for units (sod)
 *   tiles       – alias for units (tile)
 *   boxes       – box count (flooring or tile)
 *   sheets      – alias for units (drywall)
 */

import { pctToFactor, ceilWhole } from '../units.js';

export interface UnitCountInputs {
  length: number;
  width: number;
  waste?: number;
}

export interface UnitCountConstants {
  unitLength?: number;  // inches
  unitWidth?: number;   // inches
  areaPerUnit?: number; // sq ft (if supplied directly, e.g. sod roll)
  areaPerBox?: number;  // sq ft per box (for flooring)
  boxSize?: number;     // units per box (for tile)
}

export interface UnitCountOutputs {
  area: number;
  units: number;
  pavers: number;
  blocks: number;
  capBlocks: number;
  rolls: number;
  tiles: number;
  boxes: number;
  sheets: number;
}

export function unitCount(
  inputs: UnitCountInputs,
  constants: UnitCountConstants,
): UnitCountOutputs {
  const area = inputs.length * inputs.width;
  const wasteFactor = 1 + pctToFactor(inputs.waste ?? 0);

  // Compute unit area in square feet
  let unitArea = constants.areaPerUnit;
  if (!unitArea && constants.unitLength && constants.unitWidth) {
    unitArea = (constants.unitLength * constants.unitWidth) / 144;
  }
  if (!unitArea || unitArea <= 0) {
    unitArea = 1; // Fallback to 1 sq ft
  }

  const units = ceilWhole((area * wasteFactor) / unitArea);

  // Cap blocks for retaining walls: linear count along wall length
  let capBlocks = 0;
  if (constants.unitLength && constants.unitLength > 0) {
    const blockLengthFt = constants.unitLength / 12;
    capBlocks = ceilWhole(inputs.length / blockLengthFt);
  }

  // Boxes calculation:
  // If areaPerBox is provided directly (e.g. 20 sq ft per box of flooring)
  let boxes = 0;
  if (constants.areaPerBox && constants.areaPerBox > 0) {
    boxes = ceilWhole((area * wasteFactor) / constants.areaPerBox);
  } else if (constants.boxSize && constants.boxSize > 0) {
    // If boxSize is units per box (e.g. 10 tiles per box)
    boxes = ceilWhole(units / constants.boxSize);
  } else {
    boxes = units;
  }

  return {
    area,
    units,
    pavers: units,
    blocks: units,
    capBlocks,
    rolls: units,
    tiles: units,
    boxes,
    sheets: units,
  };
}