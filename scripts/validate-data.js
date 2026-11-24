#!/usr/bin/env node
/**
 * validate-data.js
 * Reads every JSON file in src/data/calculators/ and validates it against
 * the schema defined in docs/CALCULATOR_SCHEMA.md.
 *
 * Exit 0 → all files valid
 * Exit 1 → one or more files have errors
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'src', 'data', 'calculators');

// Dynamic import so the script works without a build step (uses tsx/ts-node or
// native Node ESM with --experimental-strip-types in Node ≥ 22, or the .js
// compiled output). We import the .ts source via the ts alias set in
// scripts/validate-data.js using node --import tsx.
const { validateCalculator } = await import('../src/lib/schema/validator.ts');

// ── Collect all JSON files ────────────────────────────────────────────────────

let files;
try {
  files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
} catch {
  console.error(`\nNo calculator data found at ${DATA_DIR}`);
  console.error('Create at least one JSON file in src/data/calculators/ to run validation.\n');
  process.exit(0); // Not an error — TASK-06 adds the first real files
}

if (files.length === 0) {
  console.log('\nNo JSON files in src/data/calculators/ — nothing to validate.\n');
  process.exit(0);
}

// ── First pass: collect all slugs (for related-slug cross-check) ──────────────

// The 20 valid calculator slugs defined in docs/SPEC.md and docs/FORMULAS.md
const PLANNED_SLUGS = [
  'mulch-calculator',
  'gravel-calculator',
  'topsoil-calculator',
  'sand-calculator',
  'raised-bed-soil-calculator',
  'concrete-slab-calculator',
  'concrete-post-hole-calculator',
  'paver-calculator',
  'retaining-wall-block-calculator',
  'sod-calculator',
  'grass-seed-calculator',
  'paint-calculator',
  'flooring-calculator',
  'tile-calculator',
  'drywall-calculator',
  'fence-calculator',
  'deck-board-calculator',
  'roofing-calculator',
  'cubic-yard-calculator',
  'square-footage-calculator',
];

const knownSlugs = new Set(PLANNED_SLUGS);
for (const file of files) {
  try {
    const raw = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8'));
    if (typeof raw?.slug === 'string') {
      knownSlugs.add(raw.slug);
    }
  } catch {
    // Parse error caught in second pass
  }
}

// ── Second pass: validate each file ──────────────────────────────────────────

let totalErrors = 0;
let totalFiles = 0;

for (const file of files) {
  totalFiles++;
  let raw;
  try {
    raw = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8'));
  } catch (err) {
    console.error(`\n✗  ${file}`);
    console.error(`   JSON parse error: ${err.message}`);
    totalErrors++;
    continue;
  }

  const { slug, errors } = validateCalculator(raw, knownSlugs);

  if (errors.length === 0) {
    console.log(`✓  ${basename(file)}  (${slug})`);
  } else {
    console.error(`\n✗  ${basename(file)}  (${slug})`);
    for (const e of errors) {
      console.error(`     • ${e}`);
    }
    totalErrors += errors.length;
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('');
if (totalErrors === 0) {
  console.log(`All ${totalFiles} file(s) passed validation.\n`);
  process.exit(0);
} else {
  console.error(`Validation failed: ${totalErrors} error(s) across ${totalFiles} file(s).\n`);
  process.exit(1);
}
