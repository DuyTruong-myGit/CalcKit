# CALCULATOR_SCHEMA: one JSON file per calculator

Files live in `src/data/calculators/<slug>.json`. The page, the tool, the tests and the sitemap are all generated from this file. `npm run validate:data` must reject any file that breaks this schema.

## TypeScript shape

```ts
type Status = "draft" | "reviewed";

interface CalculatorDef {
  slug: string;                 // "mulch-calculator", lowercase, hyphens, unique
  status: Status;               // only the owner sets "reviewed"
  category: "landscaping" | "concrete-masonry" | "painting-flooring" | "structures-roofing" | "utilities";
  formulaId: string;            // key in src/lib/calc/formulas, see docs/FORMULAS.md
  title: string;                // H1
  metaTitle: string;            // 60 characters or fewer
  metaDescription: string;      // 155 characters or fewer
  updatedAt: string;            // ISO date, set by the owner when content is reviewed

  inputs: InputDef[];
  constants: ConstantDef[];     // editable assumptions, shown under "Adjust assumptions"
  outputs: OutputDef[];
  testCases: TestCase[];        // at least 3

  content: {
    intro: string;              // 80 to 120 words
    howItWorks: string;         // formula in words and numbers
    examples: { title: string; text: string }[];       // 1 or 2, with real numbers
    quickReference?: { caption: string; headers: string[]; rows: string[][] };
    commonMistakes: string[];   // 3 to 5 items
    faq: { q: string; a: string }[];                   // 4 or 5 items
  };

  related: string[];            // 3 or 4 slugs that exist
}

interface InputDef {
  id: string;                   // "length"
  label: string;                // "Length"
  unit: "ft" | "in" | "yd" | "ft2" | "count" | "pct" | "lb" | "none";
  type: "number" | "select";
  default?: number | string;
  min?: number;
  max?: number;
  options?: { value: string | number; label: string }[];  // for select
  help?: string;                // one short line
}

interface ConstantDef {
  id: string;                   // "density"
  label: string;                // "Density (tons per cubic yard)"
  default: number;
  note: string;                 // required: says it is a typical value and what to check
}

interface OutputDef {
  id: string;                   // "cubicYards"
  label: string;
  unit: string;
  decimals: number;
  primary?: boolean;            // exactly one primary output
  roundUp?: boolean;            // show ceiling for whole-unit items
}

interface TestCase {
  name: string;
  inputs: Record<string, number | string>;
  constants?: Record<string, number>;
  expected: Record<string, number>;   // output id to value, hand-calculated
  tolerance?: number;                 // default 0.01
}
```

## Example (abbreviated; text fields are placeholders for the agent to draft)

```json
{
  "slug": "mulch-calculator",
  "status": "draft",
  "category": "landscaping",
  "formulaId": "volume-bags",
  "title": "Mulch Calculator",
  "metaTitle": "Mulch Calculator: How Many Bags or Yards You Need",
  "metaDescription": "Enter the size of your bed and mulch depth to get cubic yards and the number of bags. Includes a waste allowance you can adjust.",
  "updatedAt": "2026-11-24",
  "inputs": [
    { "id": "length", "label": "Length", "unit": "ft", "type": "number", "default": 10, "min": 0 },
    { "id": "width", "label": "Width", "unit": "ft", "type": "number", "default": 10, "min": 0 },
    { "id": "depth", "label": "Depth", "unit": "in", "type": "number", "default": 3, "min": 0, "help": "Most beds use 2 to 3 inches." },
    { "id": "waste", "label": "Extra for waste", "unit": "pct", "type": "number", "default": 10, "min": 0, "max": 50 }
  ],
  "constants": [
    { "id": "bagSize", "label": "Bag size (cubic feet)", "default": 2, "note": "Typical retail bag. Check the size printed on the bag you plan to buy." }
  ],
  "outputs": [
    { "id": "cubicYards", "label": "Cubic yards", "unit": "yd³", "decimals": 2, "primary": true },
    { "id": "cubicFeet", "label": "Cubic feet", "unit": "ft³", "decimals": 1 },
    { "id": "bags", "label": "Bags needed", "unit": "bags", "decimals": 0, "roundUp": true }
  ],
  "testCases": [
    {
      "name": "10 x 10 ft at 3 in, no waste, 2 ft3 bags",
      "inputs": { "length": 10, "width": 10, "depth": 3, "waste": 0 },
      "constants": { "bagSize": 2 },
      "expected": { "cubicFeet": 25, "cubicYards": 0.9259, "bags": 13 }
    }
  ],
  "content": {
    "intro": "DRAFT: ...",
    "howItWorks": "DRAFT: ...",
    "examples": [{ "title": "A 10 by 10 foot bed", "text": "DRAFT: ..." }],
    "commonMistakes": ["DRAFT: ..."],
    "faq": [{ "q": "How deep should mulch be?", "a": "DRAFT: ..." }]
  },
  "related": ["gravel-calculator", "topsoil-calculator", "raised-bed-soil-calculator"]
}
```

Notes:
- Output values in `expected` are the unrounded result unless the output has `roundUp: true`, in which case they are the rounded-up value.
- Fields marked `DRAFT:` are placeholders. The agent writes real drafts following `docs/CONTENT_GUIDE.md`, keeps `status` as `draft`, and the owner reviews before changing it.
- Never put numbers in `content` that are not derived from the formula, constants or examples in this repo.
