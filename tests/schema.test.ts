import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateCalculator } from '../src/lib/schema/validator.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const FIXTURES = join(import.meta.dirname, 'fixtures');

function loadFixture(relativePath: string): unknown {
  const raw = readFileSync(join(FIXTURES, relativePath), 'utf-8');
  return JSON.parse(raw);
}

/**
 * The set of slugs that "exist" for the purposes of related-slug validation.
 * We include the slugs from all fixture files so the valid fixture passes.
 */
const KNOWN_SLUGS: ReadonlySet<string> = new Set([
  'mulch-calculator',
  'gravel-calculator',
  'topsoil-calculator',
  'raised-bed-soil-calculator',
  'sand-calculator',
]);

// ── Valid fixture ─────────────────────────────────────────────────────────────

describe('validateCalculator — valid fixture', () => {
  it('passes mulch-calculator with zero errors', () => {
    const data = loadFixture('valid/mulch-calculator.json');
    const { errors } = validateCalculator(data, KNOWN_SLUGS);
    expect(errors).toEqual([]);
  });
});

// ── Invalid fixtures — one test per broken rule ───────────────────────────────

describe('validateCalculator — invalid fixtures', () => {
  it('rejects a constant that is missing the required note field', () => {
    const data = loadFixture('invalid/missing-note.json');
    const { errors } = validateCalculator(data, KNOWN_SLUGS);

    const noteErrors = errors.filter((e) => e.includes('.note:'));
    expect(noteErrors.length).toBeGreaterThanOrEqual(1);
    // Message must guide the author to fix it
    expect(noteErrors[0]).toMatch(/required/i);
  });

  it('rejects a file with fewer than 3 test cases', () => {
    const data = loadFixture('invalid/too-few-test-cases.json');
    const { errors } = validateCalculator(data, KNOWN_SLUGS);

    const tcErrors = errors.filter((e) => e.startsWith('testCases:'));
    expect(tcErrors.length).toBeGreaterThanOrEqual(1);
    expect(tcErrors[0]).toMatch(/at least 3/i);
  });

  it('rejects a file whose related list contains a slug that does not exist', () => {
    const data = loadFixture('invalid/unknown-related-slug.json');
    const { errors } = validateCalculator(data, KNOWN_SLUGS);

    const relatedErrors = errors.filter((e) => e.includes('nonexistent-calculator'));
    expect(relatedErrors.length).toBeGreaterThanOrEqual(1);
    expect(relatedErrors[0]).toMatch(/unknown slug/i);
  });

  it('rejects a file whose outputs have no primary: true', () => {
    const data = loadFixture('invalid/no-primary-output.json');
    const { errors } = validateCalculator(data, KNOWN_SLUGS);

    const primaryErrors = errors.filter((e) => e.includes('primary'));
    expect(primaryErrors.length).toBeGreaterThanOrEqual(1);
    expect(primaryErrors[0]).toMatch(/primary: true/i);
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('validateCalculator — edge cases', () => {
  it('reports all errors, not just the first one', () => {
    // Completely empty object should produce many errors
    const { errors } = validateCalculator({}, KNOWN_SLUGS);
    expect(errors.length).toBeGreaterThan(5);
  });

  it('reports metaTitle > 60 chars', () => {
    const data = loadFixture('valid/mulch-calculator.json');
    (data as Record<string, unknown>).metaTitle = 'A'.repeat(61);
    const { errors } = validateCalculator(data, KNOWN_SLUGS);
    expect(errors.some((e) => e.includes('metaTitle'))).toBe(true);
  });

  it('reports metaDescription > 155 chars', () => {
    const data = loadFixture('valid/mulch-calculator.json');
    (data as Record<string, unknown>).metaDescription = 'B'.repeat(156);
    const { errors } = validateCalculator(data, KNOWN_SLUGS);
    expect(errors.some((e) => e.includes('metaDescription'))).toBe(true);
  });

  it('reports invalid status value', () => {
    const data = loadFixture('valid/mulch-calculator.json');
    (data as Record<string, unknown>).status = 'published';
    const { errors } = validateCalculator(data, KNOWN_SLUGS);
    expect(errors.some((e) => e.startsWith('status:'))).toBe(true);
  });

  it('reports invalid category value', () => {
    const data = loadFixture('valid/mulch-calculator.json');
    (data as Record<string, unknown>).category = 'garden';
    const { errors } = validateCalculator(data, KNOWN_SLUGS);
    expect(errors.some((e) => e.startsWith('category:'))).toBe(true);
  });

  it('slug must be used as the validation result identifier', () => {
    const data = loadFixture('valid/mulch-calculator.json');
    const { slug } = validateCalculator(data, KNOWN_SLUGS);
    expect(slug).toBe('mulch-calculator');
  });

  it('uses "(unknown)" slug when slug field is missing', () => {
    const { slug } = validateCalculator({}, KNOWN_SLUGS);
    expect(slug).toBe('(unknown)');
  });
});
