"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { hero, site } from "@/lib/content";
import { flight, flyTo, labelEls, openPanel, setState, useUi } from "./store";
import { shipState } from "./ship-state";
import { worldPos, worlds, worldsById } from "./worlds";

/** Floating name tags that ride above each world. The star map is the accessible version. */
export function Labels() {
  const target = useUi((s) => s.target);
  const near = useUi((s) => s.near);
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {worlds.map((w) => {
        const hot = target === w.id || near === w.id;
        return (
          <button
            key={w.id}
            tabIndex={-1}
            ref={(el) => { if (el) labelEls.set(w.id, el); else labelEls.delete(w.id); }}
            onClick={() => flyTo(w.id)}
            className="group absolute left-0 top-0 flex flex-col items-center gap-1 opacity-0 transition-opacity duration-300 will-change-transform"
          >
            <span
              className={`mono-label whitespace-nowrap rounded-full border px-2.5 py-1 backdrop-blur-md transition-colors ${
                hot ? "border-accent/70 bg-bg/70 text-accent" : "border-fg/15 bg-bg/40 text-fg/85 group-hover:border-accent/60 group-hover:text-accent"
              }`}
            >
              {w.index} · {w.name}
            </span>
            <span className={`h-3 w-px ${hot ? "bg-accent/70" : "bg-fg/25"}`} />
          </button>
        );
      })}
    </div>
  );
}

