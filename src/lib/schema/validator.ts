// Validates a parsed JSON object against the CalculatorDef schema.
// Returns a list of human-readable error strings; empty array means valid.
// knownSlugs: set of all slugs that exist in src/data/calculators/ (for related check).

const VALID_STATUSES = new Set(['draft', 'reviewed']);
const VALID_CATEGORIES = new Set([
  'landscaping',
  'concrete-masonry',
  'painting-flooring',
  'structures-roofing',
  'utilities',
]);
const VALID_UNITS = new Set([
  'ft', 'in', 'yd', 'ft2', 'count', 'pct', 'lb', 'none',
]);
const VALID_INPUT_TYPES = new Set(['number', 'select']);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export interface ValidationResult {
  slug: string;
  errors: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateCalculator(raw: any, knownSlugs: ReadonlySet<string>): ValidationResult {
  const errors: string[] = [];
  const slug: string = typeof raw?.slug === 'string' ? raw.slug : '(unknown)';

  // ── Top-level string fields ───────────────────────────────────────────────
  if (typeof raw?.slug !== 'string' || !SLUG_RE.test(raw.slug)) {
    errors.push(`slug: must be a lowercase hyphen-separated string, got ${JSON.stringify(raw?.slug)}`);
  }

  if (!VALID_STATUSES.has(raw?.status)) {
    errors.push(`status: must be "draft" or "reviewed", got ${JSON.stringify(raw?.status)}`);
  }

  if (!VALID_CATEGORIES.has(raw?.category)) {
    errors.push(`category: must be one of ${[...VALID_CATEGORIES].join(', ')}, got ${JSON.stringify(raw?.category)}`);
  }

  if (typeof raw?.formulaId !== 'string' || raw.formulaId.trim() === '') {
    errors.push(`formulaId: must be a non-empty string`);
  }

  if (typeof raw?.title !== 'string' || raw.title.trim() === '') {
    errors.push(`title: must be a non-empty string`);
  }

  if (typeof raw?.metaTitle !== 'string' || raw.metaTitle.trim() === '') {
    errors.push(`metaTitle: must be a non-empty string`);
  } else if (raw.metaTitle.length > 60) {
    errors.push(`metaTitle: must be 60 characters or fewer (got ${raw.metaTitle.length})`);
  }

  if (typeof raw?.metaDescription !== 'string' || raw.metaDescription.trim() === '') {
    errors.push(`metaDescription: must be a non-empty string`);
  } else if (raw.metaDescription.length > 155) {
    errors.push(`metaDescription: must be 155 characters or fewer (got ${raw.metaDescription.length})`);
  }

  if (typeof raw?.updatedAt !== 'string' || !ISO_DATE_RE.test(raw.updatedAt)) {
    errors.push(`updatedAt: must be an ISO date string (YYYY-MM-DD), got ${JSON.stringify(raw?.updatedAt)}`);
  }

  // ── inputs ────────────────────────────────────────────────────────────────
  if (!Array.isArray(raw?.inputs) || raw.inputs.length === 0) {
    errors.push(`inputs: must be a non-empty array`);
  } else {
    (raw.inputs as unknown[]).forEach((inp: unknown, i: number) => {
      const prefix = `inputs[${i}]`;
      if (typeof (inp as Record<string, unknown>)?.id !== 'string') {
        errors.push(`${prefix}.id: must be a string`);
      }
      if (typeof (inp as Record<string, unknown>)?.label !== 'string') {
        errors.push(`${prefix}.label: must be a string`);
      }
      if (!VALID_UNITS.has((inp as Record<string, unknown>)?.unit as string)) {
        errors.push(`${prefix}.unit: must be one of ${[...VALID_UNITS].join(', ')}, got ${JSON.stringify((inp as Record<string, unknown>)?.unit)}`);
      }
      if (!VALID_INPUT_TYPES.has((inp as Record<string, unknown>)?.type as string)) {
        errors.push(`${prefix}.type: must be "number" or "select", got ${JSON.stringify((inp as Record<string, unknown>)?.type)}`);
      }
      if ((inp as Record<string, unknown>)?.type === 'select' && !Array.isArray((inp as Record<string, unknown>)?.options)) {
        errors.push(`${prefix}.options: required when type is "select"`);
      }
    });
  }

  // ── constants ─────────────────────────────────────────────────────────────
  if (!Array.isArray(raw?.constants)) {
    errors.push(`constants: must be an array`);
  } else {
    (raw.constants as unknown[]).forEach((c: unknown, i: number) => {
      const prefix = `constants[${i}]`;
      if (typeof (c as Record<string, unknown>)?.id !== 'string') {
        errors.push(`${prefix}.id: must be a string`);
      }
      if (typeof (c as Record<string, unknown>)?.label !== 'string') {
        errors.push(`${prefix}.label: must be a string`);
      }
      if (typeof (c as Record<string, unknown>)?.default !== 'number') {
        errors.push(`${prefix}.default: must be a number`);
      }
      // ★ Rule: every constant must have a non-empty note
      if (typeof (c as Record<string, unknown>)?.note !== 'string' || ((c as Record<string, unknown>).note as string).trim() === '') {
        errors.push(`${prefix}.note: required — must explain that this is a typical value and where to verify it`);
      }
    });
  }

  // ── outputs ───────────────────────────────────────────────────────────────
  if (!Array.isArray(raw?.outputs) || raw.outputs.length === 0) {
    errors.push(`outputs: must be a non-empty array`);
  } else {
    const primaryCount = (raw.outputs as unknown[]).filter(
      (o: unknown) => (o as Record<string, unknown>)?.primary === true,
    ).length;
    // ★ Rule: exactly one primary output
    if (primaryCount === 0) {
      errors.push(`outputs: exactly one output must have primary: true (found none)`);
    } else if (primaryCount > 1) {
      errors.push(`outputs: exactly one output must have primary: true (found ${primaryCount})`);
    }

    (raw.outputs as unknown[]).forEach((o: unknown, i: number) => {
      const prefix = `outputs[${i}]`;
      if (typeof (o as Record<string, unknown>)?.id !== 'string') {
        errors.push(`${prefix}.id: must be a string`);
      }
      if (typeof (o as Record<string, unknown>)?.label !== 'string') {
        errors.push(`${prefix}.label: must be a string`);
      }
      if (typeof (o as Record<string, unknown>)?.unit !== 'string') {
        errors.push(`${prefix}.unit: must be a string`);
      }
      if (typeof (o as Record<string, unknown>)?.decimals !== 'number') {
        errors.push(`${prefix}.decimals: must be a number`);
      }
    });
  }

  // ── testCases ─────────────────────────────────────────────────────────────
  if (!Array.isArray(raw?.testCases)) {
    errors.push(`testCases: must be an array`);
  } else {
    // ★ Rule: at least 3 test cases
    if (raw.testCases.length < 3) {
      errors.push(`testCases: must have at least 3 entries (found ${raw.testCases.length})`);
    }
    (raw.testCases as unknown[]).forEach((tc: unknown, i: number) => {
      const prefix = `testCases[${i}]`;
      if (typeof (tc as Record<string, unknown>)?.name !== 'string') {
        errors.push(`${prefix}.name: must be a string`);
      }
      if (typeof (tc as Record<string, unknown>)?.inputs !== 'object' || (tc as Record<string, unknown>).inputs === null) {
        errors.push(`${prefix}.inputs: must be an object`);
      }
      if (typeof (tc as Record<string, unknown>)?.expected !== 'object' || (tc as Record<string, unknown>).expected === null) {
        errors.push(`${prefix}.expected: must be an object`);
      }
    });
  }

  // ── content ───────────────────────────────────────────────────────────────
  const content = raw?.content;
  if (typeof content !== 'object' || content === null) {
    errors.push(`content: must be an object`);
  } else {
    if (typeof content.intro !== 'string' || content.intro.trim() === '') {
      errors.push(`content.intro: must be a non-empty string`);
    } else {
      const wc = wordCount(content.intro);
      if (wc < 80 || wc > 120) {
        errors.push(`content.intro: must be 80–120 words (got ${wc})`);
      }
    }

    if (typeof content.howItWorks !== 'string' || content.howItWorks.trim() === '') {
      errors.push(`content.howItWorks: must be a non-empty string`);
    }

    if (!Array.isArray(content.examples) || content.examples.length < 1 || content.examples.length > 2) {
      errors.push(`content.examples: must have 1 or 2 items`);
    }

    if (!Array.isArray(content.commonMistakes) || content.commonMistakes.length < 3 || content.commonMistakes.length > 5) {
      errors.push(`content.commonMistakes: must have 3–5 items`);
    }

    if (!Array.isArray(content.faq) || content.faq.length < 4 || content.faq.length > 5) {
      errors.push(`content.faq: must have 4–5 items`);
    }
  }

  // ── related ───────────────────────────────────────────────────────────────
  if (!Array.isArray(raw?.related)) {
    errors.push(`related: must be an array`);
  } else {
    if (raw.related.length < 3 || raw.related.length > 4) {
      errors.push(`related: must have 3–4 slugs (found ${raw.related.length})`);
    }
    // ★ Rule: all related slugs must exist in knownSlugs (excluding self)
    (raw.related as unknown[]).forEach((r: unknown) => {
      if (typeof r !== 'string') {
        errors.push(`related: each entry must be a string`);
      } else if (!knownSlugs.has(r)) {
        errors.push(`related: unknown slug "${r}" — no matching file in src/data/calculators/`);
      }
    });
  }

  return { slug, errors };
}
