"use client";

/* eslint-disable react-hooks/immutability --
   Glow materials are mutated every frame; they are not React state. */

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { glows } from "./materials";
import { fx } from "./store";

/**
 * The one orchestrated moment: on load the neon stutters on, settles, and stays lit.
 * Under reduced motion everything is simply on.
 */
export function PowerUp() {
  const t = useMemo(() => ({ value: 0 }), []);
  useFrame((_, dt) => {
    t.value += Math.min(dt, 0.05);
    let p = 1;
    if (!fx.reduced) {
      const s = t.value;
      if (s < 0.35) p = 0;
      else if (s < 1.7) {
        const ramp = (s - 0.35) / 1.35;
        const stutter = Math.sin(s * 47) * Math.sin(s * 13.3) > 0.15 ? 1 : 0.12;
        p = ramp * (s < 1.35 ? stutter : 1);
      }
    }
    fx.power = Math.min(1, p);
    for (const g of glows) g.mat.color.copy(g.base).multiplyScalar(fx.power);
  });
  return null;
}
