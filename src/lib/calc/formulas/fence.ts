/**
 * formula: fence
 * Used by: fence-calculator
 *
 * Inputs:
 *   length  – ft (total fence run)
 *   gates   – count (number of gate openings, default 0)
 *   corners – count (number of corner posts, default 0)
 *
 * Constants:
 *   postSpacing      – ft (default 8)
 *   panelWidth       – ft (default 8)
 *   railsPerSection  – count (default 3)
 *   picketsPerFoot   – count per linear foot (default 2.25 for 5.5-in pickets)
 *
 * Outputs:
 *   posts   – total fence posts (line + gates + corners, rounded up)
 *   panels  – total pre-built panels (rounded up)
 *   rails   – total horizontal rails (rounded up)
 *   pickets – total individual pickets (rounded up)
 *
 * Source: docs/FORMULAS.md lines 54-55 & 79
 * posts = ceil(length / postSpacing) + 1 + extra
 */

import { ceilWhole } from '../units.js';

export interface FenceInputs {
  length: number;
  gates?: number;
  corners?: number;
}

export interface FenceConstants {
  postSpacing?: number;     // default 8 ft
  panelWidth?: number;      // default 8 ft
  railsPerSection?: number; // default 3
  picketsPerFoot?: number;  // default 2.25
}

export interface FenceOutputs {
  posts: number;
  panels: number;
  rails: number;
  pickets: number;
}

export function fence(
  inputs: FenceInputs,
  constants: FenceConstants,
): FenceOutputs {
  const spacing = constants.postSpacing && constants.postSpacing > 0 ? constants.postSpacing : 8;
  const panelW = constants.panelWidth && constants.panelWidth > 0 ? constants.panelWidth : 8;
  const railsPerSec = constants.railsPerSection && constants.railsPerSection > 0 ? constants.railsPerSection : 3;
  const picketsPerFt = constants.picketsPerFoot && constants.picketsPerFoot > 0 ? constants.picketsPerFoot : 2.25;

  const sections = inputs.length > 0 ? inputs.length / spacing : 0;
  const basePosts = inputs.length > 0 ? ceilWhole(sections) + 1 : 0;
  const extraPosts = (inputs.gates ?? 0) + (inputs.corners ?? 0);
  const posts = basePosts + extraPosts;

  const panels = ceilWhole(inputs.length / panelW);
  const rails = panels * railsPerSec;
  const pickets = ceilWhole(inputs.length * picketsPerFt);

  return {
    posts,
    panels,
    rails,
    pickets,
  };
}