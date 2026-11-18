import { projects, type Project } from "@/lib/content";
import type { Station } from "./store";

/** Where everything stands, in metres. The kiosk is centred on the origin, facing +z. */

export type V3 = [number, number, number];

export const TV_Z = -0.62;
export const TV = { w: 0.82, h: 0.64, d: 0.5 };
const SLOTS: [number, number][] = [
  [-0.98, 2.1],
  [0, 2.1],
  [0.98, 2.1],
  [-0.98, 1.42],
  [0, 1.42],
  [0.98, 1.42],
];

export interface TvSlot {
  project: Project;
  index: number;
  x: number;
  y: number;
}

export const tvs: TvSlot[] = projects.slice(0, SLOTS.length).map((project, index) => ({
  project,
  index,
  x: SLOTS[index]![0],
  y: SLOTS[index]![1],
}));

export const COUNTER_TOP = 1.0;
export const RADIO: V3 = [-1.25, COUNTER_TOP, 0.66];
export const PLAQUE: V3 = [2.05, 1.95, 1.0];
export const MAILBOX: V3 = [2.6, 0, 1.55];
export const SIGNPOST: V3 = [-2.5, 0, 1.3];

export interface Shot {
  pos: V3;
  target: V3;
}

/** Camera framing for each station. Portrait screens stand further back. */
export function shotFor(station: Station, portrait: boolean): Shot {
  const far = portrait ? 1.55 : 1;
  if (station.startsWith("project:")) {
    const id = station.slice("project:".length);
    const tv = tvs.find((t) => t.project.id === id) ?? tvs[0]!;
    // Stand back past the counter and, for the lower row, look over the clutter on it.
    const d = 1.6 * far;
    const lift = tv.y < 1.7 ? 0.24 : 0.05;
    return { pos: [tv.x * 0.85, tv.y + lift, TV_Z + TV.d / 2 + d], target: [tv.x, tv.y, TV_Z] };
  }
  switch (station) {
    case "work":
      return { pos: [0, 1.95, portrait ? 6.4 : 4.1], target: [0, 1.74, TV_Z] };
    case "about":
      return {
        pos: [RADIO[0] + 0.45, RADIO[1] + 0.45, RADIO[2] + 1.1 * far],
        target: [RADIO[0], RADIO[1] + 0.16, RADIO[2]],
      };
    case "open-source":
      return {
        pos: [PLAQUE[0] - 0.55, PLAQUE[1] + 0.1, PLAQUE[2] + 1.45 * far],
        target: [PLAQUE[0], PLAQUE[1], PLAQUE[2]],
      };
    case "contact":
      return {
        pos: [MAILBOX[0] + 0.7, 1.75, MAILBOX[2] + 1.9 * far],
        target: [MAILBOX[0], 1.12, MAILBOX[2]],
      };
    default:
      return portrait
        ? { pos: [6.4, 3.4, 13.6], target: [-0.3, 3.15, 0] }
        : { pos: [6.4, 2.75, 9.3], target: [0.15, 1.55, 0.1] };
  }
}
