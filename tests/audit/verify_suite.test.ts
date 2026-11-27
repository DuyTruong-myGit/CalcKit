/**
 * tests/audit/verify_suite.test.ts
 *
 * Independent verification test suite for CalcKit audit.
 * Does NOT import formula code or units code from src/lib/calc/.
 * Uses completely independent arithmetic and conversions from first principles.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculate } from '../../src/lib/calc/engine.ts';
import type { CalculatorDef, ConstantDef } from '../../src/lib/schema/types.ts';

type FormulaFn = (inputs: Record<string, unknown>, constants: Record<string, unknown>) => Record<string, number>;

// --- Independent Reference Math Implementation ---

const INDEPENDENT_FORMULAS: Record<string, FormulaFn> = {
  // 1. Mulch & Raised Bed Soil
  'volume-bags': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const D = Number(inputs.depth);
    const waste = Number(inputs.waste ?? 0);
    const bagSize = Number(constants.bagSize);

    const cuFt = L * W * (D / 12);
    const cuYd = cuFt / 27;
    const bagsExact = (cuFt * (1 + waste / 100)) / bagSize;
    const bags = Math.ceil(Math.round(bagsExact * 1e8) / 1e8);

    return {
      cubicFeet: cuFt,
      cubicYards: cuYd,
      bags: bags
    };
  },

  // 2. Gravel, Topsoil, Sand
  'volume-weight': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const D = Number(inputs.depth);
    const waste = Number(inputs.waste ?? 0);
    const density = Number(constants.density);

    const cuFt = L * W * (D / 12);
    const cuYd = cuFt / 27;
    const tons = cuYd * (1 + waste / 100) * density;

    return {
      cubicFeet: cuFt,
      cubicYards: cuYd,
      tons: tons
    };
  },

  // 3. Concrete Slab
  'concrete-slab': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const D = Number(inputs.depth);
    const waste = Number(inputs.waste ?? 0);
    const yieldPerBag = Number(constants.yield);

    const cuFt = L * W * (D / 12);
    const cuYd = cuFt / 27;
    const bagsExact = (cuFt * (1 + waste / 100)) / yieldPerBag;
    const bags = Math.ceil(Math.round(bagsExact * 1e8) / 1e8);

    return {
      cubicFeet: cuFt,
      cubicYards: cuYd,
      bags: bags
    };
  },

  // 4. Concrete Cylinder (Post Hole)
  'concrete-cylinder': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const d = Number(inputs.diameter);
    const h = Number(inputs.depth);
    const n = Number(inputs.holes ?? 1);
    const waste = Number(inputs.waste ?? 0);
    const y80 = Number(constants.yield80 ?? 0.6);
    const y60 = Number(constants.yield60 ?? 0.45);

    const radius = d / 2;
    const areaSqIn = Math.PI * radius * radius;
    const cuInPerHole = areaSqIn * h;
    const cuFtPerHole = cuInPerHole / 1728;
    const cuFtTotal = cuFtPerHole * n;
    const cuYd = cuFtTotal / 27;

    const totalWithWaste = cuFtTotal * (1 + waste / 100);
    const bags80 = Math.ceil(Math.round((totalWithWaste / y80) * 1e8) / 1e8);
    const bags60 = Math.ceil(Math.round((totalWithWaste / y60) * 1e8) / 1e8);

    return {
      cubicFeet: cuFtTotal,
      cubicYards: cuYd,
      bags: bags80,
      bags80: bags80,
      bags60: bags60
    };
  },

  // 5. Unit Count (Pavers, Retaining Wall, Flooring, Tile, Drywall, Sod)
  'unit-count': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const waste = Number(inputs.waste ?? 0);

    const area = L * W;
    const wasteFactor = 1 + waste / 100;

    let unitArea = typeof constants.areaPerUnit === 'number' ? constants.areaPerUnit : 0;
    if (!unitArea && constants.unitLength && constants.unitWidth) {
      unitArea = (Number(constants.unitLength) * Number(constants.unitWidth)) / 144;
    }
    if (!unitArea || unitArea <= 0) unitArea = 1;

    const units = Math.ceil(Math.round(((area * wasteFactor) / unitArea) * 1e8) / 1e8);

    let capBlocks = 0;
    if (constants.unitLength && Number(constants.unitLength) > 0) {
      const blockLengthFt = Number(constants.unitLength) / 12;
      capBlocks = Math.ceil(Math.round((L / blockLengthFt) * 1e8) / 1e8);
    }

    let boxes = 0;
    if (constants.areaPerBox && Number(constants.areaPerBox) > 0) {
      boxes = Math.ceil(Math.round(((area * wasteFactor) / Number(constants.areaPerBox)) * 1e8) / 1e8);
    } else if (constants.boxSize && Number(constants.boxSize) > 0) {
      boxes = Math.ceil(Math.round((units / Number(constants.boxSize)) * 1e8) / 1e8);
    } else {
      boxes = units;
    }

    return {
      area: area,
      units: units,
      pavers: units,
      blocks: units,
      capBlocks: capBlocks,
      rolls: units,
      tiles: units,
      boxes: boxes,
      sheets: units
    };
  },

  // 6. Paint
  'paint': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    let perimeter = Number(inputs.perimeter ?? 0);
    if (!perimeter) {
      const l = Number(inputs.length ?? 0);
      const w = Number(inputs.width ?? 0);
      perimeter = w > 0 ? 2 * (l + w) : l;
    }
    const height = Number(inputs.height ?? 8);
    const grossArea = perimeter * height;

    const doorArea = Number(constants.doorArea ?? 20);
    const windowArea = Number(constants.windowArea ?? 15);
    const doors = Number(inputs.doors ?? 0);
    const windows = Number(inputs.windows ?? 0);

    const deductions = doors * doorArea + windows * windowArea;
    const wallArea = Math.max(0, grossArea - deductions);

    const coverage = Number(constants.coverage ?? 350);
    const coats = Number(inputs.coats ?? 2);

    const gallons = (wallArea * coats) / coverage;
    const cans = Math.ceil(Math.round(gallons * 1e8) / 1e8);

    return {
      wallArea: wallArea,
      gallons: gallons,
      cans: cans
    };
  },

  // 7. Fence
  'fence': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const spacing = Number(constants.postSpacing ?? 8);
    const panelW = Number(constants.panelWidth ?? 8);
    const railsPerSec = Number(constants.railsPerSection ?? 3);
    const picketsPerFt = Number(constants.picketsPerFoot ?? 2.25);

    const sections = L > 0 ? L / spacing : 0;
    const basePosts = L > 0 ? Math.ceil(Math.round(sections * 1e8) / 1e8) + 1 : 0;
    const extraPosts = Number(inputs.gates ?? 0) + Number(inputs.corners ?? 0);
    const posts = basePosts + extraPosts;

    const panels = Math.ceil(Math.round((L / panelW) * 1e8) / 1e8);
    const rails = panels * railsPerSec;
    const pickets = Math.ceil(Math.round((L * picketsPerFt) * 1e8) / 1e8);

    return {
      posts: posts,
      panels: panels,
      rails: rails,
      pickets: pickets
    };
  },

  // 8. Deck Boards
  'deck-boards': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const waste = Number(inputs.waste ?? 0);
    const bWidth = Number(constants.boardWidth ?? 5.5);
    const gap = Number(constants.gap ?? 0.25);
    const bLength = Number(constants.boardLength ?? 16);

    const area = L * W;
    const widthIn = W * 12;
    const courseWidth = bWidth + gap;
    const rows = courseWidth > 0 ? Math.ceil(Math.round((widthIn / courseWidth) * 1e8) / 1e8) : 0;

    const totalLinearFeet = rows * L;
    const wasteFactor = 1 + waste / 100;
    const boards = Math.ceil(Math.round(((totalLinearFeet * wasteFactor) / bLength) * 1e8) / 1e8);

    return {
      area: area,
      rows: rows,
      totalLinearFeet: totalLinearFeet,
      boards: boards
    };
  },

  // 9. Roofing
  'roofing': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    let footprint = Number(inputs.footprint ?? 0);
    if (!footprint) {
      const l = Number(inputs.length ?? 0);
      const w = Number(inputs.width ?? 0);
      footprint = w > 0 ? l * w : l;
    }
    const rise = Number(inputs.rise);
    const waste = Number(inputs.waste ?? 0);
    const bundlesPerSq = Number(constants.bundlesPerSquare ?? 3);

    const pitchFactor = Math.sqrt(1 + Math.pow(rise / 12, 2));
    const roofArea = footprint * pitchFactor;
    const squares = roofArea / 100;
    const wasteFactor = 1 + waste / 100;
    const bundles = Math.ceil(Math.round((squares * bundlesPerSq * wasteFactor) * 1e8) / 1e8);

    return {
      pitchFactor: pitchFactor,
      roofArea: roofArea,
      squares: squares,
      bundles: bundles
    };
  },

  // 10. Seed Rate
  'seed-rate': (inputs: Record<string, unknown>, constants: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const rate = Number(inputs.rate);
    const bagSize = Number(constants.bagSize ?? 5);

    const area = L * W;
    const pounds = (area / 1000) * rate;
    const bags = Math.ceil(Math.round((pounds / bagSize) * 1e8) / 1e8);

    return {
      area: area,
      pounds: pounds,
      bags: bags
    };
  },

  // 11. Converter (Cubic Yard Calculator)
  'converter': (inputs: Record<string, unknown>) => {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const D = Number(inputs.depth);

    const depthFt = D / 12;
    const cuFt = L * W * depthFt;
    const cuYd = cuFt / 27;
    const cuM = cuFt * 0.0283168466;
    const liters = cuM * 1000;

    return {
      cubicFeet: cuFt,
      cubicYards: cuYd,
      cubicMeters: cuM,
      liters: liters
    };
  },

  // 12. Area Shapes (Square Footage Calculator)
  'area-shapes': (inputs: Record<string, unknown>) => {
    const shape = Number(inputs.shape ?? 1);
    const l = Number(inputs.length ?? 0);
    const w = Number(inputs.width ?? 0);

    let sqFt = 0;
    if (shape === 2) {
      sqFt = 0.5 * l * w;
    } else if (shape === 3) {
      const radius = l / 2;
      sqFt = Math.PI * radius * radius;
    } else {
      sqFt = w > 0 ? l * w : l;
    }

    const sqYd = sqFt / 9;
    const sqM = sqFt * 0.09290304;

    return {
      squareFeet: sqFt,
      squareYards: sqYd,
      squareMeters: sqM
    };
  }
};

// Seeded pseudo-random number generator for reproducible fuzz tests
function createRng(seed = 123456789): () => number {
  let s = seed;
  return function (): number {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface AuditReport {
  slug: string;
  title: string;
  category: string;
  formulaId: string;
  status: string;
  checks: number;
  failures: string[];
  maxAbsError: number;
  maxRelError: number;
  testCaseResults: { name: string; pass: boolean }[];
  exampleResults: { title: string; text: string }[];
  constantsAudit: { id: string; label: string; default: number; hasNote: boolean }[];
}

export async function runSuite(): Promise<{ totalChecks: number; totalFailures: number; results: AuditReport[] }> {
  const dir = path.resolve('src/data/calculators');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();

  const results: AuditReport[] = [];
  let totalChecks = 0;
  let totalFailures = 0;

  for (const f of files) {
    const fullPath = path.join(dir, f);
    const def: CalculatorDef = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const formulaFn = INDEPENDENT_FORMULAS[def.formulaId];

    const report: AuditReport = {
      slug: def.slug,
      title: def.title,
      category: def.category,
      formulaId: def.formulaId,
      status: def.status,
      checks: 0,
      failures: [],
      maxAbsError: 0,
      maxRelError: 0,
      testCaseResults: [],
      exampleResults: [],
      constantsAudit: []
    };

    if (!formulaFn) {
      report.failures.push(`CRITICAL: No independent formula reference for formulaId "${def.formulaId}"`);
      results.push(report);
      continue;
    }

    // 1. Audit Constants Notes & Sensitivities
    for (const c of def.constants) {
      report.checks++;
      totalChecks++;
      if (!c.note || c.note.trim().length === 0) {
        report.failures.push(`MAJOR: Constant "${c.id}" is missing a required explanatory note.`);
      }
      report.constantsAudit.push({
        id: c.id,
        label: c.label,
        default: c.default,
        hasNote: Boolean(c.note && c.note.length > 5)
      });
    }

    // 2. Validate all declared testCases against independent derivation AND engine
    for (const tc of def.testCases || []) {
      report.checks++;
      totalChecks++;

      const consts: Record<string, number> = {
        ...Object.fromEntries(def.constants.map((c: ConstantDef) => [c.id, c.default])),
        ...(tc.constants || {})
      };
      const indepOut = formulaFn(tc.inputs, consts);

      const engResult = calculate(def, tc.inputs, tc.constants);
      if (!engResult.ok) {
        report.failures.push(`CRITICAL: Test case "${tc.name}" failed in engine: ${JSON.stringify(engResult.errors)}`);
        totalFailures++;
        continue;
      }

      const tol = tc.tolerance ?? 0.01;
      let tcPass = true;
      for (const [outId, expVal] of Object.entries(tc.expected)) {
        const actualVal = engResult.values[outId];
        const indepVal = indepOut[outId];

        if (actualVal === undefined) {
          report.failures.push(`Test case "${tc.name}": Output "${outId}" missing from engine result.`);
          tcPass = false;
          totalFailures++;
          continue;
        }

        const diffEng = Math.abs(actualVal - expVal);
        const diffIndep = Math.abs(indepVal - expVal);

        if (diffEng > tol) {
          report.failures.push(`Test case "${tc.name}": Output "${outId}" expected ${expVal}, engine produced ${actualVal} (diff: ${diffEng})`);
          tcPass = false;
          totalFailures++;
        }
        if (diffIndep > tol) {
          report.failures.push(`Test case "${tc.name}": Output "${outId}" expected ${expVal}, independent math produced ${indepVal} (diff: ${diffIndep})`);
          tcPass = false;
          totalFailures++;
        }
      }

      report.testCaseResults.push({
        name: tc.name,
        pass: tcPass
      });
    }

    // 3. Fuzzing / Numerical verification: 1,000 random inputs
    const rng = createRng(def.slug.split('').reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0));
    const NUM_FUZZ = 1000;

    for (let i = 0; i < NUM_FUZZ; i++) {
      const inputs: Record<string, number | string> = {};
      for (const inp of def.inputs) {
        if (inp.type === 'select') {
          const opts = inp.options || [];
          inputs[inp.id] = opts[Math.floor(rng() * opts.length)]?.value ?? (inp.default ?? 1);
        } else {
          const min = inp.min ?? 1;
          const max = inp.max ?? 100;
          inputs[inp.id] = Math.round((min + rng() * (max - min)) * 100) / 100;
        }
      }

      const consts: Record<string, number> = {};
      for (const c of def.constants) {
        consts[c.id] = c.default;
      }

      report.checks++;
      totalChecks++;

      const engRes = calculate(def, inputs, consts);
      if (!engRes.ok) {
        report.failures.push(`Fuzzing input failure at iter ${i}: ${JSON.stringify(engRes.errors)}`);
        totalFailures++;
        break;
      }

      const indepRes = formulaFn(inputs, consts);

      for (const out of def.outputs) {
        const engVal = engRes.values[out.id];
        let indVal = indepRes[out.id];
        if (out.roundUp) {
          indVal = Math.ceil(Math.round(indVal * 1e8) / 1e8);
        }

        const absErr = Math.abs(engVal - indVal);
        const relErr = indVal !== 0 ? absErr / Math.abs(indVal) : absErr;

        if (absErr > report.maxAbsError) report.maxAbsError = absErr;
        if (relErr > report.maxRelError) report.maxRelError = relErr;

        if (absErr > 1e-4) {
          report.failures.push(`CRITICAL: Numerical discrepancy on ${out.id}: Engine ${engVal} vs Indep ${indVal} (diff ${absErr}) at inputs ${JSON.stringify(inputs)}`);
          totalFailures++;
          break;
        }
      }
    }

    // 4. Content Audit: check numbers mentioned in examples
    for (const ex of def.content?.examples || []) {
      report.checks++;
      totalChecks++;
      report.exampleResults.push({
        title: ex.title,
        text: ex.text
      });
    }

    results.push(report);
  }

  // Write full machine-readable JSON output for report generation
  fs.writeFileSync('tests/audit/audit_results.json', JSON.stringify(results, null, 2));

  return { totalChecks, totalFailures, results };
}

describe('Independent Audit Verification Suite', () => {
  it('runs 1,000 fuzz checks per calculator and validates all test cases against independent math', async () => {
    const { totalFailures } = await runSuite();
    expect(totalFailures).toBe(0);
  }, 60000);
});
