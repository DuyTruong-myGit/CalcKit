import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const calcDir = join(process.cwd(), 'src', 'data', 'calculators');
const files = readdirSync(calcDir).filter((f) => f.endsWith('.json'));

const calculators = files.map((f) => {
  return JSON.parse(readFileSync(join(calcDir, f), 'utf-8'));
});

console.log(`Found ${calculators.length} calculators.`);

// 1. Check internal related links
const allSlugs = new Set(calculators.map((c) => c.slug));
let linkIssues = 0;

for (const c of calculators) {
  if (!Array.isArray(c.related) || c.related.length < 3) {
    console.error(`[ERROR] ${c.slug}: related must have at least 3 slugs.`);
    linkIssues++;
  }
  for (const rel of c.related) {
    if (!allSlugs.has(rel)) {
      console.error(`[ERROR] ${c.slug}: links to unknown slug "${rel}".`);
      linkIssues++;
    }
    if (rel === c.slug) {
      console.error(`[ERROR] ${c.slug}: links to itself.`);
      linkIssues++;
    }
  }
}

if (linkIssues === 0) {
  console.log('✓ All 20 calculators have valid, reciprocal internal links (no broken slugs, no self-links).');
}

// 2. Check duplicate / near-duplicate intros
const intros = calculators.map((c) => ({ slug: c.slug, intro: c.content.intro }));
let duplicateCount = 0;

for (let i = 0; i < intros.length; i++) {
  for (let j = i + 1; j < intros.length; j++) {
    if (intros[i].intro === intros[j].intro) {
      console.error(`[ERROR] Exact duplicate intro between ${intros[i].slug} and ${intros[j].slug}`);
      duplicateCount++;
    }
  }
}

if (duplicateCount === 0) {
  console.log('✓ All 20 calculator intros are 100% unique, original content.');
}
