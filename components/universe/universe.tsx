"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { clock } from "./clock";
import { Story } from "./story";
import { flight, setState, useUi } from "./store";

// three.js only ever loads in the browser; every word of the page renders on the server.
const Scene = dynamic(() => import("./scene"), { ssr: false });

/**
 * A scrolling page over a live solar system. The system is scenery, not a control
 * surface: it never takes the pointer, so reading, selecting and clicking work exactly
 * as on any page, and without WebGL the page is simply the text on the dark ground.
 */
export function Universe() {
  const webgl = useUi((s) => s.webgl);

  useEffect(() => {
    flight.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flight.coarse = window.matchMedia("(pointer: coarse)").matches;
    if (flight.reduced) clock.scale = 0.2;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
    } catch { ok = false; }
    setState({ webgl: ok });
  }, []);

  return (
    <div className="relative bg-bg text-fg">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {webgl && <Scene />}
        {/* Keeps text legible over the brightest parts of the scene. */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-bg/70 via-bg/20 to-transparent lg:w-2/3" />
      </div>
      <Story webgl={webgl} />
    </div>
  );
}
