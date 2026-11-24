/**
 * formula: area-shapes
 * Used by: square-footage-calculator
 *
 * Computes surface area for rectangles, triangles, and circles,
 * converting between sq ft, sq yards, and sq meters.
 *
 * Inputs:
 *   length – ft (Length for rectangle, Base for triangle, Diameter for circle)
 *   width  – ft (Width for rectangle, Height for triangle, unused for circle)
 *   shape  – 1 = rectangle, 2 = triangle, 3 = circle (default 1)
 *
 * Outputs:
 *   squareFeet   – sq ft (primary)
 *   squareYards  – sq yd
 *   squareMeters – m²
 *
 * Source: docs/FORMULAS.md lines 65-66
 */

export interface AreaShapesInputs {
  length: number;
  width?: number;
  shape?: number;
}

export interface AreaShapesOutputs {
  squareFeet: number;
  squareYards: number;
  squareMeters: number;
}

export function areaShapes(
  inputs: AreaShapesInputs,
): AreaShapesOutputs {
  const shape = inputs.shape ?? 1;
  const l = inputs.length ?? 0;
  const w = inputs.width ?? 0;

  let squareFeet = 0;

  if (shape === 2) {
    // Triangle: 1/2 × base × height
    squareFeet = 0.5 * l * w;
  } else if (shape === 3) {
    // Circle: l is diameter -> radius = l / 2
    const radius = l / 2;
    squareFeet = Math.PI * radius * radius;
  } else {
    // Rectangle: length × width (if width=0, treats length as direct area)
    squareFeet = w > 0 ? l * w : l;
  }

  const squareYards = squareFeet / 9;
  const squareMeters = squareFeet * 0.09290304;

  return {
    squareFeet,
    squareYards,
    squareMeters,
  };
}