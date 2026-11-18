/**
 * Every colour the WebGL scene uses. The first five are the CSS tokens from globals.css,
 * so the scene sits in the interface's palette; the rest are scene-only materials and
 * lights, kept here so no hex is scattered through the components. Cyan (`accent`) is
 * reserved for things you can click, as in the interface.
 */
export const k = {
  bg: "#05030c",
  indigo: "#2a1b5e",
  violet: "#6b3fa0",
  magenta: "#a6329b",
  accent: "#4dd8e8",

  wall: "#1c1533",
  wallDark: "#110c20",
  trim: "#2e2350",
  counter: "#22183c",
  wood: "#3a2947",
  metal: "#55506b",
  black: "#000000",
  white: "#ffffff",

  neonPink: "#ff4fd8",
  neonViolet: "#9b6bff",
  bulb: "#ffb266",
  bulbLight: "#ff9a4a",
  signLight: "#d13dc0",
  screenLight: "#7fb8ff",
  moon: "#8f8cff",

  crtBeige: "#b4a990",
  crtDark: "#2a2738",
  crtViolet: "#3c2e62",
  bezel: "#0c0b12",
  screenOff: "#06060c",

  radio: "#5a2f3f",
  pcb: "#1d5c47",
  chip: "#121018",
  toolbox: "#7d2a74",
  mailbox: "#3b3470",
  flag: "#ff5577",
  stool: "#7b2f72",

  floor: "#07050d",
  reflect: "#8a86a0",
  skyline: "#07050e",
  windowWarm: "#ffcc88",
  windowCool: "#88c8ff",
  dust: "#d8d0ff",
  ink: "#edeaf5",
  inkMuted: "#8b84a8",
  plateBg: "#0d0a18",
} as const;
