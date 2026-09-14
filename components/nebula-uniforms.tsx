"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import * as THREE from "three";

/**
 * The shared nebula uniforms object — one mutable store for everything the
 * page's live surface reads per frame. The shader material holds it by
 * reference, the dev panel writes into it, and the wordmark treatments read
 * the already-eased pointer and scroll values from it, so type and field
 * move with exactly the same lag. Created client-side only (defaults read
 * the CSS tokens); the context holds null during SSR.
 */

export type NebulaUniforms = {
  uTime: { value: number };
  uResolution: { value: THREE.Vector2 };
  uPointer: { value: THREE.Vector2 };
  uParallax: { value: number };
  // Consumed on the CPU side (pointer easing rate), not in GLSL.
  uDamping: { value: number };
  uScroll: { value: number };
  // Consumed on the CPU side (raw pin progress; uScroll eases toward
  // uScrollTarget * uScrollIntensity each frame), not in GLSL.
  uScrollTarget: { value: number };
  uScrollIntensity: { value: number };
  // Consumed on the CPU side (~seconds for uScroll to catch up), not in GLSL.
  uScrubLag: { value: number };
  // Consumed on the CPU side by the wordmark treatments, not in GLSL:
  // max opposite line drift (% of line width) and max cursor lean (px).
  uMarkDrift: { value: number };
  uMarkLean: { value: number };
  // Ground (MOTION_BRIEF Look): past the hero the field recedes until it
  // reads as texture. uGround eases toward uGroundTarget (raw scrub
  // progress, CPU side); the rest tune how far it recedes.
  uGround: { value: number };
  uGroundTarget: { value: number };
  // Consumed on the CPU side (clock rate at full ground), not in GLSL.
  uGroundSpeed: { value: number };
  uGroundScale: { value: number };
  uGroundFade: { value: number };
  uTravel: { value: number };
  uDepth: { value: number };
  uGlowSettle: { value: number };
  uSpeed: { value: number };
  uDrift: { value: number };
  uScale: { value: number };
  uTurbulence: { value: number };
  uGlow: { value: number };
  uEdge: { value: number };
  uStars: { value: number };
  uGrain: { value: number };
  uBg: { value: THREE.Vector3 };
  uIndigo: { value: THREE.Vector3 };
  uViolet: { value: THREE.Vector3 };
  uMagenta: { value: THREE.Vector3 };
  uCyan: { value: THREE.Vector3 };
};

export function hexToVec3(hex: string): THREE.Vector3 {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
}

// Palette comes from the CSS tokens so the shader can never drift from them.
function tokenVec3(name: string): THREE.Vector3 {
  return hexToVec3(
    getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
  );
}

function createUniforms(): NebulaUniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uParallax: { value: 0.1 },
    uDamping: { value: 1.5 },
    uScroll: { value: 0 },
    uScrollTarget: { value: 0 },
    uScrollIntensity: { value: 1 },
    uScrubLag: { value: 1 },
    uMarkDrift: { value: 8 },
    uMarkLean: { value: 6 },
    uGround: { value: 0 },
    uGroundTarget: { value: 0 },
    uGroundSpeed: { value: 0.35 },
    uGroundScale: { value: 0.6 },
    uGroundFade: { value: 0.55 },
    uTravel: { value: 2.4 },
    uDepth: { value: 0.6 },
    uGlowSettle: { value: 0.9 },
    uSpeed: { value: 0.045 },
    uDrift: { value: 0.075 },
    uScale: { value: 3.0 },
    uTurbulence: { value: 2.2 },
    uGlow: { value: 1.0 },
    uEdge: { value: 0.05 },
    uStars: { value: 1.0 },
    uGrain: { value: 0.04 },
    uBg: { value: tokenVec3("--bg") },
    uIndigo: { value: tokenVec3("--indigo") },
    uViolet: { value: tokenVec3("--violet") },
    uMagenta: { value: tokenVec3("--magenta") },
    uCyan: { value: tokenVec3("--accent") },
  };
}

const NebulaContext = createContext<NebulaUniforms | null>(null);

const subscribeNever = () => () => {};

export function NebulaProvider({ children }: { children: React.ReactNode }) {
  // Uniform defaults read the CSS tokens, so creation waits for the client;
  // the false server snapshot keeps hydration consistent without an effect.
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const uniforms = useMemo(
    () => (isClient ? createUniforms() : null),
    [isClient],
  );

  return (
    <NebulaContext.Provider value={uniforms}>{children}</NebulaContext.Provider>
  );
}

export function useNebulaUniforms() {
  return useContext(NebulaContext);
}
