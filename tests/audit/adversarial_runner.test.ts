/**
 * tests/audit/adversarial_runner.test.ts
 *
 * Session 2: Adversarial Verifier Suite
 * Tests 10 adversarial inputs per calculator (200 test cases total):
 * - 3 hostile/boundary edge cases per calculator
 * - 2 metric cases per calculator (converted to US base)
 * - 5 realistic tape-measure projects per calculator
 *
 * Verifies exact floating math, ceiling rounding, and error guards.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculate } from '../../src/lib/calc/engine.ts';
import type { CalculatorDef } from '../../src/lib/schema/types.ts';

const dir = path.resolve('src/data/calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const calculators: Record<string, CalculatorDef> = Object.fromEntries(
  files.map(f => {
    const def = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    return [def.slug, def];
  })
);

describe('Session 2: Adversarial Verification (200 Test Cases)', () => {

  // 1. Mulch
  it('mulch-calculator: 10 adversarial cases', () => {
    const def = calculators['mulch-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 10, depth: 3, waste: 10 });
    expect(e1.ok && e1.values.bags).toBe(0);
    // Edge 2: Zero depth
    const e2 = calculate(def, { length: 20, width: 10, depth: 0, waste: 10 });
    expect(e2.ok && e2.values.bags).toBe(0);
    // Edge 3: Huge commercial park
    const e3 = calculate(def, { length: 500, width: 200, depth: 3, waste: 10 }, { bagSize: 2 });
    expect(e3.ok && e3.values.cubicFeet).toBe(25000);
    expect(e3.ok && e3.values.bags).toBe(13750);
    // Metric 1: 5m x 3m x 5cm (converted to US: 16.4042 ft x 9.8425 ft x 1.9685 in, 10% waste, 2 ft3 bags)
    const m1 = calculate(def, { length: 16.4042, width: 9.8425, depth: 1.9685, waste: 10 }, { bagSize: 2 });
    expect(m1.ok && m1.values.bags).toBe(15);
    // Metric 2: 10m x 10m x 7.5cm (32.8084 ft x 32.8084 ft x 2.9528 in, 10% waste, 2 ft3 bags)
    const m2 = calculate(def, { length: 32.8084, width: 32.8084, depth: 2.9528, waste: 10 }, { bagSize: 2 });
    expect(m2.ok && m2.values.bags).toBe(146);
    // Realistic 1: 3.5 ft x 3.5 ft at 2.5 in, 0% waste
    const r1 = calculate(def, { length: 3.5, width: 3.5, depth: 2.5, waste: 0 }, { bagSize: 2 });
    expect(r1.ok && r1.values.bags).toBe(2);
    // Realistic 2: 40 ft x 4 ft at 3 in, 10% waste
    const r2 = calculate(def, { length: 40, width: 4, depth: 3, waste: 10 }, { bagSize: 2 });
    expect(r2.ok && r2.values.bags).toBe(22);
    // Realistic 3: 15 ft x 8 ft at 4 in, 10% waste, 3 ft3 bags
    const r3 = calculate(def, { length: 15, width: 8, depth: 4, waste: 10 }, { bagSize: 3 });
    expect(r3.ok && r3.values.bags).toBe(15);
    // Realistic 4: 60 ft x 6 ft at 3 in, 15% waste
    const r4 = calculate(def, { length: 60, width: 6, depth: 3, waste: 15 }, { bagSize: 2 });
    expect(r4.ok && r4.values.bags).toBe(52);
    // Realistic 5: 8 ft x 3 ft at 1.5 in, 5% waste
    const r5 = calculate(def, { length: 8, width: 3, depth: 1.5, waste: 5 }, { bagSize: 2 });
    expect(r5.ok && r5.values.bags).toBe(2);
  });

  // 2. Gravel
  it('gravel-calculator: 10 adversarial cases', () => {
    const def = calculators['gravel-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 10, depth: 4, waste: 10 });
    expect(e1.ok && e1.values.tons).toBe(0);
    // Edge 2: Deep French drain (1 ft wide, 100 ft long, 24 in deep)
    const e2 = calculate(def, { length: 100, width: 1, depth: 24, waste: 0 }, { density: 1.4 });
    expect(e2.ok && e2.values.cubicFeet).toBe(200);
    expect(e2.ok && Math.round(e2.values.tons * 100) / 100).toBe(10.37);
    // Edge 3: Subgrade 0 waste
    const e3 = calculate(def, { length: 30, width: 12, depth: 4, waste: 0 }, { density: 1.4 });
    expect(e3.ok && Math.round(e3.values.tons * 100) / 100).toBe(6.22);
    // Metric 1: 10m x 3m x 10cm (32.8084 ft x 9.8425 ft x 3.937 in, 10% waste)
    const m1 = calculate(def, { length: 32.8084, width: 9.8425, depth: 3.937, waste: 10 }, { density: 1.4 });
    expect(m1.ok && Math.round(m1.values.tons * 100) / 100).toBe(6.04);
    // Metric 2: 5m x 1m x 5cm path (16.4042 ft x 3.2808 ft x 1.9685 in, 5% waste)
    const m2 = calculate(def, { length: 16.4042, width: 3.2808, depth: 1.9685, waste: 5 }, { density: 1.3 });
    expect(m2.ok && Math.round(m2.values.tons * 100) / 100).toBe(0.45);
    // Realistic 1: 50 ft driveway x 10 ft at 4 in, 10% waste
    const r1 = calculate(def, { length: 50, width: 10, depth: 4, waste: 10 }, { density: 1.4 });
    expect(r1.ok && Math.round(r1.values.tons * 100) / 100).toBe(9.51);
    // Realistic 2: Walkway 30 ft x 3 ft at 2 in, 10% waste
    const r2 = calculate(def, { length: 30, width: 3, depth: 2, waste: 10 }, { density: 1.35 });
    expect(r2.ok && Math.round(r2.values.tons * 100) / 100).toBe(0.83);
    // Realistic 3: Shed pad base 12 ft x 10 ft at 4 in, 10% waste
    const r3 = calculate(def, { length: 12, width: 10, depth: 4, waste: 10 }, { density: 1.4 });
    expect(r3.ok && Math.round(r3.values.tons * 100) / 100).toBe(2.28);
    // Realistic 4: Patio sub-base 20 ft x 15 ft at 6 in, 15% waste
    const r4 = calculate(def, { length: 20, width: 15, depth: 6, waste: 15 }, { density: 1.4 });
    expect(r4.ok && Math.round(r4.values.tons * 100) / 100).toBe(8.94);
    // Realistic 5: Heavy gravel driveway 100 ft x 12 ft at 6 in, 10% waste
    const r5 = calculate(def, { length: 100, width: 12, depth: 6, waste: 10 }, { density: 1.5 });
    expect(r5.ok && Math.round(r5.values.tons * 100) / 100).toBe(36.67);
  });

  // 3. Concrete Slab
  it('concrete-slab-calculator: 10 adversarial cases', () => {
    const def = calculators['concrete-slab-calculator'];
    // Edge 1: Zero width
    const e1 = calculate(def, { length: 10, width: 0, depth: 4, waste: 10 });
    expect(e1.ok && e1.values.bags).toBe(0);
    // Edge 2: Heavy 8-inch commercial pad
    const e2 = calculate(def, { length: 20, width: 20, depth: 8, waste: 5 }, { yield: 0.6 });
    expect(e2.ok && e2.values.cubicFeet).toBeCloseTo(266.67, 1);
    expect(e2.ok && e2.values.bags).toBe(467);
    // Edge 3: Thin 2-inch leveling pour
    const e3 = calculate(def, { length: 10, width: 10, depth: 2, waste: 10 }, { yield: 0.6 });
    expect(e3.ok && e3.values.bags).toBe(31);
    // Metric 1: 4m x 3m x 10cm slab (13.1234 ft x 9.8425 ft x 3.937 in, 10% waste)
    const m1 = calculate(def, { length: 13.1234, width: 9.8425, depth: 3.937, waste: 10 }, { yield: 0.6 });
    expect(m1.ok && m1.values.bags).toBe(78);
    // Metric 2: 2m x 2m x 15cm AC equipment pad (6.5617 ft x 6.5617 ft x 5.9055 in, 10% waste)
    const m2 = calculate(def, { length: 6.5617, width: 6.5617, depth: 5.9055, waste: 10 }, { yield: 0.6 });
    expect(m2.ok && m2.values.bags).toBe(39);
    // Realistic 1: 10x10 patio at 4 in, 10% waste, 80lb bags
    const r1 = calculate(def, { length: 10, width: 10, depth: 4, waste: 10 }, { yield: 0.6 });
    expect(r1.ok && r1.values.bags).toBe(62);
    // Realistic 2: 10x10 patio at 4 in, 10% waste, 60lb bags (0.45 yield)
    const r2 = calculate(def, { length: 10, width: 10, depth: 4, waste: 10 }, { yield: 0.45 });
    expect(r2.ok && r2.values.bags).toBe(82);
    // Realistic 3: 4x4 trash can pad at 4 in, 5% waste
    const r3 = calculate(def, { length: 4, width: 4, depth: 4, waste: 5 }, { yield: 0.6 });
    expect(r3.ok && r3.values.bags).toBe(10);
    // Realistic 4: 12x12 shed slab at 4 in, 10% waste
    const r4 = calculate(def, { length: 12, width: 12, depth: 4, waste: 10 }, { yield: 0.6 });
    expect(r4.ok && r4.values.bags).toBe(88);
    // Realistic 5: 30x4 sidewalk at 4 in, 10% waste
    const r5 = calculate(def, { length: 30, width: 4, depth: 4, waste: 10 }, { yield: 0.6 });
    expect(r5.ok && r5.values.bags).toBe(74);
  });

  // 4. Concrete Post Hole
  it('concrete-post-hole-calculator: 10 adversarial cases', () => {
    const def = calculators['concrete-post-hole-calculator'];
    // Edge 1: 1 hole, 6 in diameter (minimum), 12 in deep
    const e1 = calculate(def, { diameter: 6, depth: 12, holes: 1, waste: 0 });
    expect(e1.ok && e1.values.bags).toBe(1);
    // Edge 2: 24-inch massive commercial pier, 48 in deep, 10% waste
    const e2 = calculate(def, { diameter: 24, depth: 48, holes: 1, waste: 10 });
    expect(e2.ok && e2.values.bags).toBe(24);
    // Edge 3: 100 fence holes, 8 in diameter, 24 in deep, 10% waste
    const e3 = calculate(def, { diameter: 8, depth: 24, holes: 100, waste: 10 });
    expect(e3.ok && e3.values.bags).toBe(128);
    // Metric 1: 25cm diam (9.84 in), 90cm deep (35.43 in), 4 holes, 10% waste
    const m1 = calculate(def, { diameter: 9.84, depth: 35.43, holes: 4, waste: 10 });
    expect(m1.ok && m1.values.bags).toBe(12);
    // Metric 2: 30cm diam (11.81 in), 120cm deep (47.24 in), 2 holes, 10% waste
    const m2 = calculate(def, { diameter: 11.81, depth: 47.24, holes: 2, waste: 10 });
    expect(m2.ok && m2.values.bags).toBe(11);
    // Realistic 1: 4 deck posts 12 in diam x 36 in deep, 10% waste
    const r1 = calculate(def, { diameter: 12, depth: 36, holes: 4, waste: 10 });
    expect(r1.ok && e1.ok && r1.values.bags).toBe(18);
    // Realistic 2: Mailbox post 8 in diam x 24 in deep, 0% waste
    const r2 = calculate(def, { diameter: 8, depth: 24, holes: 1, waste: 0 });
    expect(r2.ok && r2.values.bags).toBe(2);
    // Realistic 3: 10 fence posts 10 in diam x 30 in deep, 10% waste
    const r3 = calculate(def, { diameter: 10, depth: 30, holes: 10, waste: 10 });
    expect(r3.ok && r3.values.bags).toBe(25);
    // Realistic 4: 6 pergola piers 12 in diam x 42 in deep, 10% waste
    const r4 = calculate(def, { diameter: 12, depth: 42, holes: 6, waste: 10 });
    expect(r4.ok && r4.values.bags).toBe(31);
    // Realistic 5: 1 gate post 12 in diam x 48 in deep, 10% waste
    const r5 = calculate(def, { diameter: 12, depth: 48, holes: 1, waste: 10 });
    expect(r5.ok && r5.values.bags).toBe(6);
  });

  // 5. Paver
  it('paver-calculator: 10 adversarial cases', () => {
    const def = calculators['paver-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 10, waste: 10 });
    expect(e1.ok && e1.values.pavers).toBe(0);
    // Edge 2: Large 24x24 in architectural pavers on 20x20 patio
    const e2 = calculate(def, { length: 20, width: 20, waste: 10 }, { unitLength: 24, unitWidth: 24 });
    expect(e2.ok && e2.values.pavers).toBe(110);
    // Edge 3: 0% waste
    const e3 = calculate(def, { length: 10, width: 10, waste: 0 }, { unitLength: 8, unitWidth: 4 });
    expect(e3.ok && e3.values.pavers).toBe(450);
    // Metric 1: 6m x 4m patio (19.685 ft x 13.123 ft, 10% waste, 4x8 in pavers)
    const m1 = calculate(def, { length: 19.685, width: 13.123, waste: 10 }, { unitLength: 8, unitWidth: 4 });
    expect(m1.ok && m1.values.pavers).toBe(1279);
    // Metric 2: 3m x 1m walkway (9.8425 ft x 3.2808 ft, 10% waste)
    const m2 = calculate(def, { length: 9.8425, width: 3.2808, waste: 10 }, { unitLength: 8, unitWidth: 4 });
    expect(m2.ok && m2.values.pavers).toBe(160);
    // Realistic 1: 10x10 patio running bond (10% waste)
    const r1 = calculate(def, { length: 10, width: 10, waste: 10 }, { unitLength: 8, unitWidth: 4 });
    expect(r1.ok && r1.values.pavers).toBe(495);
    // Realistic 2: 12x12 patio with 12x12 in pavers (10% waste)
    const r2 = calculate(def, { length: 12, width: 12, waste: 10 }, { unitLength: 12, unitWidth: 12 });
    expect(r2.ok && r2.values.pavers).toBe(159);
    // Realistic 3: 20x15 driveway apron with 4x8 pavers (15% herringbone waste)
    const r3 = calculate(def, { length: 20, width: 15, waste: 15 }, { unitLength: 8, unitWidth: 4 });
    expect(r3.ok && r3.values.pavers).toBe(1553);
    // Realistic 4: 40x3 garden path (10% waste)
    const r4 = calculate(def, { length: 40, width: 3, waste: 10 }, { unitLength: 8, unitWidth: 4 });
    expect(r4.ok && r4.values.pavers).toBe(594);
    // Realistic 5: 16x16 patio with 6x9 in pavers (unitLength: 9, unitWidth: 6, 10% waste)
    const r5 = calculate(def, { length: 16, width: 16, waste: 10 }, { unitLength: 9, unitWidth: 6 });
    expect(r5.ok && r5.values.pavers).toBe(751);
  });

  // 6. Retaining Wall Block
  it('retaining-wall-block-calculator: 10 adversarial cases', () => {
    const def = calculators['retaining-wall-block-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 3, waste: 10 });
    expect(e1.ok && e1.values.blocks).toBe(0);
    // Edge 2: 100-ft long wall at 2 ft high, 0% waste
    const e2 = calculate(def, { length: 100, width: 2, waste: 0 }, { unitLength: 16, unitWidth: 6 });
    expect(e2.ok && e2.values.blocks).toBe(300);
    expect(e2.ok && e2.values.capBlocks).toBe(75);
    // Edge 3: Small 4x4 in garden border block (unitLength 12, unitWidth 4)
    const e3 = calculate(def, { length: 20, width: 1, waste: 10 }, { unitLength: 12, unitWidth: 4 });
    expect(e3.ok && e3.values.blocks).toBe(66);
    // Metric 1: 10m long (32.81 ft) x 0.9m high (2.95 ft), 10% waste
    const m1 = calculate(def, { length: 32.81, width: 2.95, waste: 10 }, { unitLength: 16, unitWidth: 6 });
    expect(m1.ok && m1.values.blocks).toBe(160);
    // Metric 2: 5m long (16.4 ft) x 0.6m high (1.97 ft), 10% waste
    const m2 = calculate(def, { length: 16.4, width: 1.97, waste: 10 }, { unitLength: 16, unitWidth: 6 });
    expect(m2.ok && m2.values.blocks).toBe(54);
    // Realistic 1: 20 ft x 3 ft, 10% waste
    const r1 = calculate(def, { length: 20, width: 3, waste: 10 }, { unitLength: 16, unitWidth: 6 });
    expect(r1.ok && r1.values.blocks).toBe(99);
    // Realistic 2: 30 ft x 2.5 ft, 10% waste
    const r2 = calculate(def, { length: 30, width: 2.5, waste: 10 }, { unitLength: 16, unitWidth: 6 });
    expect(r2.ok && r2.values.blocks).toBe(124);
    // Realistic 3: 40 ft x 3.5 ft, 10% waste
    const r3 = calculate(def, { length: 40, width: 3.5, waste: 10 }, { unitLength: 16, unitWidth: 6 });
    expect(r3.ok && r3.values.blocks).toBe(231);
    // Realistic 4: 15 ft x 2 ft, 5% waste
    const r4 = calculate(def, { length: 15, width: 2, waste: 5 }, { unitLength: 16, unitWidth: 6 });
    expect(r4.ok && r4.values.blocks).toBe(48);
    // Realistic 5: 50 ft x 4 ft, 10% waste
    const r5 = calculate(def, { length: 50, width: 4, waste: 10 }, { unitLength: 16, unitWidth: 6 });
    expect(r5.ok && r5.values.blocks).toBe(330);
  });

  // 7. Sod
  it('sod-calculator: 10 adversarial cases', () => {
    const def = calculators['sod-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 20, waste: 10 });
    expect(e1.ok && e1.values.rolls).toBe(0);
    // Edge 2: 0% waste
    const e2 = calculate(def, { length: 50, width: 20, waste: 0 }, { areaPerUnit: 10 });
    expect(e2.ok && e2.values.rolls).toBe(100);
    // Edge 3: 9 sq ft rolls
    const e3 = calculate(def, { length: 60, width: 30, waste: 10 }, { areaPerUnit: 9 });
    expect(e3.ok && e3.values.rolls).toBe(220);
    // Metric 1: 15m x 10m (49.21 ft x 32.81 ft), 10% waste
    const m1 = calculate(def, { length: 49.21, width: 32.81, waste: 10 }, { areaPerUnit: 10 });
    expect(m1.ok && m1.values.rolls).toBe(178);
    // Metric 2: 20m x 8m (65.62 ft x 26.25 ft), 10% waste
    const m2 = calculate(def, { length: 65.62, width: 26.25, waste: 10 }, { areaPerUnit: 10 });
    expect(m2.ok && m2.values.rolls).toBe(190);
    // Realistic 1: 50x20 backyard, 10% waste
    const r1 = calculate(def, { length: 50, width: 20, waste: 10 }, { areaPerUnit: 10 });
    expect(r1.ok && r1.values.rolls).toBe(110);
    // Realistic 2: 30x15 front yard, 5% waste, 9 sq ft rolls
    const r2 = calculate(def, { length: 30, width: 15, waste: 5 }, { areaPerUnit: 9 });
    expect(r2.ok && r2.values.rolls).toBe(53);
    // Realistic 3: 80x40 suburban lot, 10% waste
    const r3 = calculate(def, { length: 80, width: 40, waste: 10 }, { areaPerUnit: 10 });
    expect(r3.ok && r3.values.rolls).toBe(352);
    // Realistic 4: 25x20 side yard patch, 10% waste
    const r4 = calculate(def, { length: 25, width: 20, waste: 10 }, { areaPerUnit: 10 });
    expect(r4.ok && r4.values.rolls).toBe(55);
    // Realistic 5: 100x50 large lawn, 10% waste
    const r5 = calculate(def, { length: 100, width: 50, waste: 10 }, { areaPerUnit: 10 });
    expect(r5.ok && r5.values.rolls).toBe(550);
  });

  // 8. Grass Seed
  it('grass-seed-calculator: 10 adversarial cases', () => {
    const def = calculators['grass-seed-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 40, rate: 4 });
    expect(e1.ok && e1.values.pounds).toBe(0);
    // Edge 2: Heavy 8 lbs/1000 rate (fescue new lawn)
    const e2 = calculate(def, { length: 100, width: 50, rate: 8 }, { bagSize: 20 });
    expect(e2.ok && e2.values.pounds).toBe(40);
    expect(e2.ok && e2.values.bags).toBe(2);
    // Edge 3: Light 1.5 lbs/1000 rate (bentgrass)
    const e3 = calculate(def, { length: 50, width: 20, rate: 1.5 }, { bagSize: 5 });
    expect(e3.ok && e3.values.pounds).toBe(1.5);
    expect(e3.ok && e3.values.bags).toBe(1);
    // Metric 1: 20m x 15m (65.62 ft x 49.21 ft), rate 4
    const m1 = calculate(def, { length: 65.62, width: 49.21, rate: 4 }, { bagSize: 5 });
    expect(m1.ok && Math.round(m1.values.pounds * 10) / 10).toBe(12.9);
    expect(m1.ok && m1.values.bags).toBe(3);
    // Metric 2: 30m x 20m (98.43 ft x 65.62 ft), rate 3
    const m2 = calculate(def, { length: 98.43, width: 65.62, rate: 3 }, { bagSize: 10 });
    expect(m2.ok && Math.round(m2.values.pounds * 10) / 10).toBe(19.4);
    expect(m2.ok && m2.values.bags).toBe(2);
    // Realistic 1: 50x40 lawn at 4 lbs/1000
    const r1 = calculate(def, { length: 50, width: 40, rate: 4 }, { bagSize: 5 });
    expect(r1.ok && r1.values.pounds).toBe(8);
    expect(r1.ok && r1.values.bags).toBe(2);
    // Realistic 2: 100x50 at 6 lbs/1000
    const r2 = calculate(def, { length: 100, width: 50, rate: 6 }, { bagSize: 25 });
    expect(r2.ok && r2.values.pounds).toBe(30);
    expect(r2.ok && r2.values.bags).toBe(2);
    // Realistic 3: 25x20 patch at 3 lbs/1000
    const r3 = calculate(def, { length: 25, width: 20, rate: 3 }, { bagSize: 3 });
    expect(r3.ok && r3.values.pounds).toBe(1.5);
    expect(r3.ok && r3.values.bags).toBe(1);
    // Realistic 4: 80x50 at 5 lbs/1000
    const r4 = calculate(def, { length: 80, width: 50, rate: 5 }, { bagSize: 10 });
    expect(r4.ok && r4.values.pounds).toBe(20);
    expect(r4.ok && r4.values.bags).toBe(2);
    // Realistic 5: 120x60 large yard at 4 lbs/1000
    const r5 = calculate(def, { length: 120, width: 60, rate: 4 }, { bagSize: 25 });
    expect(r5.ok && r5.values.pounds).toBe(28.8);
    expect(r5.ok && r5.values.bags).toBe(2);
  });

  // 9. Paint
  it('paint-calculator: 10 adversarial cases', () => {
    const def = calculators['paint-calculator'];
    // Edge 1: Deductions exceed wall area -> clamped to 0
    const e1 = calculate(def, { length: 5, width: 5, height: 8, doors: 5, windows: 5, coats: 2 });
    expect(e1.ok && e1.values.wallArea).toBe(0);
    expect(e1.ok && e1.values.cans).toBe(0);
    // Edge 2: 1 coat on smooth wall (coverage 400)
    const e2 = calculate(def, { length: 20, width: 15, height: 9, doors: 1, windows: 2, coats: 1 }, { coverage: 400 });
    expect(e2.ok && Math.round(e2.values.gallons * 100) / 100).toBe(1.45);
    expect(e2.ok && e2.values.cans).toBe(2);
    // Edge 3: 4 coats on textured drywall (coverage 300)
    const e3 = calculate(def, { length: 10, width: 10, height: 8, doors: 1, windows: 1, coats: 4 }, { coverage: 300 });
    expect(e3.ok && Math.round(e3.values.gallons * 100) / 100).toBe(3.8);
    expect(e3.ok && e3.values.cans).toBe(4);
    // Metric 1: 4m x 3.5m room, 2.5m high (13.12 ft x 11.48 ft, 8.2 ft high, 1 door, 1 window, 2 coats)
    const m1 = calculate(def, { length: 13.12, width: 11.48, height: 8.2, doors: 1, windows: 1, coats: 2 });
    expect(m1.ok && m1.values.cans).toBe(3);
    // Metric 2: 5m x 4m room, 3m high (16.4 ft x 13.12 ft, 9.84 ft high, 2 doors, 2 windows, 2 coats)
    const m2 = calculate(def, { length: 16.4, width: 13.12, height: 9.84, doors: 2, windows: 2, coats: 2 });
    expect(m2.ok && m2.values.cans).toBe(3);
    // Realistic 1: 14x12 bedroom, 8 ft ceiling, 1 door, 2 windows, 2 coats
    const r1 = calculate(def, { length: 14, width: 12, height: 8, doors: 1, windows: 2, coats: 2 });
    expect(r1.ok && r1.values.wallArea).toBe(366);
    expect(r1.ok && r1.values.cans).toBe(3);
    // Realistic 2: 12x10 office, 8 ft ceiling, 1 door, 2 windows, 2 coats
    const r2 = calculate(def, { length: 12, width: 10, height: 8, doors: 1, windows: 2, coats: 2 });
    expect(r2.ok && r2.values.wallArea).toBe(302);
    expect(r2.ok && r2.values.cans).toBe(2);
    // Realistic 3: 20x15 living room, 9 ft ceiling, 2 doors, 4 windows, 2 coats
    const r3 = calculate(def, { length: 20, width: 15, height: 9, doors: 2, windows: 4, coats: 2 });
    expect(r3.ok && r3.values.wallArea).toBe(530);
    expect(r3.ok && r3.values.cans).toBe(4);
    // Realistic 4: 8x6 powder room, 8 ft ceiling, 1 door, 0 windows, 2 coats
    const r4 = calculate(def, { length: 8, width: 6, height: 8, doors: 1, windows: 0, coats: 2 });
    expect(r4.ok && r4.values.wallArea).toBe(204);
    expect(r4.ok && r4.values.cans).toBe(2);
    // Realistic 5: 16x14 master suite, 10 ft ceiling, 2 doors, 3 windows, 2 coats
    const r5 = calculate(def, { length: 16, width: 14, height: 10, doors: 2, windows: 3, coats: 2 });
    expect(r5.ok && r5.values.wallArea).toBe(515);
    expect(r5.ok && r5.values.cans).toBe(3);
  });

  // 10. Flooring
  it('flooring-calculator: 10 adversarial cases', () => {
    const def = calculators['flooring-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 12, waste: 10 });
    expect(e1.ok && e1.values.boxes).toBe(0);
    // Edge 2: 0% waste
    const e2 = calculate(def, { length: 20, width: 10, waste: 0 }, { areaPerBox: 20 });
    expect(e2.ok && e2.values.boxes).toBe(10);
    // Edge 3: 20% waste for complex herringbone
    const e3 = calculate(def, { length: 20, width: 15, waste: 20 }, { areaPerBox: 25 });
    expect(e3.ok && e3.values.boxes).toBe(15);
    // Metric 1: 5m x 4m (16.4 ft x 13.12 ft), 10% waste, 20 sq ft/box
    const m1 = calculate(def, { length: 16.4, width: 13.12, waste: 10 }, { areaPerBox: 20 });
    expect(m1.ok && m1.values.boxes).toBe(12);
    // Metric 2: 6m x 5m (19.69 ft x 16.4 ft), 10% waste, 22 sq ft/box
    const m2 = calculate(def, { length: 19.69, width: 16.4, waste: 10 }, { areaPerBox: 22 });
    expect(m2.ok && m2.values.boxes).toBe(17);
    // Realistic 1: 15x12 room, 10% waste, 20 sq ft/box
    const r1 = calculate(def, { length: 15, width: 12, waste: 10 }, { areaPerBox: 20 });
    expect(r1.ok && r1.values.boxes).toBe(10);
    // Realistic 2: 20x15 master, 15% waste, 22 sq ft/box
    const r2 = calculate(def, { length: 20, width: 15, waste: 15 }, { areaPerBox: 22 });
    expect(r2.ok && r2.values.boxes).toBe(16);
    // Realistic 3: 12x10 bedroom, 10% waste, 24 sq ft/box
    const r3 = calculate(def, { length: 12, width: 10, waste: 10 }, { areaPerBox: 24 });
    expect(r3.ok && r3.values.boxes).toBe(6);
    // Realistic 4: 25x14 great room, 10% waste, 20 sq ft/box
    const r4 = calculate(def, { length: 25, width: 14, waste: 10 }, { areaPerBox: 20 });
    expect(r4.ok && r4.values.boxes).toBe(20);
    // Realistic 5: 10x8 foyer, 15% waste, 18 sq ft/box
    const r5 = calculate(def, { length: 10, width: 8, waste: 15 }, { areaPerBox: 18 });
    expect(r5.ok && r5.values.boxes).toBe(6);
  });

  // 11. Tile
  it('tile-calculator: 10 adversarial cases', () => {
    const def = calculators['tile-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 8, waste: 10 });
    expect(e1.ok && e1.values.tiles).toBe(0);
    // Edge 2: Tiny subway tiles 3x6 in (unitLength: 6, unitWidth: 3, boxSize: 40)
    const e2 = calculate(def, { length: 10, width: 3, waste: 10 }, { unitLength: 6, unitWidth: 3, boxSize: 40 });
    expect(e2.ok && e2.values.tiles).toBe(264);
    expect(e2.ok && e2.values.boxes).toBe(7);
    // Edge 3: Large plank tile 8x48 in (unitLength: 48, unitWidth: 8, boxSize: 4)
    const e3 = calculate(def, { length: 20, width: 10, waste: 15 }, { unitLength: 48, unitWidth: 8, boxSize: 4 });
    expect(e3.ok && e3.values.tiles).toBe(87);
    expect(e3.ok && e3.values.boxes).toBe(22);
    // Metric 1: 3m x 2m bathroom (9.84 ft x 6.56 ft, 10% waste, 12x12 in tiles, 10/box)
    const m1 = calculate(def, { length: 9.84, width: 6.56, waste: 10 }, { unitLength: 12, unitWidth: 12, boxSize: 10 });
    expect(m1.ok && m1.values.tiles).toBe(72);
    expect(m1.ok && m1.values.boxes).toBe(8);
    // Metric 2: 4m x 3m kitchen (13.12 ft x 9.84 ft, 10% waste, 12x24 in tiles, 8/box)
    const m2 = calculate(def, { length: 13.12, width: 9.84, waste: 10 }, { unitLength: 24, unitWidth: 12, boxSize: 8 });
    expect(m2.ok && m2.values.tiles).toBe(72);
    expect(m2.ok && m2.values.boxes).toBe(9);
    // Realistic 1: 10x8 bathroom, 10% waste, 12x12 in, 10/box
    const r1 = calculate(def, { length: 10, width: 8, waste: 10 }, { unitLength: 12, unitWidth: 12, boxSize: 10 });
    expect(r1.ok && r1.values.tiles).toBe(88);
    expect(r1.ok && r1.values.boxes).toBe(9);
    // Realistic 2: 12x10 kitchen, 15% waste, 12x24 in, 8/box
    const r2 = calculate(def, { length: 12, width: 10, waste: 15 }, { unitLength: 24, unitWidth: 12, boxSize: 8 });
    expect(r2.ok && r2.values.tiles).toBe(69);
    expect(r2.ok && r2.values.boxes).toBe(9);
    // Realistic 3: 5x3 shower floor, 15% waste, 2x2 in mosaic (unitLength: 2, unitWidth: 2, boxSize: 10 sheets)
    const r3 = calculate(def, { length: 5, width: 3, waste: 15 }, { unitLength: 12, unitWidth: 12, boxSize: 10 });
    expect(r3.ok && r3.values.tiles).toBe(18);
    // Realistic 4: 8x6 laundry, 10% waste, 12x12 in, 10/box
    const r4 = calculate(def, { length: 8, width: 6, waste: 10 }, { unitLength: 12, unitWidth: 12, boxSize: 10 });
    expect(r4.ok && r4.values.tiles).toBe(53);
    expect(r4.ok && r4.values.boxes).toBe(6);
    // Realistic 5: 14x10 dining, 10% waste, 18x18 in (unitLength: 18, unitWidth: 18, boxSize: 6)
    const r5 = calculate(def, { length: 14, width: 10, waste: 10 }, { unitLength: 18, unitWidth: 18, boxSize: 6 });
    expect(r5.ok && r5.values.tiles).toBe(69);
    expect(r5.ok && r5.values.boxes).toBe(12);
  });

  // 12. Drywall
  it('drywall-calculator: 10 adversarial cases', () => {
    const def = calculators['drywall-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 10, waste: 10 });
    expect(e1.ok && e1.values.sheets).toBe(0);
    // Edge 2: 0% waste
    const e2 = calculate(def, { length: 40, width: 10, waste: 0 }, { areaPerUnit: 32 });
    expect(e2.ok && e2.values.sheets).toBe(13);
    // Edge 3: 4x12 ft sheets (areaPerUnit: 48)
    const e3 = calculate(def, { length: 60, width: 10, waste: 10 }, { areaPerUnit: 48 });
    expect(e3.ok && e3.values.sheets).toBe(14);
    // Metric 1: 12m x 3m (39.37 ft x 9.84 ft), 10% waste, 32 sq ft sheets
    const m1 = calculate(def, { length: 39.37, width: 9.84, waste: 10 }, { areaPerUnit: 32 });
    expect(m1.ok && m1.values.sheets).toBe(14);
    // Metric 2: 15m x 2.5m (49.21 ft x 8.20 ft), 10% waste, 48 sq ft sheets
    const m2 = calculate(def, { length: 49.21, width: 8.20, waste: 10 }, { areaPerUnit: 48 });
    expect(m2.ok && m2.values.sheets).toBe(10);
    // Realistic 1: 40x10 wall, 10% waste, 32 sq ft
    const r1 = calculate(def, { length: 40, width: 10, waste: 10 }, { areaPerUnit: 32 });
    expect(r1.ok && r1.values.sheets).toBe(14);
    // Realistic 2: 50x8 wall, 10% waste, 32 sq ft
    const r2 = calculate(def, { length: 50, width: 8, waste: 10 }, { areaPerUnit: 32 });
    expect(r2.ok && r2.values.sheets).toBe(14);
    // Realistic 3: 20x15 ceiling (300 sq ft), 10% waste, 48 sq ft sheets
    const r3 = calculate(def, { length: 20, width: 15, waste: 10 }, { areaPerUnit: 48 });
    expect(r3.ok && r3.values.sheets).toBe(7);
    // Realistic 4: 80x8 basement perimeter, 15% waste, 32 sq ft
    const r4 = calculate(def, { length: 80, width: 8, waste: 15 }, { areaPerUnit: 32 });
    expect(r4.ok && r4.values.sheets).toBe(23);
    // Realistic 5: 100x9 garage walls, 10% waste, 48 sq ft sheets
    const r5 = calculate(def, { length: 100, width: 9, waste: 10 }, { areaPerUnit: 48 });
    expect(r5.ok && r5.values.sheets).toBe(21);
  });

  // 13. Fence
  it('fence-calculator: 10 adversarial cases', () => {
    const def = calculators['fence-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, gates: 1, corners: 2 });
    expect(e1.ok && e1.values.posts).toBe(3);
    expect(e1.ok && e1.values.panels).toBe(0);
    // Edge 2: 6-ft spacing in high-wind zone
    const e2 = calculate(def, { length: 60, gates: 0, corners: 0 }, { postSpacing: 6, panelWidth: 6 });
    expect(e2.ok && e2.values.posts).toBe(11);
    expect(e2.ok && e2.values.panels).toBe(10);
    // Edge 3: 4-ft tall fence with 2 rails
    const e3 = calculate(def, { length: 48, gates: 0, corners: 0 }, { railsPerSection: 2 });
    expect(e3.ok && e3.values.rails).toBe(12);
    // Metric 1: 30m run (98.43 ft), 1 gate, 2 corners, 8 ft spacing
    const m1 = calculate(def, { length: 98.43, gates: 1, corners: 2 });
    expect(m1.ok && m1.values.posts).toBe(17);
    // Metric 2: 50m run (164.04 ft), 2 gates, 4 corners
    const m2 = calculate(def, { length: 164.04, gates: 2, corners: 4 });
    expect(m2.ok && m2.values.posts).toBe(28);
    // Realistic 1: 100 ft straight run, 0 gates, 0 corners
    const r1 = calculate(def, { length: 100, gates: 0, corners: 0 });
    expect(r1.ok && r1.values.posts).toBe(14);
    expect(r1.ok && r1.values.panels).toBe(13);
    // Realistic 2: 120 ft perimeter, 1 gate, 2 corners
    const r2 = calculate(def, { length: 120, gates: 1, corners: 2 });
    expect(r2.ok && r2.values.posts).toBe(19);
    // Realistic 3: 48 ft yard side, 0 gates, 0 corners
    const r3 = calculate(def, { length: 48, gates: 0, corners: 0 });
    expect(r3.ok && r3.values.posts).toBe(7);
    // Realistic 4: 150 ft run with 2 gates and 3 corners
    const r4 = calculate(def, { length: 150, gates: 2, corners: 3 });
    expect(r4.ok && r4.values.posts).toBe(25);
    // Realistic 5: 200 ft continuous fence, 0 gates, 4 corners
    const r5 = calculate(def, { length: 200, gates: 0, corners: 4 });
    expect(r5.ok && r5.values.posts).toBe(30);
  });

  // 14. Deck Boards
  it('deck-board-calculator: 10 adversarial cases', () => {
    const def = calculators['deck-board-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 12, waste: 10 });
    expect(e1.ok && e1.values.boards).toBe(0);
    // Edge 2: 1/8 in gap (0.125 in)
    const e2 = calculate(def, { length: 16, width: 12, waste: 0 }, { boardWidth: 5.5, gap: 0.125, boardLength: 16 });
    expect(e2.ok && e2.values.rows).toBe(26);
    // Edge 3: 20 ft boards on 20 ft deck
    const e3 = calculate(def, { length: 20, width: 16, waste: 10 }, { boardLength: 20 });
    expect(e3.ok && e3.values.boards).toBe(38);
    // Metric 1: 5m x 4m (16.4 ft x 13.12 ft), 10% waste, 16 ft boards
    const m1 = calculate(def, { length: 16.4, width: 13.12, waste: 10 });
    expect(m1.ok && m1.values.boards).toBe(32);
    // Metric 2: 6m x 3.5m (19.69 ft x 11.48 ft), 10% waste, 20 ft boards
    const m2 = calculate(def, { length: 19.69, width: 11.48, waste: 10 }, { boardLength: 20 });
    expect(m2.ok && m2.values.boards).toBe(26);
    // Realistic 1: 16x12 ft deck, 16 ft boards, 0% waste
    const r1 = calculate(def, { length: 16, width: 12, waste: 0 }, { boardLength: 16 });
    expect(r1.ok && r1.values.boards).toBe(26);
    // Realistic 2: 16x12 ft deck, 16 ft boards, 10% waste
    const r2 = calculate(def, { length: 16, width: 12, waste: 10 }, { boardLength: 16 });
    expect(r2.ok && r2.values.boards).toBe(29);
    // Realistic 3: 12x10 ft small deck, 12 ft boards, 10% waste
    const r3 = calculate(def, { length: 12, width: 10, waste: 10 }, { boardLength: 12 });
    expect(r3.ok && r3.values.boards).toBe(24);
    // Realistic 4: 24x14 ft large deck, 16 ft boards, 10% waste
    const r4 = calculate(def, { length: 24, width: 14, waste: 10 }, { boardLength: 16 });
    expect(r4.ok && r4.values.boards).toBe(50);
    // Realistic 5: 14x12 ft deck, 16 ft boards, 10% waste
    const r5 = calculate(def, { length: 14, width: 12, waste: 10 }, { boardLength: 16 });
    expect(r5.ok && r5.values.boards).toBe(26);
  });

  // 15. Roofing
  it('roofing-calculator: 10 adversarial cases', () => {
    const def = calculators['roofing-calculator'];
    // Edge 1: Flat roof pitch (rise = 1 -> nearly flat)
    const e1 = calculate(def, { length: 40, width: 25, rise: 1, waste: 0 });
    expect(e1.ok && Math.round(e1.values.pitchFactor * 1000) / 1000).toBe(1.003);
    // Edge 2: Steep 12:12 pitch (45 degrees, factor = 1.4142)
    const e2 = calculate(def, { length: 40, width: 25, rise: 12, waste: 0 });
    expect(e2.ok && Math.round(e2.values.pitchFactor * 1000) / 1000).toBe(1.414);
    expect(e2.ok && e2.values.bundles).toBe(43);
    // Edge 3: Mansard extreme 18:12 pitch
    const e3 = calculate(def, { length: 40, width: 25, rise: 18, waste: 10 });
    expect(e3.ok && Math.round(e3.values.pitchFactor * 1000) / 1000).toBe(1.803);
    expect(e3.ok && e3.values.bundles).toBe(60);
    // Metric 1: 12m x 8m footprint (39.37 ft x 26.25 ft), 6:12 pitch, 10% waste
    const m1 = calculate(def, { length: 39.37, width: 26.25, rise: 6, waste: 10 });
    expect(m1.ok && m1.values.bundles).toBe(39);
    // Metric 2: 15m x 10m footprint (49.21 ft x 32.81 ft), 4:12 pitch, 10% waste
    const m2 = calculate(def, { length: 49.21, width: 32.81, rise: 4, waste: 10 });
    expect(m2.ok && m2.values.bundles).toBe(57);
    // Realistic 1: 1,000 sq ft footprint (40x25), 6:12 pitch, 10% waste
    const r1 = calculate(def, { length: 40, width: 25, rise: 6, waste: 10 });
    expect(r1.ok && r1.values.bundles).toBe(37);
    // Realistic 2: 1,500 sq ft footprint (50x30), 4:12 pitch, 10% waste
    const r2 = calculate(def, { length: 50, width: 30, rise: 4, waste: 10 });
    expect(r2.ok && r2.values.bundles).toBe(53);
    // Realistic 3: 2,000 sq ft footprint, 8:12 pitch, 15% waste
    const r3 = calculate(def, { length: 50, width: 40, rise: 8, waste: 15 });
    expect(r3.ok && r3.values.bundles).toBe(83);
    // Realistic 4: 800 sq ft small bungalow, 5:12 pitch, 10% waste
    const r4 = calculate(def, { length: 40, width: 20, rise: 5, waste: 10 });
    expect(r4.ok && r4.values.bundles).toBe(29);
    // Realistic 5: 2,500 sq ft footprint, 6:12 pitch, 10% waste
    const r5 = calculate(def, { length: 50, width: 50, rise: 6, waste: 10 });
    expect(r5.ok && r5.values.bundles).toBe(93);
  });

  // 16. Sand
  it('sand-calculator: 10 adversarial cases', () => {
    const def = calculators['sand-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 10, depth: 2, waste: 10 });
    expect(e1.ok && e1.values.tons).toBe(0);
    // Edge 2: Heavy packed wet sand (density: 1.55)
    const e2 = calculate(def, { length: 20, width: 10, depth: 4, waste: 10 }, { density: 1.55 });
    expect(e2.ok && Math.round(e2.values.tons * 100) / 100).toBe(4.21);
    // Edge 3: Dry loose sand (density: 1.25)
    const e3 = calculate(def, { length: 10, width: 10, depth: 2, waste: 0 }, { density: 1.25 });
    expect(e3.ok && Math.round(e3.values.tons * 100) / 100).toBe(0.77);
    // Metric 1: 4m x 3m x 5cm (13.12 ft x 9.84 ft x 1.97 in, 10% waste)
    const m1 = calculate(def, { length: 13.12, width: 9.84, depth: 1.97, waste: 10 }, { density: 1.4 });
    expect(m1.ok && Math.round(m1.values.tons * 100) / 100).toBe(1.21);
    // Metric 2: 5m x 5m x 5cm (16.4 ft x 16.4 ft x 1.97 in, 10% waste)
    const m2 = calculate(def, { length: 16.4, width: 16.4, depth: 1.97, waste: 10 }, { density: 1.4 });
    expect(m2.ok && Math.round(m2.values.tons * 100) / 100).toBe(2.52);
    // Realistic 1: 10x10 patio paver setting bed at 1 in, 10% waste
    const r1 = calculate(def, { length: 10, width: 10, depth: 1, waste: 10 }, { density: 1.4 });
    expect(r1.ok && Math.round(r1.values.tons * 100) / 100).toBe(0.48);
    // Realistic 2: 12x12 above ground pool base at 2 in, 10% waste
    const r2 = calculate(def, { length: 12, width: 12, depth: 2, waste: 10 }, { density: 1.4 });
    expect(r2.ok && Math.round(r2.values.tons * 100) / 100).toBe(1.37);
    // Realistic 3: 20x15 patio base at 1 in, 10% waste
    const r3 = calculate(def, { length: 20, width: 15, depth: 1, waste: 10 }, { density: 1.4 });
    expect(r3.ok && Math.round(r3.values.tons * 100) / 100).toBe(1.43);
    // Realistic 4: 8x8 sandbox at 6 in, 5% waste
    const r4 = calculate(def, { length: 8, width: 8, depth: 6, waste: 5 }, { density: 1.35 });
    expect(r4.ok && Math.round(r4.values.tons * 100) / 100).toBe(1.68);
    // Realistic 5: 30x3 walkway bedding at 1 in, 10% waste
    const r5 = calculate(def, { length: 30, width: 3, depth: 1, waste: 10 }, { density: 1.4 });
    expect(r5.ok && Math.round(r5.values.tons * 100) / 100).toBe(0.43);
  });

  // 17. Topsoil
  it('topsoil-calculator: 10 adversarial cases', () => {
    const def = calculators['topsoil-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 15, depth: 4, waste: 10 });
    expect(e1.ok && e1.values.tons).toBe(0);
    // Edge 2: Heavy unscreened damp loam (density: 1.35)
    const e2 = calculate(def, { length: 20, width: 15, depth: 4, waste: 10 }, { density: 1.35 });
    expect(e2.ok && Math.round(e2.values.tons * 100) / 100).toBe(5.50);
    // Edge 3: Light compost blend (density: 0.9)
    const e3 = calculate(def, { length: 20, width: 10, depth: 3, waste: 0 }, { density: 0.9 });
    expect(e3.ok && Math.round(e3.values.tons * 100) / 100).toBe(1.67);
    // Metric 1: 10m x 5m (32.81 ft x 16.4 ft) at 10cm (3.94 in), 10% waste
    const m1 = calculate(def, { length: 32.81, width: 16.4, depth: 3.94, waste: 10 }, { density: 1.1 });
    expect(m1.ok && Math.round(m1.values.tons * 100) / 100).toBe(7.92);
    // Metric 2: 6m x 4m at 5cm (19.69 ft x 13.12 ft at 1.97 in), 10% waste
    const m2 = calculate(def, { length: 19.69, width: 13.12, depth: 1.97, waste: 10 }, { density: 1.1 });
    expect(m2.ok && Math.round(m2.values.tons * 100) / 100).toBe(1.90);
    // Realistic 1: Topdressing 20x15 lawn at 2 in, 10% waste
    const r1 = calculate(def, { length: 20, width: 15, depth: 2, waste: 10 }, { density: 1.1 });
    expect(r1.ok && Math.round(r1.values.tons * 100) / 100).toBe(2.24);
    // Realistic 2: New lawn bed 20x15 at 4 in, 10% waste
    const r2 = calculate(def, { length: 20, width: 15, depth: 4, waste: 10 }, { density: 1.1 });
    expect(r2.ok && Math.round(r2.values.tons * 100) / 100).toBe(4.48);
    // Realistic 3: Garden grading 50x20 at 6 in, 5% waste, density 1.2
    const r3 = calculate(def, { length: 50, width: 20, depth: 6, waste: 5 }, { density: 1.2 });
    expect(r3.ok && Math.round(r3.values.tons * 100) / 100).toBe(23.33);
    // Realistic 4: Flower border 40x4 at 3 in, 10% waste
    const r4 = calculate(def, { length: 40, width: 4, depth: 3, waste: 10 }, { density: 1.1 });
    expect(r4.ok && Math.round(r4.values.tons * 100) / 100).toBe(1.79);
    // Realistic 5: Raised berm 30x10 at 8 in, 10% waste
    const r5 = calculate(def, { length: 30, width: 10, depth: 8, waste: 10 }, { density: 1.1 });
    expect(r5.ok && Math.round(r5.values.tons * 100) / 100).toBe(8.96);
  });

  // 18. Raised Bed Soil
  it('raised-bed-soil-calculator: 10 adversarial cases', () => {
    const def = calculators['raised-bed-soil-calculator'];
    // Edge 1: Zero length
    const e1 = calculate(def, { length: 0, width: 4, depth: 12, waste: 5 });
    expect(e1.ok && e1.values.bags).toBe(0);
    // Edge 2: Deep 24 in planter box
    const e2 = calculate(def, { length: 8, width: 4, depth: 24, waste: 5 }, { bagSize: 1.5 });
    expect(e2.ok && e2.values.bags).toBe(45);
    // Edge 3: 2.0 cu ft large commercial bag
    const e3 = calculate(def, { length: 4, width: 4, depth: 8, waste: 0 }, { bagSize: 2.0 });
    expect(e3.ok && e3.values.bags).toBe(6);
    // Metric 1: 2.4m x 1.2m at 30cm deep (7.87 ft x 3.94 ft x 11.81 in, 5% waste)
    const m1 = calculate(def, { length: 7.87, width: 3.94, depth: 11.81, waste: 5 }, { bagSize: 1.5 });
    expect(m1.ok && m1.values.bags).toBe(22);
    // Metric 2: 1.2m x 1.2m at 20cm deep (3.94 ft x 3.94 ft x 7.87 in, 5% waste)
    const m2 = calculate(def, { length: 3.94, width: 3.94, depth: 7.87, waste: 5 }, { bagSize: 1.5 });
    expect(m2.ok && m2.values.bags).toBe(8);
    // Realistic 1: Standard 8x4 at 10 in deep, 10% settling
    const r1 = calculate(def, { length: 8, width: 4, depth: 10, waste: 10 }, { bagSize: 1.5 });
    expect(r1.ok && r1.values.bags).toBe(20);
    // Realistic 2: Square 4x4 at 12 in deep, 5% settling
    const r2 = calculate(def, { length: 4, width: 4, depth: 12, waste: 5 }, { bagSize: 1.5 });
    expect(r2.ok && r2.values.bags).toBe(12);
    // Realistic 3: Long 12x3 trough at 12 in deep, 5% waste
    const r3 = calculate(def, { length: 12, width: 3, depth: 12, waste: 5 }, { bagSize: 1.5 });
    expect(r3.ok && r3.values.bags).toBe(26);
    // Realistic 4: Two 6x3 beds at 10 in deep (12x3), 5% waste
    const r4 = calculate(def, { length: 12, width: 3, depth: 10, waste: 5 }, { bagSize: 1.5 });
    expect(r4.ok && r4.values.bags).toBe(21);
    // Realistic 5: 6x2 elevated herb planter at 8 in deep, 0% waste
    const r5 = calculate(def, { length: 6, width: 2, depth: 8, waste: 0 }, { bagSize: 1.5 });
    expect(r5.ok && r5.values.bags).toBe(6);
  });

  // 19. Cubic Yard Calculator
  it('cubic-yard-calculator: 10 adversarial cases', () => {
    const def = calculators['cubic-yard-calculator'];
    // Edge 1: Zero dimension
    const e1 = calculate(def, { length: 0, width: 10, depth: 12 });
    expect(e1.ok && e1.values.cubicYards).toBe(0);
    // Edge 2: Exactly 27 cu ft = 1 cu yd
    const e2 = calculate(def, { length: 3, width: 3, depth: 36 });
    expect(e2.ok && e2.values.cubicFeet).toBe(27);
    expect(e2.ok && e2.values.cubicYards).toBe(1);
    // Edge 3: Thin 0.5 in depth over 100x100 ft
    const e3 = calculate(def, { length: 100, width: 100, depth: 0.5 });
    expect(e3.ok && Math.round(e3.values.cubicYards * 100) / 100).toBe(15.43);
    // Metric 1: 10m x 10m x 1m (32.8084 ft x 32.8084 ft x 39.3701 in) -> ~100 m3
    const m1 = calculate(def, { length: 32.8084, width: 32.8084, depth: 39.3701 });
    expect(m1.ok && Math.round(m1.values.cubicMeters)).toBe(100);
    // Metric 2: 1m x 1m x 1m (3.2808 ft x 3.2808 ft x 39.37 in) -> 1 m3 (1000 L)
    const m2 = calculate(def, { length: 3.2808, width: 3.2808, depth: 39.37 });
    expect(m2.ok && Math.round(m2.values.liters)).toBe(1000);
    // Realistic 1: 10x10 at 12 in (100 cu ft)
    const r1 = calculate(def, { length: 10, width: 10, depth: 12 });
    expect(r1.ok && Math.round(r1.values.cubicYards * 100) / 100).toBe(3.70);
    // Realistic 2: 20x15 driveway excavation at 6 in
    const r2 = calculate(def, { length: 20, width: 15, depth: 6 });
    expect(r2.ok && Math.round(r2.values.cubicYards * 100) / 100).toBe(5.56);
    // Realistic 3: 50x20 basement dig at 36 in
    const r3 = calculate(def, { length: 50, width: 20, depth: 36 });
    expect(r3.ok && Math.round(r3.values.cubicYards * 100) / 100).toBe(111.11);
    // Realistic 4: 25x4 sidewalk trench at 4 in
    const r4 = calculate(def, { length: 25, width: 4, depth: 4 });
    expect(r4.ok && Math.round(r4.values.cubicYards * 100) / 100).toBe(1.23);
    // Realistic 5: 12x12 patio excavation at 8 in
    const r5 = calculate(def, { length: 12, width: 12, depth: 8 });
    expect(r5.ok && Math.round(r5.values.cubicYards * 100) / 100).toBe(3.56);
  });

  // 20. Square Footage Calculator
  it('square-footage-calculator: 10 adversarial cases', () => {
    const def = calculators['square-footage-calculator'];
    // Edge 1: Zero dimension
    const e1 = calculate(def, { shape: 1, length: 0, width: 10 });
    expect(e1.ok && e1.values.squareFeet).toBe(0);
    // Edge 2: Circle with 0 diameter
    const e2 = calculate(def, { shape: 3, length: 0, width: 0 });
    expect(e2.ok && e2.values.squareFeet).toBe(0);
    // Edge 3: Right triangle with base 0
    const e3 = calculate(def, { shape: 2, length: 0, width: 20 });
    expect(e3.ok && e3.values.squareFeet).toBe(0);
    // Metric 1: 10m x 10m (32.8084 ft x 32.8084 ft) -> 100 m2
    const m1 = calculate(def, { shape: 1, length: 32.8084, width: 32.8084 });
    expect(m1.ok && Math.round(m1.values.squareMeters)).toBe(100);
    // Metric 2: Circle diameter 10m (32.8084 ft) -> radius 5m -> ~78.54 m2
    const m2 = calculate(def, { shape: 3, length: 32.8084, width: 0 });
    expect(m2.ok && Math.round(m2.values.squareMeters * 100) / 100).toBe(78.54);
    // Realistic 1: 20x10 rectangle
    const r1 = calculate(def, { shape: 1, length: 20, width: 10 });
    expect(r1.ok && r1.values.squareFeet).toBe(200);
    expect(r1.ok && Math.round(r1.values.squareYards * 100) / 100).toBe(22.22);
    // Realistic 2: Triangle base 20 ft, height 10 ft
    const r2 = calculate(def, { shape: 2, length: 20, width: 10 });
    expect(r2.ok && r2.values.squareFeet).toBe(100);
    // Realistic 3: Circle diameter 20 ft
    const r3 = calculate(def, { shape: 3, length: 20, width: 0 });
    expect(r3.ok && Math.round(r3.values.squareFeet * 100) / 100).toBe(314.16);
    // Realistic 4: 15x12 bedroom floor
    const r4 = calculate(def, { shape: 1, length: 15, width: 12 });
    expect(r4.ok && r4.values.squareFeet).toBe(180);
    // Realistic 5: 30x4 walkway
    const r5 = calculate(def, { shape: 1, length: 30, width: 4 });
    expect(r5.ok && r5.values.squareFeet).toBe(120);
  });
});
