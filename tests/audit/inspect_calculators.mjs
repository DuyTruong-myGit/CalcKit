import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/calculators';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();

console.log(`Found ${files.length} calculator JSON files:`);
for (const f of files) {
  const fullPath = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  console.log(`\n=== ${data.slug} ===`);
  console.log(`Title: ${data.title}`);
  console.log(`Category: ${data.category} | FormulaId: ${data.formulaId} | Status: ${data.status}`);
  console.log(`Inputs:`, data.inputs.map(i => `${i.id} (${i.unit}, default: ${i.default}, min: ${i.min}, max: ${i.max})`));
  console.log(`Constants:`, data.constants.map(c => `${c.id} (default: ${c.default}, note: "${c.note}")`));
  console.log(`Outputs:`, data.outputs.map(o => `${o.id} (unit: ${o.unit}, dec: ${o.decimals}, roundUp: ${o.roundUp}, primary: ${o.primary})`));
  console.log(`TestCases: ${data.testCases?.length || 0}`);
  for (const tc of data.testCases || []) {
    console.log(`  - [${tc.name}] inputs: ${JSON.stringify(tc.inputs)} -> expected: ${JSON.stringify(tc.expected)}`);
  }
  console.log(`Examples in content: ${data.content?.examples?.length || 0}`);
  for (const ex of data.content?.examples || []) {
    console.log(`  Example: "${ex.title}"\n    Text: ${ex.text}`);
  }
  if (data.content?.quickReference) {
    console.log(`QuickReference Caption: ${data.content.quickReference.caption}`);
    console.log(`Headers: ${JSON.stringify(data.content.quickReference.headers)}`);
    console.log(`Rows: ${data.content.quickReference.rows.length}`);
  }
}
