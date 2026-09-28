/**
 * Every colour the WebGL scene uses, in one place. The UI never reads these — it uses
 * the CSS tokens in globals.css. The first four are those tokens, so the nebula and the
 * star sit in the same palette as the interface; planet colours are here so no hex is
 * scattered through the scene components.
 */
export const token = {
  bg: "#05030c",
  indigo: "#2a1b5e",
  violet: "#6b3fa0",
  magenta: "#a6329b",
} as const;

export interface Look {
  /** 0 gas giant · 1 terrestrial · 2 volcanic · 3 ice · 4 ocean */
  type: 0 | 1 | 2 | 3 | 4;
  a: string;
  b: string;
  c: string;
  atmo: string;
  rings?: { inner: number; outer: number; tint: string };
  moon?: boolean;
  beacon?: boolean;
}

export const looks: Record<string, Look> = {
  verdict: { type: 0, a: "#4b2a86", b: "#1c1240", c: "#d9c2ff", atmo: "#a98bff",
    rings: { inner: 1.45, outer: 2.45, tint: "#cdb8ff" } },
  lull: { type: 4, a: "#071a3a", b: "#2a6fb0", c: "#7ff5d6", atmo: "#8fe8ff" },
  dae: { type: 2, a: "#150a0e", b: "#ff4d1a", c: "#ffd27a", atmo: "#ff6a3d" },
  pulse: { type: 3, a: "#e8f6ff", b: "#6fa8ff", c: "#243f86", atmo: "#9fd4ff", beacon: true },
  ossfinder: { type: 1, a: "#0d3f66", b: "#2f7d4f", c: "#c9b27c", atmo: "#8fd3ff" },
  anchor: { type: 1, a: "#06244d", b: "#1f5f8b", c: "#9fb7c9", atmo: "#5aa9ff", moon: true },
  aria: { type: 0, a: "#f0c46a", b: "#7a4a22", c: "#fff0cc", atmo: "#ffd98a",
    rings: { inner: 1.35, outer: 1.75, tint: "#f6dca0" } },
};

export const scene = {
  starCore: "#fff4fb",
  starHot: "#ff7ad9",
  corona: "#e07bff",
  dust: "#c8c0ff",
  streak: "#bfe9ff",
  flameHot: "#ffffff",
  flame: "#ff5fd2",
  hull: "#1b1830",
  hullTrim: "#8f84c8",
  canopy: "#4dd8e8",
  rock: "#6b6278",
  comet: "#dff6ff",
  relayGlow: "#4dd8e8",
  solarPanel: "#1a2a6a",
  moon: "#9a96a8",
  orbit: "#8f7fe0",
} as const;
