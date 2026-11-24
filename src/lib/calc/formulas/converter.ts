/**
 * formula: converter
 * Used by: cubic-yard-calculator
 *
 * Computes rectangular volume and converts between ft³, yd³, m³, and liters.
 *
 * Inputs:
 *   length – ft
 *   width  – ft
 *   depth  – in (inches depth, converted by dividing by 12)
 *
 * Outputs:
 *   cubicYards  – yd³ (primary)
 *   cubicFeet   – ft³
 *   cubicMeters – m³
 *   liters      – L
 *
 * Source: docs/FORMULAS.md lines 63-64
 */

import { ft3ToYd3 } from '../units.js';

export interface ConverterInputs {
  length: number;
  width: number;
  depth: number;
}

export interface ConverterOutputs {
  cubicYards: number;
  cubicFeet: number;
  cubicMeters: number;
  liters: number;
}

export function converter(
  inputs: ConverterInputs,
): ConverterOutputs {
  const depthFt = inputs.depth / 12;
  const cubicFeet = inputs.length * inputs.width * depthFt;
  const cubicYards = ft3ToYd3(cubicFeet);

  // 1 ft³ = 0.028316846592 m³
  const cubicMeters = cubicFeet * 0.0283168466;
  const liters = cubicMeters * 1000;

  return {
    cubicYards,
    cubicFeet,
    cubicMeters,
    liters,
  };
}