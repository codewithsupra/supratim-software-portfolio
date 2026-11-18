import { useSyncExternalStore } from "react";

/**
 * `state` is what the interface renders: which station the camera frames, what the
 * pointer is over. It changes a few times a minute, so React subscribes to it. `fx` holds
 * values the scene reads every frame; routing those through React would re-render the
 * overlay sixty times a second.
 */

export type Station =
  | "overview"
  | "work"
  | "about"
  | "open-source"
  | "contact"
  | `project:${string}`;

export interface Tip {
  label: string;
  x: number;
  y: number;
}

export interface KioskState {
  station: Station;
  /** Hotspot id under the pointer (or focused in the panel list), for the cyan glow. */
  hover: string | null;
  tip: Tip | null;
  webgl: boolean | null;
}

let state: KioskState = { station: "overview", hover: null, tip: null, webgl: null };
const listeners = new Set<() => void>();

export function getState(): KioskState {
  return state;
}

export function setState(patch: Partial<KioskState>): void {
  let changed = false;
  for (const k in patch) {
    const key = k as keyof KioskState;
    if (patch[key] !== state[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useKiosk<T>(select: (s: KioskState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state), () => select(state));
}

export function go(station: Station): void {
  setState({ station, tip: null, hover: null });
}

/** Per-frame values. `power` ramps 0→1 while the neon flickers on. */
export const fx = { power: 0, reduced: false, coarse: false };

export function projectIdOf(station: Station): string | null {
  return station.startsWith("project:") ? station.slice("project:".length) : null;
}
