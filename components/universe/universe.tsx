"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { clock } from "./clock";
import { Dossier } from "./dossier";
import { Hud, Labels } from "./hud";
import { flight, flyTo, getState, loadDiscovered, openPanel, setState, useUi } from "./store";
import { worlds } from "./worlds";

// three.js only ever loads in the browser; the HUD and dossiers render on the server.
const Scene = dynamic(() => import("./scene"), { ssr: false });

const FLIGHT_KEYS = new Set([
  "KeyW", "KeyA", "KeyS", "KeyD", "KeyR", "KeyF", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "ShiftLeft", "ShiftRight", "PageUp", "PageDown",
]);

function isField(el: EventTarget | null) {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}
function isControl(el: EventTarget | null) {
  return el instanceof HTMLElement && /^(BUTTON|A)$/.test(el.tagName);
}

export function Universe() {
  const webgl = useUi((s) => s.webgl);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    flight.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flight.coarse = window.matchMedia("(pointer: coarse)").matches;
    if (flight.reduced) clock.scale = 0.2;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
    } catch { ok = false; }
    loadDiscovered();
    setState({ webgl: ok });

    const down = (e: KeyboardEvent) => {
      if (isField(e.target)) return;
      const ui = getState();
      if (e.code === "Escape") {
        if (ui.panel) openPanel(null);
        else if (ui.target) setState({ target: null });
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.code === "Space" || e.code === "KeyE" || e.code === "Enter") && !isControl(e.target)) {
        if (!ui.panel && ui.near) {
          e.preventDefault();
          openPanel(ui.near);
        }
        return;
      }
      const digit = /^Digit(\d)$/.exec(e.code);
      if (digit) {
        const w = worlds[Number(digit[1])];
        if (w) (ok ? flyTo : openPanel)(w.id);
        return;
      }
      if (FLIGHT_KEYS.has(e.code)) {
        if (e.code.startsWith("Arrow") || e.code.startsWith("Page")) e.preventDefault();
        flight.keys.add(e.code);
        if (ui.hint) setState({ hint: false });
      }
    };
    const up = (e: KeyboardEvent) => { flight.keys.delete(e.code); };
    const clear = () => { flight.keys.clear(); flight.steer.x = flight.steer.y = 0; flight.touchThrust = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  // Drag anywhere on the sky to steer, like a joystick centred where the drag began.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!(e.target instanceof HTMLCanvasElement) || drag.current) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const range = flight.coarse ? 70 : 120;
    flight.steer.x = Math.max(-1, Math.min(1, (e.clientX - d.x) / range));
    flight.steer.y = Math.max(-1, Math.min(1, (e.clientY - d.y) / range));
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 && getState().hint) setState({ hint: false });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    flight.steer.x = flight.steer.y = 0;
  };

  return (
    <div
      className="fixed inset-0 touch-none select-none overflow-hidden bg-bg text-fg"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {webgl && <Scene />}
      {webgl === false && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <p className="max-w-sm text-muted">
            This browser can&apos;t draw the 3-D system. Every project is still one click away in the
            star map, or read the{" "}
            <Link href="/classic" className="text-accent underline underline-offset-4">résumé view</Link>.
          </p>
        </div>
      )}
      {webgl && <Labels />}
      <Hud />
      <Dossier />
    </div>
  );
}