/** Speed and autopilot readouts, sampled from the flight model on their own frame loop. */
function Telemetry() {
  const speed = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const dist = useRef<HTMLSpanElement>(null);
  const target = useUi((s) => s.target);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (speed.current) speed.current.textContent = Math.round(Math.abs(flight.speed) * 37).toLocaleString("en-US");
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.abs(flight.speed) / 150).toFixed(3)})`;
      if (dist.current && target) {
        const d = shipState.position.distanceTo(worldPos[target]!);
        dist.current.textContent = `${(d * 0.037).toFixed(2)} AU`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="pointer-events-none flex flex-col items-end gap-1.5 text-right">
      <span className="mono-label text-muted">Velocity</span>
      <span className="font-display text-2xl leading-none tabular-nums text-fg">
        <span ref={speed}>0</span> <span className="mono-label text-muted">km/s</span>
      </span>
      <span className="block h-0.5 w-40 overflow-hidden rounded-full bg-fg/10">
        <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet via-magenta to-fg" />
      </span>
      {target && (
        <span className="mono-label text-muted">
          Autopilot → {worldsById[target]?.name} · <span ref={dist} className="tabular-nums" />
        </span>
      )}
    </div>
  );
}

function StarMap({ go }: { go: (id: string) => void }) {
  const discovered = useUi((s) => s.discovered);
  const target = useUi((s) => s.target);
  const panel = useUi((s) => s.panel);
  const charted = worlds.filter((w) => discovered.includes(w.id)).length;

  return (
    <nav aria-label="Star map" className="pointer-events-auto">
      <div className="mb-3 flex items-baseline justify-between gap-6">
        <span className="mono-label text-fg">Star map</span>
        <span className="mono-label tabular-nums text-muted">Charted {charted}/{worlds.length}</span>
      </div>
      <ol className="flex flex-col gap-0.5">
        {worlds.map((w) => {
          const active = target === w.id || panel === w.id;
          const seen = discovered.includes(w.id);
          return (
            <li key={w.id}>
              <button
                onClick={() => go(w.id)}
                aria-current={active ? "true" : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent ${
                  active ? "bg-fg/[0.06]" : "hover:bg-fg/[0.04]"
                }`}
              >
                <span className={`mono-label w-6 tabular-nums ${active ? "text-accent" : "text-muted"}`}>{w.index}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm ${active ? "text-accent" : "text-fg group-hover:text-accent"}`}>{w.name}</span>
                  <span className="block truncate text-[11px] text-muted">{w.caption}</span>
                </span>
                <span
                  aria-label={seen ? "charted" : "uncharted"}
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${seen ? "bg-accent shadow-[0_0_8px_var(--accent)]" : "border border-fg/30"}`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function MobileMap({ go }: { go: (id: string) => void }) {
  const target = useUi((s) => s.target);
  return (
    <nav aria-label="Star map" className="pointer-events-auto -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      <ol className="flex gap-2">
        {worlds.map((w) => (
          <li key={w.id}>
            <button
              onClick={() => go(w.id)}
              className={`mono-label whitespace-nowrap rounded-full border px-3 py-2 backdrop-blur-md ${
                target === w.id ? "border-accent/70 bg-bg/70 text-accent" : "border-fg/15 bg-bg/50 text-fg"
              }`}
            >
              {w.index} {w.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ThrustButton() {
  const set = (on: boolean) => (e: React.PointerEvent) => {
    e.preventDefault();
    flight.touchThrust = on;
    if (on) setState({ hint: false, target: null });
  };
  return (
    <button
      aria-label="Hold to fly forward"
      onPointerDown={set(true)}
      onPointerUp={set(false)}
      onPointerCancel={set(false)}
      onPointerLeave={set(false)}
      className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full border border-accent/50 bg-bg/50 text-accent backdrop-blur-md active:bg-accent/15"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden><path d="M10 3 17 16H3z" fill="currentColor" /></svg>
    </button>
  );
}

export function Hud() {
  const webgl = useUi((s) => s.webgl);
  const near = useUi((s) => s.near);
  const panel = useUi((s) => s.panel);
  const target = useUi((s) => s.target);
  const hint = useUi((s) => s.hint);
  const ready = useUi((s) => s.ready);
  // Without WebGL there is nothing to fly, so the map opens dossiers directly.
  const go = webgl === false ? openPanel : flyTo;
  const nearWorld = near ? worldsById[near] : undefined;
  const touch = typeof window !== "undefined" && flight.coarse;

  return (
    <div className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-1000 ${ready || webgl === false ? "opacity-100" : "opacity-0"}`}>
      <div aria-hidden className="absolute left-0 top-0 h-[70vh] w-[30rem] max-w-full bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--bg)_78%,transparent),transparent_70%)]" />
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-bg/70 to-transparent" />
      {/* Identity and exits: always the first thing read, and two clicks from everything. */}
      <header className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="font-display text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
            {hero.name.first} {hero.name.second}
          </h1>
          <p className="mono-label mt-2 text-muted">{hero.eyebrow}</p>
        </div>
        <nav aria-label="Site" className="pointer-events-auto flex items-center gap-1 sm:gap-2">
          <Link href="/classic" className="mono-label rounded-full px-3 py-2 text-fg transition-colors hover:text-accent focus-visible:text-accent">
            Résumé view
          </Link>
          <button onClick={() => openPanel("relay")} className="mono-label rounded-full border border-accent/50 px-3 py-2 text-accent transition-colors hover:bg-accent/10">
            Contact
          </button>
          <a href={site.githubUrl} target="_blank" rel="noreferrer" className="mono-label hidden rounded-full px-3 py-2 text-fg transition-colors hover:text-accent sm:inline">
            GitHub
          </a>
        </nav>
      </header>

      <div className="absolute left-4 top-28 hidden w-64 lg:left-8 lg:block">
        <StarMap go={go} />
      </div>

      {/* Scan prompt and flight hint */}
      <div className="absolute inset-x-0 bottom-28 flex justify-center px-4 lg:bottom-10">
        {nearWorld && !panel && (
          <button
            onClick={() => openPanel(nearWorld.id)}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-accent/60 bg-bg/60 py-2 pl-2 pr-4 text-accent backdrop-blur-md transition-colors hover:bg-accent/10"
          >
            <kbd className="mono-label rounded-full bg-accent/15 px-2.5 py-1">{touch ? "Tap" : "Space"}</kbd>
            <span className="text-sm">Scan {nearWorld.name}</span>
          </button>
        )}
        {!nearWorld && !panel && hint && webgl && (
          <p className="mono-label max-w-xl text-center leading-relaxed text-muted">
            {touch
              ? "Drag to steer · hold ▲ to fly · or tap any world to travel there"
              : "Drag to steer · W to fly · Shift to warp · 0–9 to jump · or pick a world from the star map"}
          </p>
        )}
        {target && !nearWorld && !hint && (
          <button onClick={() => setState({ target: null })} className="mono-label pointer-events-auto rounded-full px-3 py-2 text-muted hover:text-accent">
            Cancel autopilot · Esc
          </button>
        )}
      </div>

      {webgl && (
        <div className="absolute bottom-6 right-4 hidden sm:right-6 sm:block lg:bottom-8 lg:right-8">
          <Telemetry />
        </div>
      )}
      {webgl && !touch && (
        <dl className="mono-label absolute bottom-8 left-8 hidden grid-cols-[auto_auto] gap-x-3 gap-y-1 text-muted xl:grid">
          <dt className="text-fg">W / S</dt><dd>Thrust · brake</dd>
          <dt className="text-fg">A / D · drag</dt><dd>Steer</dd>
          <dt className="text-fg">Shift</dt><dd>Warp</dd>
          <dt className="text-fg">Space</dt><dd>Scan</dd>
        </dl>
      )}

      <div className="absolute inset-x-4 bottom-4 flex items-end gap-3 lg:hidden">
        <div className="min-w-0 flex-1"><MobileMap go={go} /></div>
        {webgl && touch && !panel && <ThrustButton />}
      </div>
    </div>
  );
}
