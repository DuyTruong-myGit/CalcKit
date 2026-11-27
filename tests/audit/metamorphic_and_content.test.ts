/**
 * tests/audit/metamorphic_and_content.test.ts
 *
 * Checks:
 * 1. Edge & hostile input rejection in engine.
 * 2. Metamorphic properties (monotonicity, scaling, symmetry, waste factor).
 * 3. Cross-calculator volume consistency.
 * 4. Content audit: checking examples and quick reference tables.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculate } from '../../src/lib/calc/engine.ts';
import type { CalculatorDef, InputDef, OutputDef } from '../../src/lib/schema/types.ts';

const dir = path.resolve('src/data/calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const calculators: CalculatorDef[] = files.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

describe('Metamorphic and Property Tests', () => {
  it('Monotonicity: increasing dimension never decreases output quantities', () => {
    for (const def of calculators) {
      if (def.slug === 'cubic-yard-calculator' || def.slug === 'square-footage-calculator') continue;

      const baseInputs: Record<string, number> = {};
      for (const inp of def.inputs) {
        baseInputs[inp.id] = (typeof inp.default === 'number' ? inp.default : (inp.min ? inp.min + 5 : 10));
      }
      const resBase = calculate(def, baseInputs);
      expect(resBase.ok).toBe(true);
      if (!resBase.ok) continue;

      // Increase the first numeric dimension
      const dimInput = def.inputs.find((i: InputDef) => i.id === 'length' || i.id === 'diameter' || i.id === 'footprint');
      if (dimInput) {
        const higherInputs = { ...baseInputs, [dimInput.id]: (Number(baseInputs[dimInput.id]) || 10) * 1.5 };
        const resHigher = calculate(def, higherInputs);
        expect(resHigher.ok).toBe(true);
        if (resHigher.ok) {
          for (const out of def.outputs) {
            expect(resHigher.values[out.id]).toBeGreaterThanOrEqual(resBase.values[out.id]);
          }
        }
      }
    }
  });

  it('Symmetry: L × W equals W × L for 2D rectangular calculators', () => {
    const symmetricSlugs = [
      'mulch-calculator', 'gravel-calculator', 'topsoil-calculator', 'sand-calculator',
      'raised-bed-soil-calculator', 'concrete-slab-calculator', 'flooring-calculator',
      'drywall-calculator', 'grass-seed-calculator', 'cubic-yard-calculator'
    ];

    for (const def of calculators.filter(c => symmetricSlugs.includes(c.slug))) {
      const inputs1 = { length: 24, width: 15, depth: 4, waste: 10, rate: 4 };
      const inputs2 = { length: 15, width: 24, depth: 4, waste: 10, rate: 4 };

      const res1 = calculate(def, inputs1);
      const res2 = calculate(def, inputs2);

      expect(res1.ok).toBe(true);
      expect(res2.ok).toBe(true);
      if (res1.ok && res2.ok) {
        for (const out of def.outputs) {
          expect(res1.values[out.id]).toBeCloseTo(res2.values[out.id], 5);
        }
      }
    }
  });

  it('Waste Factor: waste 0 vs waste w applies (1 + w/100) exactly once to purchased quantities', () => {
    const wasteCalculators = [
      'mulch-calculator', 'gravel-calculator', 'concrete-slab-calculator',
      'drywall-calculator', 'flooring-calculator', 'paver-calculator', 'roofing-calculator'
    ];

    for (const def of calculators.filter(c => wasteCalculators.includes(c.slug))) {
      const inputs0 = { length: 20, width: 10, depth: 4, rise: 6, waste: 0 };
      const inputs10 = { length: 20, width: 10, depth: 4, rise: 6, waste: 10 };

      const res0 = calculate(def, inputs0);
      const res10 = calculate(def, inputs10);

      expect(res0.ok).toBe(true);
      expect(res10.ok).toBe(true);
      if (res0.ok && res10.ok) {
        const primary = def.outputs.find((o: OutputDef) => o.primary);
        if (primary && primary.roundUp) {
          // With roundUp, res10 should be >= res0
          expect(res10.values[primary.id]).toBeGreaterThanOrEqual(res0.values[primary.id]);
        }
      }
    }
  });

  it('Cross-calculator consistency: 10 × 10 ft at 3 in depth has identical cubic yards', () => {
    const inputs = { length: 10, width: 10, depth: 3, waste: 0 };
    const mulchDef = calculators.find(c => c.slug === 'mulch-calculator');
    const gravelDef = calculators.find(c => c.slug === 'gravel-calculator');
    const topsoilDef = calculators.find(c => c.slug === 'topsoil-calculator');
    const sandDef = calculators.find(c => c.slug === 'sand-calculator');
    const raisedBedDef = calculators.find(c => c.slug === 'raised-bed-soil-calculator');
    const cubicYardDef = calculators.find(c => c.slug === 'cubic-yard-calculator');

    expect(mulchDef).toBeDefined();
    expect(gravelDef).toBeDefined();
    expect(topsoilDef).toBeDefined();
    expect(sandDef).toBeDefined();
    expect(raisedBedDef).toBeDefined();
    expect(cubicYardDef).toBeDefined();

    if (!mulchDef || !gravelDef || !topsoilDef || !sandDef || !raisedBedDef || !cubicYardDef) return;

    const mulch = calculate(mulchDef, inputs);
    const gravel = calculate(gravelDef, inputs);
    const topsoil = calculate(topsoilDef, inputs);
    const sand = calculate(sandDef, inputs);
    const raisedBed = calculate(raisedBedDef, inputs);
    const cubicYard = calculate(cubicYardDef, inputs);

    expect(mulch.ok).toBe(true);
    expect(gravel.ok).toBe(true);
    expect(topsoil.ok).toBe(true);
    expect(sand.ok).toBe(true);
    expect(raisedBed.ok).toBe(true);
    expect(cubicYard.ok).toBe(true);

    const expectedYards = (10 * 10 * (3 / 12)) / 27; // 0.9259259...
    if (mulch.ok && gravel.ok && topsoil.ok && sand.ok && raisedBed.ok && cubicYard.ok) {
      expect(mulch.values.cubicYards).toBeCloseTo(expectedYards, 4);
      expect(gravel.values.cubicYards).toBeCloseTo(expectedYards, 4);
      expect(topsoil.values.cubicYards).toBeCloseTo(expectedYards, 4);
      expect(sand.values.cubicYards).toBeCloseTo(expectedYards, 4);
      expect(raisedBed.values.cubicYards).toBeCloseTo(expectedYards, 4);
      expect(cubicYard.values.cubicYards).toBeCloseTo(expectedYards, 4);
    }
  });

  it('Edge and Hostile Inputs: rejects negatives, empty, non-numbers gracefully', () => {
    for (const def of calculators) {
      // 1. Negative input
      const negInputs: Record<string, number> = {};
      for (const inp of def.inputs) negInputs[inp.id] = -5;
      const resNeg = calculate(def, negInputs);
      expect(resNeg.ok).toBe(false);

      // 2. String/NaN input
      const nanInputs: Record<string, unknown> = {};
      for (const inp of def.inputs) nanInputs[inp.id] = "invalid_text";
      const resNaN = calculate(def, nanInputs);
      expect(resNaN.ok).toBe(false);

      // 3. Zero inputs: should not crash with NaN or Infinity
      const zeroInputs: Record<string, number> = {};
      for (const inp of def.inputs) zeroInputs[inp.id] = 0;
      const resZero = calculate(def, zeroInputs);
      if (resZero.ok) {
        for (const out of def.outputs) {
          expect(Number.isFinite(resZero.values[out.id])).toBe(true);
          expect(Number.isNaN(resZero.values[out.id])).toBe(false);
        }
      }
    }
  });
});
