import { volumeBags } from './volume-bags.js';
import { volumeWeight } from './volume-weight.js';
import { concreteSlab } from './concrete-slab.js';
import { unitCount } from './unit-count.js';
import { seedRate } from './seed-rate.js';
import { paint } from './paint.js';
import { concreteCylinder } from './concrete-cylinder.js';
import { fence } from './fence.js';
import { deckBoards } from './deck-boards.js';
import { roofing } from './roofing.js';
import { converter } from './converter.js';
import { areaShapes } from './area-shapes.js';

export { volumeBags } from './volume-bags.js';
export { volumeWeight } from './volume-weight.js';
export { concreteSlab } from './concrete-slab.js';
export { unitCount } from './unit-count.js';
export { seedRate } from './seed-rate.js';
export { paint } from './paint.js';
export { concreteCylinder } from './concrete-cylinder.js';
export { fence } from './fence.js';
export { deckBoards } from './deck-boards.js';
export { roofing } from './roofing.js';
export { converter } from './converter.js';
export { areaShapes } from './area-shapes.js';

export type FormulaFunction = (
  inputs: Record<string, number>,
  constants: Record<string, number>,
) => Record<string, number>;

export const FORMULAS: Record<string, FormulaFunction> = {
  'volume-bags': volumeBags as unknown as FormulaFunction,
  'volume-weight': volumeWeight as unknown as FormulaFunction,
  'concrete-slab': concreteSlab as unknown as FormulaFunction,
  'unit-count': unitCount as unknown as FormulaFunction,
  'seed-rate': seedRate as unknown as FormulaFunction,
  paint: paint as unknown as FormulaFunction,
  'concrete-cylinder': concreteCylinder as unknown as FormulaFunction,
  fence: fence as unknown as FormulaFunction,
  'deck-boards': deckBoards as unknown as FormulaFunction,
  roofing: roofing as unknown as FormulaFunction,
  converter: converter as unknown as FormulaFunction,
  'area-shapes': areaShapes as unknown as FormulaFunction,
};
