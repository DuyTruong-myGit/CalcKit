/**
 * units.ts
 * Pure unit-conversion helpers. No DOM, no network, no side effects.
 * Source of truth for all conversion constants: docs/FORMULAS.md
 */

// ── Base conversion constants ─────────────────────────────────────────────────

/** Cubic feet per cubic yard */
export const FT3_PER_YD3 = 27;

/** Cubic feet per cubic meter */
export const FT3_PER_M3 = 35.3147;

/** Cubic yards per cubic meter */
export const YD3_PER_M3 = 1.308;

/** Feet per inch */
export const FT_PER_IN = 1 / 12;

/** Feet per yard */
export const FT_PER_YD = 3;

// ── Scalar converters ─────────────────────────────────────────────────────────

/** Convert inches to feet. */
export function inToFt(inches: number): number {
  return inches / 12;
}

/** Convert yards to feet. */
export function ydToFt(yards: number): number {
  return yards * 3;
}

/** Convert feet to inches. */
export function ftToIn(feet: number): number {
  return feet * 12;
}

/** Convert feet to yards. */
export function ftToYd(feet: number): number {
  return feet / 3;
}

/** Convert cubic feet to cubic yards. */
export function ft3ToYd3(cubicFeet: number): number {
  return cubicFeet / FT3_PER_YD3;
}

/** Convert cubic yards to cubic feet. */
export function yd3ToFt3(cubicYards: number): number {
  return cubicYards * FT3_PER_YD3;
}

/** Convert cubic feet to cubic meters. */
export function ft3ToM3(cubicFeet: number): number {
  return cubicFeet / FT3_PER_M3;
}

/** Convert cubic meters to cubic feet. */
export function m3ToFt3(cubicMeters: number): number {
  return cubicMeters * FT3_PER_M3;
}

/** Convert cubic meters to cubic yards. */
export function m3ToYd3(cubicMeters: number): number {
  return cubicMeters * YD3_PER_M3;
}

/** Convert a percentage value (e.g. 10 for 10%) to a multiplier (e.g. 0.10). */
export function pctToFactor(pct: number): number {
  return pct / 100;
}

// ── Rounding helpers ──────────────────────────────────────────────────────────

/** Round to a given number of decimal places. */
export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Round up to the nearest whole number (for whole-unit purchases), guarding against IEEE-754 float artifacts. */
export function ceilWhole(value: number): number {
  return Math.ceil(Math.round(value * 1e8) / 1e8);
}

/** Round up to the nearest 0.25 (for gallons sold in quarter-gallon increments). */
export function ceilQuarter(value: number): number {
  return Math.ceil(value * 4) / 4;
}

// ── Input validation ──────────────────────────────────────────────────────────

export type ParsedInput =
  | { ok: true; value: number }
  | { ok: false; error: string };

/**
 * Parse a raw input value (string or number) into a validated number.
 * Returns an error if the value is non-numeric, empty, or negative when
 * allowNegative is false (default).
 */
export function parseInput(
  raw: unknown,
  label: string,
  allowNegative = false,
): ParsedInput {
  if (raw === '' || raw === null || raw === undefined) {
    return { ok: false, error: `${label} is required.` };
  }

  const num = typeof raw === 'number' ? raw : Number(raw);

  if (!Number.isFinite(num)) {
    return { ok: false, error: `${label} must be a number.` };
  }

  if (!allowNegative && num < 0) {
    return { ok: false, error: `${label} must be 0 or greater.` };
  }

  return { ok: true, value: num };
}
