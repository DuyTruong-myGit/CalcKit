import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { volumeBags } from '../src/lib/calc/formulas/volume-bags.js';
import { volumeWeight } from '../src/lib/calc/formulas/volume-weight.js';
import { concreteSlab } from '../src/lib/calc/formulas/concrete-slab.js';
import { calculate, runTestCase } from '../src/lib/calc/engine.js';
import type { CalculatorDef } from '../src/lib/schema/types.js';

describe('Pure Formula Functions — Hand-Calculated Cases (docs/FORMULAS.md)', () => {
  it('mulch (volume-bags): L 10, W 10, D 3, waste 0, bag 2 ft³ -> cuFt 25, cuYd 0.9259, bags 13', () => {
    const res = volumeBags(
      { length: 10, width: 10, depth: 3, waste: 0 },
      { bagSize: 2 },
    );
    expect(res.cubicFeet).toBeCloseTo(25, 2);
    expect(res.cubicYards).toBeCloseTo(0.9259, 3);
    expect(res.bags).toBe(13);
  });

  it('gravel (volume-weight): L 20, W 10, D 4, density 1.4, waste 0 -> cuFt 66.667, cuYd 2.4691, tons 3.4568', () => {
    const res = volumeWeight(
      { length: 20, width: 10, depth: 4, waste: 0 },
      { density: 1.4 },
    );
    expect(res.cubicFeet).toBeCloseTo(66.667, 2);
    expect(res.cubicYards).toBeCloseTo(2.4691, 3);
    expect(res.tons).toBeCloseTo(3.4568, 3);
  });

  it('concrete slab (concrete-slab): L 10, W 10, D 4, waste 0, yield 0.6 -> cuFt 33.333, cuYd 1.2346, bags 56', () => {
    const res = concreteSlab(
      { length: 10, width: 10, depth: 4, waste: 0 },
      { yield: 0.6 },
    );
    expect(res.cubicFeet).toBeCloseTo(33.333, 2);
    expect(res.cubicYards).toBeCloseTo(1.2346, 3);
    expect(res.bags).toBe(56);
  });
});

describe('Calculation Engine — Validation and Robustness', () => {
  const sampleDef: Pick<CalculatorDef, 'formulaId' | 'inputs' | 'constants' | 'outputs'> = {
    formulaId: 'volume-bags',
    inputs: [
      { id: 'length', label: 'Length', unit: 'ft', type: 'number', min: 0 },
      { id: 'width', label: 'Width', unit: 'ft', type: 'number', min: 0 },
      { id: 'depth', label: 'Depth', unit: 'in', type: 'number', min: 0 },
      { id: 'waste', label: 'Extra for waste', unit: 'pct', type: 'number', min: 0, max: 50 },
    ],
    constants: [
      { id: 'bagSize', label: 'Bag size', default: 2, note: 'Standard bag size' },
    ],
    outputs: [
      { id: 'cubicYards', label: 'Cubic yards', unit: 'yd³', decimals: 2, primary: true },
      { id: 'cubicFeet', label: 'Cubic feet', unit: 'ft³', decimals: 1 },
      { id: 'bags', label: 'Bags', unit: 'bags', decimals: 0, roundUp: true },
    ],
  };

  it('rejects negative numbers with a clear error message', () => {
    const res = calculate(sampleDef, { length: -5, width: 10, depth: 3, waste: 0 });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.length).toBeDefined();
      expect(res.errors.length).toMatch(/0 or greater/i);
    }
  });

  it('rejects empty input with a clear error message', () => {
    const res = calculate(sampleDef, { length: '', width: 10, depth: 3, waste: 0 });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.length).toBeDefined();
      expect(res.errors.length).toMatch(/required/i);
    }
  });

  it('rejects non-numeric input with a clear error message', () => {
    const res = calculate(sampleDef, { length: 'ten feet', width: 10, depth: 3, waste: 0 });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.length).toBeDefined();
      expect(res.errors.length).toMatch(/must be a number/i);
    }
  });

  it('never outputs NaN or Infinity in values or formatted strings', () => {
    const res = calculate(sampleDef, { length: 'invalid', width: 10, depth: 3, waste: 0 });
    expect(res.ok).toBe(false);

    // Valid inputs return finite numbers
    const validRes = calculate(sampleDef, { length: 10, width: 10, depth: 3, waste: 0 });
    expect(validRes.ok).toBe(true);
    if (validRes.ok) {
      for (const [k, val] of Object.entries(validRes.values)) {
        expect(Number.isFinite(val)).toBe(true);
        expect(Number.isNaN(val)).toBe(false);
        expect(validRes.formatted[k]).not.toContain('NaN');
        expect(validRes.formatted[k]).not.toContain('Infinity');
      }
    }
  });

  it('correctly rounds up whole units when roundUp: true', () => {
    const res = calculate(sampleDef, { length: 10, width: 10, depth: 3, waste: 0 });
    expect(res.ok).toBe(true);
    if (res.ok) {
      // 25 / 2 = 12.5 -> ceil = 13
      expect(res.values.bags).toBe(13);
      expect(res.formatted.bags).toBe('13');
    }
  });
});

describe('Data-Driven Test Runner — Fixtures and Calculator Definitions', () => {
  const dirs = [
    join(import.meta.dirname, 'fixtures', 'valid'),
    join(import.meta.dirname, '..', 'src', 'data', 'calculators'),
  ];

  for (const dir of dirs) {
    let files: string[] = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    } catch {
      continue;
    }

    for (const file of files) {
      const content = JSON.parse(readFileSync(join(dir, file), 'utf-8')) as CalculatorDef;

      describe(`Data-driven suite: ${content.title} (${file})`, () => {
        for (const tc of content.testCases) {
          it(`testCase: "${tc.name}"`, () => {
            const testResult = runTestCase(content, tc);
            if (!testResult.pass) {
              console.error(`Failures in ${file} - "${tc.name}":`, testResult.failures);
            }
            expect(testResult.pass).toBe(true);
            expect(testResult.failures).toEqual([]);
          });
        }
      });
    }
  }
});
