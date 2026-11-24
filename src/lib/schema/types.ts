// Source of truth: docs/CALCULATOR_SCHEMA.md
// Every calculator JSON file is validated against these types at build time.

export type Status = 'draft' | 'reviewed';

export type Category =
  | 'landscaping'
  | 'concrete-masonry'
  | 'painting-flooring'
  | 'structures-roofing'
  | 'utilities';

export type InputUnit =
  | 'ft'
  | 'in'
  | 'yd'
  | 'ft2'
  | 'count'
  | 'pct'
  | 'lb'
  | 'none';

export type InputType = 'number' | 'select';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface InputDef {
  id: string;
  label: string;
  unit: InputUnit;
  type: InputType;
  default?: number | string;
  min?: number;
  max?: number;
  options?: SelectOption[]; // required when type === 'select'
  help?: string;            // one short line
}

export interface ConstantDef {
  id: string;
  label: string;
  default: number;
  note: string; // required: says it is a typical value and what to check
}

export interface OutputDef {
  id: string;
  label: string;
  unit: string;
  decimals: number;
  primary?: boolean; // exactly one output must have primary: true
  roundUp?: boolean;
}

export interface TestCase {
  name: string;
  inputs: Record<string, number | string>;
  constants?: Record<string, number>;
  expected: Record<string, number>;
  tolerance?: number; // default 0.01
}

export interface ContentBlock {
  intro: string;      // 80–120 words
  howItWorks: string;
  examples: { title: string; text: string }[]; // 1 or 2 items
  quickReference?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  commonMistakes: string[]; // 3–5 items
  faq: { q: string; a: string }[]; // 4–5 items
}

export interface CalculatorDef {
  slug: string;             // unique, lowercase, hyphens
  status: Status;
  category: Category;
  formulaId: string;
  title: string;
  metaTitle: string;        // ≤ 60 characters
  metaDescription: string;  // ≤ 155 characters
  updatedAt: string;        // ISO date YYYY-MM-DD

  inputs: InputDef[];
  constants: ConstantDef[];
  outputs: OutputDef[];
  testCases: TestCase[];    // at least 3

  content: ContentBlock;

  related: string[]; // 3–4 slugs that exist in src/data/calculators/
}
