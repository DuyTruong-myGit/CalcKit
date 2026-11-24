/**
 * formula: deck-boards
 * Used by: deck-board-calculator
 *
 * Inputs:
 *   length – ft (dimension parallel to deck boards)
 *   width  – ft (dimension perpendicular to deck boards)
 *   waste  – pct (default 10)
 *
 * Constants:
 *   boardWidth  – in (e.g. 5.5 for 5/4x6 or 2x6)
 *   gap         – in (spacing between boards, default 0.25)
 *   boardLength – ft (nominal lumber length, default 16)
 *
 * Outputs:
 *   boards          – count of deck boards to buy (rounded up)
 *   totalLinearFeet – total linear footage of decking
 *   rows            – number of board courses across deck width
 *   area            – total deck surface area in sq ft
 *
 * Source: docs/FORMULAS.md lines 56-57
 * rows = ceil(width_in / (boardWidth + gap))
 * totalLinearFt = rows × L
 * boards = ceil(totalLinearFt × (1 + waste/100) / boardLength)
 */

import { pctToFactor, ceilWhole } from '../units.js';

export interface DeckBoardsInputs {
  length: number;
  width: number;
  waste?: number;
}

export interface DeckBoardsConstants {
  boardWidth?: number;  // inches, default 5.5
  gap?: number;         // inches, default 0.25
  boardLength?: number; // feet, default 16
}

export interface DeckBoardsOutputs {
  boards: number;
  totalLinearFeet: number;
  rows: number;
  area: number;
}

export function deckBoards(
  inputs: DeckBoardsInputs,
  constants: DeckBoardsConstants,
): DeckBoardsOutputs {
  const area = inputs.length * inputs.width;
  const bWidth = constants.boardWidth && constants.boardWidth > 0 ? constants.boardWidth : 5.5;
  const gap = constants.gap !== undefined && constants.gap >= 0 ? constants.gap : 0.25;
  const bLength = constants.boardLength && constants.boardLength > 0 ? constants.boardLength : 16;

  // Deck width in inches
  const widthInches = inputs.width * 12;
  const courseWidth = bWidth + gap;
  const rows = courseWidth > 0 ? ceilWhole(widthInches / courseWidth) : 0;

  const totalLinearFeet = rows * inputs.length;
  const wasteFactor = 1 + pctToFactor(inputs.waste ?? 0);
  const boards = ceilWhole((totalLinearFeet * wasteFactor) / bLength);

  return {
    boards,
    totalLinearFeet,
    rows,
    area,
  };
}