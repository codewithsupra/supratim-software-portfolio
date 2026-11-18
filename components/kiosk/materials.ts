import * as THREE from "three";
import { k } from "./palette";

/**
 * Shared materials, built once. `glow` materials are unlit and pushed above 1.0 so they
 * bloom; their base colour is remembered so the power-up can scale them from dark to lit.
 */

export interface Glow {
  mat: THREE.MeshBasicMaterial;
  base: THREE.Color;
}

export const glows: Glow[] = [];

function std(color: string, o: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.08, ...o });
}

export function glow(color: string, intensity: number, o: THREE.MeshBasicMaterialParameters = {}): THREE.MeshBasicMaterial {
  const base = new THREE.Color(color).multiplyScalar(intensity);
  const mat = new THREE.MeshBasicMaterial({ color: base.clone().multiplyScalar(0), toneMapped: false, ...o });
  glows.push({ mat, base });
  return mat;
}

/** A glowing textured face (signs, plates); white × intensity tints the texture. */
export function glowMap(map: THREE.Texture, intensity: number): THREE.MeshBasicMaterial {
  return glow(k.white, intensity, { map, transparent: true, depthWrite: false });
}

let cache: ReturnType<typeof build> | null = null;

function build() {
  return {
    wall: std(k.wall),
    wallDark: std(k.wallDark),
    trim: std(k.trim, { roughness: 0.6 }),
    counter: std(k.counter, { roughness: 0.6 }),
    wood: std(k.wood, { roughness: 0.55 }),
    metal: std(k.metal, { metalness: 0.65, roughness: 0.38 }),
    black: std(k.black, { roughness: 0.4 }),
    crt: [std(k.crtBeige, { roughness: 0.5 }), std(k.crtDark, { roughness: 0.45 }), std(k.crtViolet, { roughness: 0.45 })],
    bezel: std(k.bezel, { roughness: 0.3 }),
    screenOff: new THREE.MeshBasicMaterial({ color: k.screenOff }),
    radio: std(k.radio, { roughness: 0.5 }),
    pcb: std(k.pcb, { roughness: 0.6 }),
    chip: std(k.chip, { roughness: 0.4 }),
    toolbox: std(k.toolbox, { metalness: 0.35, roughness: 0.45 }),
    mailbox: std(k.mailbox, { metalness: 0.45, roughness: 0.4 }),
    flag: std(k.flag),
    stool: std(k.stool, { roughness: 0.5 }),
    awningA: std(k.magenta, { roughness: 0.6, side: THREE.DoubleSide }),
    awningB: std(k.violet, { roughness: 0.6, side: THREE.DoubleSide }),
    skyline: new THREE.MeshBasicMaterial({ color: k.skyline }),
    neonPink: glow(k.neonPink, 2.3),
    neonViolet: glow(k.neonViolet, 2.0),
    bulb: glow(k.bulb, 4.5),
    dial: glow(k.bulb, 0.9),
    tip: glow(k.accent, 3),
  };
}

export function mats() {
  if (!cache) cache = build();
  return cache;
}
