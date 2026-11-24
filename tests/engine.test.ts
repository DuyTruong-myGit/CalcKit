import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { volumeBags } from '../src/lib/calc/formulas/volume-bags.js';
import { volumeWeight } from '../src/lib/calc/formulas/volume-weight.js';
import { concreteSlab } from '../src/lib/calc/formulas/concrete-slab.js';
import { unitCount } from '../src/lib/calc/formulas/unit-count.js';
import { seedRate } from '../src/lib/calc/formulas/seed-rate.js';
import { paint } from '../src/lib/calc/formulas/paint.js';
import { concreteCylinder } from '../src/lib/calc/formulas/concrete-cylinder.js';
import { fence } from '../src/lib/calc/formulas/fence.js';
import { deckBoards } from '../src/lib/calc/formulas/deck-boards.js';
import { roofing } from '../src/lib/calc/formulas/roofing.js';
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

  it('paver (unit-count): L 10, W 10, waste 10%, 4x8 in pavers -> area 100, pavers 495', () => {
    const res = unitCount(
      { length: 10, width: 10, waste: 10 },
      { unitLength: 8, unitWidth: 4 },
    );
    expect(res.area).toBe(100);
    expect(res.pavers).toBe(495);
    expect(res.units).toBe(495);
  });

  it('retaining wall (unit-count): L 30, H 2.5, waste 10%, 16x6 in blocks -> area 75, blocks 124, capBlocks 23', () => {
    const res = unitCount(
      { length: 30, width: 2.5, waste: 10 },
      { unitLength: 16, unitWidth: 6 },
    );
    expect(res.area).toBe(75);
    expect(res.blocks).toBe(124);
    expect(res.capBlocks).toBe(23);
  });

  it('sod (unit-count): L 50, W 20, waste 10%, areaPerUnit 10 sq ft -> area 1000, rolls 110', () => {
    const res = unitCount(
      { length: 50, width: 20, waste: 10 },
      { areaPerUnit: 10 },
    );
    expect(res.area).toBe(1000);
    expect(res.rolls).toBe(110);
  });

  it('grass seed (seed-rate): L 50, W 40, rate 4 lb/1000 sq ft -> area 2000, pounds 8, bags 2', () => {
    const res = seedRate(
      { length: 50, width: 40, rate: 4 },
      { bagSize: 5 },
    );
    expect(res.area).toBe(2000);
    expect(res.pounds).toBe(8);
    expect(res.bags).toBe(2);
  });

  it('paint (paint): perimeter 44, height 8, 1 door, 2 windows, 2 coats, coverage 350 -> wallArea 302, gallons 1.7257, cans 2', () => {
    const res = paint(
      { perimeter: 44, height: 8, doors: 1, windows: 2, coats: 2 },
      { coverage: 350, doorArea: 20, windowArea: 15 },
    );
    expect(res.wallArea).toBe(302);
    expect(res.gallons).toBeCloseTo(1.7257, 4);
    expect(res.cans).toBe(2);
  });

  it('flooring (unit-count): L 20, W 15, waste 10%, areaPerBox 20 sq ft -> area 300, boxes 17', () => {
    const res = unitCount(
      { length: 20, width: 15, waste: 10 },
      { areaPerBox: 20 },
    );
    expect(res.area).toBe(300);
    expect(res.boxes).toBe(17);
  });

  it('tile (unit-count): L 10, W 10, waste 10%, 12x12 in tiles, 10 tiles/box -> area 100, tiles 110, boxes 11', () => {
    const res = unitCount(
      { length: 10, width: 10, waste: 10 },
      { unitLength: 12, unitWidth: 12, boxSize: 10 },
    );
    expect(res.area).toBe(100);
    expect(res.tiles).toBe(110);
    expect(res.boxes).toBe(11);
  });

  it('drywall (unit-count): area 400, sheet 32 sq ft, waste 10% -> sheets 14', () => {
    const res = unitCount(
      { length: 400, width: 1, waste: 10 },
      { areaPerUnit: 32 },
    );
    expect(res.area).toBe(400);
    expect(res.sheets).toBe(14);
    expect(res.units).toBe(14);
  });

  it('concrete post hole (concrete-cylinder): d 12, h 36, n 1, waste 0 -> cuFt 2.3562', () => {
    const res = concreteCylinder(
      { diameter: 12, depth: 36, holes: 1, waste: 0 },
      { yield80: 0.6, yield60: 0.45 },
    );
    expect(res.cubicFeet).toBeCloseTo(2.3562, 3);
    expect(res.bags80).toBe(4);
    expect(res.bags60).toBe(6);
  });

  it('fence (fence): length 100, spacing 8, extra 0 -> posts 14, panels 13', () => {
    const res = fence(
      { length: 100, gates: 0, corners: 0 },
      { postSpacing: 8, panelWidth: 8, railsPerSection: 3 },
    );
    expect(res.posts).toBe(14);
    expect(res.panels).toBe(13);
    expect(res.rails).toBe(39);
  });

  it('deck boards (deck-boards): L 16, W 12, waste 10%, boardLength 16, width 5.5 in, gap 0.25 in -> rows 26, boards 29', () => {
    const res = deckBoards(
      { length: 16, width: 12, waste: 10 },
      { boardWidth: 5.5, gap: 0.25, boardLength: 16 },
    );
    expect(res.area).toBe(192);
    expect(res.rows).toBe(26);
    expect(res.totalLinearFeet).toBe(416);
    expect(res.boards).toBe(29);
  });

  it('roofing (roofing): footprint 1000, rise 6, bundlesPerSquare 3, waste 0 -> pitchFactor 1.1180, roofArea 1118.03, squares 11.18, bundles 34', () => {
    const res = roofing(
      { footprint: 1000, rise: 6, waste: 0 },
      { bundlesPerSquare: 3 },
    );
    expect(res.pitchFactor).toBeCloseTo(1.1180, 4);
    expect(res.roofArea).toBeCloseTo(1118.03, 2);
    expect(res.squares).toBeCloseTo(11.18, 2);
    expect(res.bundles).toBe(34);
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
