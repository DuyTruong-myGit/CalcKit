/**
 * formula: seed-rate
 * Used by: grass-seed-calculator
 *
 * Inputs:
 *   length  – ft
 *   width   – ft
 *   rate    – lb per 1,000 sq ft (default 4)
 *
 * Constants:
 *   bagSize – lb (default 5)
 *
 * Outputs:
 *   area    – sq ft
 *   pounds  – total pounds of seed needed
 *   bags    – whole bags to purchase (rounded up)
 *
 * Source: docs/FORMULAS.md lines 38-40
 * area = L × W
 * pounds = (area / 1000) × rate
 * bags = ceil(pounds / bagSize)
 */

import { ceilWhole } from '../units.js';

export interface SeedRateInputs {
  length: number;
  width: number;
  rate: number; // lb per 1,000 sq ft
}

export interface SeedRateConstants {
  bagSize?: number; // lb per bag
}

export interface SeedRateOutputs {
  area: number;
  pounds: number;
  bags: number;
}

export function seedRate(
  inputs: SeedRateInputs,
  constants: SeedRateConstants,
): SeedRateOutputs {
  const area = inputs.length * inputs.width;
  const pounds = (area / 1000) * inputs.rate;
  const bagWeight = constants.bagSize && constants.bagSize > 0 ? constants.bagSize : 5;
  const bags = ceilWhole(pounds / bagWeight);

  return {
    area,
    pounds,
    bags,
  };
}