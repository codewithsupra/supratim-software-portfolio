import * as THREE from "three";
import { projects, type Project } from "@/lib/content";
import { looks, type Look } from "./palette";

/**
 * The map of the system. Every page section has a world the ship flies to while that
 * section is on screen. Orbits are deterministic functions of
 * simulation time, so the star map, the labels and the autopilot all agree on where a
 * world is without any of them owning it.
 */

export type WorldKind = "star" | "planet" | "comet" | "relay";

export interface World {
  id: string;
  kind: WorldKind;
  name: string;
  /** Short line under the name on the star map. */
  caption: string;
  index: string;
  size: number;
  orbit: { radius: number; speed: number; phase: number; incline: number };
  spin: number;
  tilt: number;
  look?: Look;
  project?: Project;
}

const slug: Record<string, string> = {
  Verdict: "verdict",
  Lull: "lull",
  "Durable Agent Engine": "dae",
  Pulse: "pulse",
  "OSS Finder": "ossfinder",
  Anchor: "anchor",
  Aria: "aria",
};

const layout: Record<string, { radius: number; size: number; phase: number; incline: number; tilt: number }> = {
  verdict: { radius: 26, size: 4.2, phase: 0.6, incline: 0.02, tilt: 0.42 },
  lull: { radius: 38, size: 3.1, phase: 2.4, incline: -0.04, tilt: 0.2 },
  dae: { radius: 50, size: 3.4, phase: 4.1, incline: 0.05, tilt: 0.1 },
  pulse: { radius: 62, size: 2.9, phase: 1.3, incline: -0.03, tilt: 0.5 },
  ossfinder: { radius: 74, size: 3.6, phase: 5.3, incline: 0.03, tilt: 0.41 },
  anchor: { radius: 86, size: 3.2, phase: 3.2, incline: -0.05, tilt: 0.3 },
  aria: { radius: 98, size: 3.9, phase: 0.1, incline: 0.04, tilt: 0.25 },
};

const planets: World[] = projects.map((p) => {
  const id = slug[p.title] ?? p.title.toLowerCase().replace(/\W+/g, "");
  const l = layout[id] ?? { radius: 110, size: 3, phase: 0, incline: 0, tilt: 0 };
  return {
    id,
    kind: "planet" as const,
    name: p.title,
    caption: p.tags.filter((t) => !/^\d{4}$/.test(t)).join(" · "),
    index: p.index,
    size: l.size,
    // Kepler-ish: inner worlds move faster, so the system visibly turns.
    orbit: { radius: l.radius, speed: 0.55 / Math.pow(l.radius, 1.5) * 12, phase: l.phase, incline: l.incline },
    spin: 0.08 + (l.radius % 7) * 0.012,
    tilt: l.tilt,
    look: looks[id],
    project: p,
  };
});

export const worlds: World[] = [
  { id: "sun", kind: "star", name: "Supratim Sarkar", caption: "About · the star at the centre",
    index: "00", size: 9, orbit: { radius: 0, speed: 0, phase: 0, incline: 0 }, spin: 0.02, tilt: 0 },
  ...planets,
  { id: "tiptap", kind: "comet", name: "Tiptap", caption: "Open source · two merged PRs",
    index: "OS", size: 1.1, orbit: { radius: 118, speed: 0.018, phase: 2.2, incline: 0.38 }, spin: 0.4, tilt: 0 },
  { id: "relay", kind: "relay", name: "Comms relay", caption: "Contact · get in touch",
    index: "✉", size: 2.6, orbit: { radius: 150, speed: 0.004, phase: 0.08, incline: 0.03 }, spin: 0.25, tilt: 0 },
];

export const worldsById: Record<string, World> = Object.fromEntries(worlds.map((w) => [w.id, w]));

/** Live world positions, written once per frame by the orbit system and read everywhere else. */
export const worldPos: Record<string, THREE.Vector3> = Object.fromEntries(
  worlds.map((w) => [w.id, new THREE.Vector3()]),
);

const COMET_E = 0.72;

export function orbitPosition(w: World, t: number, out: THREE.Vector3): THREE.Vector3 {
  const { radius, speed, phase, incline } = w.orbit;
  if (radius === 0) return out.set(0, 0, 0);
  if (w.kind === "comet") {
    // Eccentric orbit: solve Kepler's equation a few Newton steps deep so the comet
    // whips through perihelion and crawls at aphelion.
    const M = phase + t * speed;
    let E = M;
    for (let i = 0; i < 5; i++) E -= (E - COMET_E * Math.sin(E) - M) / (1 - COMET_E * Math.cos(E));
    const b = radius * Math.sqrt(1 - COMET_E * COMET_E);
    const x = radius * (Math.cos(E) - COMET_E);
    const z = b * Math.sin(E);
    return out.set(x, Math.sin(incline) * z, Math.cos(incline) * z);
  }
  const a = phase + t * speed;
  const x = Math.cos(a) * radius;
  const z = Math.sin(a) * radius;
  return out.set(x, Math.sin(incline) * z, Math.cos(incline) * z);
}

/** How close the ship parks when it arrives, measured from the world's centre. */
export function standoff(w: World): number {
  if (w.kind === "star") return w.size * 2.4 + 12;
  if (w.kind === "relay") return 11;
  if (w.kind === "comet") return 9;
  return w.size * (w.look?.rings ? 3.6 : 3.1) + 5;
}
