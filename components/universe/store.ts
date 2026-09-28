import { useSyncExternalStore } from "react";

/**
 * Two kinds of state live here. `state` is what the interface renders — which dossier is
 * open, what the ship is near — and changes a few times a minute, so React subscribes to
 * it. `flight` is what the simulation reads and writes sixty times a second; putting that
 * through React would re-render the HUD every frame, so it is a plain mutable object the
 * HUD samples on its own animation frame.
 */

export interface UiState {
  panel: string | null;
  near: string | null;
  target: string | null;
  discovered: string[];
  hint: boolean;
  webgl: boolean | null;
  ready: boolean;
}

const initial: UiState = {
  panel: null, near: null, target: null, discovered: [], hint: true, webgl: null, ready: false,
};

let state: UiState = initial;
const listeners = new Set<() => void>();

export function getState(): UiState {
  return state;
}

export function setState(patch: Partial<UiState>): void {
  let changed = false;
  for (const k in patch) {
    const key = k as keyof UiState;
    if (patch[key] !== state[key]) { changed = true; break; }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useUi<T>(select: (s: UiState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state), () => select(initial));
}

const STORAGE = "ss-charted-v1";

export function discover(id: string): void {
  if (state.discovered.includes(id)) return;
  const discovered = [...state.discovered, id];
  setState({ discovered });
  try { localStorage.setItem(STORAGE, JSON.stringify(discovered)); } catch { /* private mode */ }
}

export function loadDiscovered(): void {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) setState({ discovered: JSON.parse(raw) as string[] });
  } catch { /* nothing stored, or storage blocked */ }
}

export function openPanel(id: string | null): void {
  if (id) discover(id);
  setState({ panel: id, target: null, hint: false });
}

export function flyTo(id: string): void {
  setState({ target: id, panel: null, hint: false });
}

export const flight = {
  speed: 0,
  boost: 0,
  keys: new Set<string>(),
  steer: { x: 0, y: 0 },
  touchThrust: false,
  reduced: false,
  coarse: false,
  /** Ship world position, for HUD readouts. */
  x: 0, y: 0, z: 0,
};

/** Label elements the canvas projects each frame, keyed by world id. */
export const labelEls = new Map<string, HTMLElement>();
