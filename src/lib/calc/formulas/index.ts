import { volumeBags } from './volume-bags.js';
import { volumeWeight } from './volume-weight.js';
import { concreteSlab } from './concrete-slab.js';
import { unitCount } from './unit-count.js';

export { volumeBags } from './volume-bags.js';
export { volumeWeight } from './volume-weight.js';
export { concreteSlab } from './concrete-slab.js';
export { unitCount } from './unit-count.js';

export type FormulaFunction = (
  inputs: Record<string, number>,
  constants: Record<string, number>,
) => Record<string, number>;

export const FORMULAS: Record<string, FormulaFunction> = {
  'volume-bags': volumeBags as unknown as FormulaFunction,
  'volume-weight': volumeWeight as unknown as FormulaFunction,
  'concrete-slab': concreteSlab as unknown as FormulaFunction,
  'unit-count': unitCount as unknown as FormulaFunction,
};
