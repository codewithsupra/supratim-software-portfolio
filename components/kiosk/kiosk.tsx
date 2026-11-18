"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { about, contact, hero, projects, site } from "@/lib/content";
import { Panel, primaryBtn, secondaryBtn } from "./panels";
import { fx, go, projectIdOf, setState, useKiosk, type Station } from "./store";

// three.js only ever loads in the browser; every word on the page renders on the server.
const Scene = dynamic(() => import("./scene"), { ssr: false });

const NAV: { label: string; station: Station }[] = [
  { label: "Work", station: "work" },
  { label: "About", station: "about" },
  { label: "Open source", station: "open-source" },
  { label: "Contact", station: "contact" },
];

const STATIONS = new Set<string>(["work", "about", "open-source", "contact"]);

/** Keeps the address bar in step with the station, so any view can be shared or reloaded. */
function useHashSync(station: Station) {
  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (STATIONS.has(h)) go(h as Station);
      else if (h.startsWith("work/") && projects.some((p) => p.id === h.slice(5))) go(`project:${h.slice(5)}`);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  useEffect(() => {
    const id = projectIdOf(station);
    const hash = station === "overview" ? "" : id ? `#work/${id}` : `#${station}`;
    if (window.location.hash !== hash) history.replaceState(null, "", hash || window.location.pathname);
  }, [station]);
}

function Tooltip() {
  const tip = useKiosk((s) => s.tip);
  if (!tip) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-30 flex items-center gap-2 rounded-full border border-accent/40 bg-bg/80 px-3 py-1.5 backdrop-blur"
      style={{ left: tip.x + 16, top: tip.y + 14 }}
    >
      <span className="size-1.5 rounded-full bg-accent" />
      <span className="mono-label text-fg">{tip.label}</span>
    </div>
  );
}

function Intro({ webgl }: { webgl: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-20 z-10 px-5 sm:px-8 lg:bottom-10 lg:top-auto lg:px-12">
      <div className="pointer-events-auto max-w-xl">
        <p className="mono-label text-muted">{hero.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-tight sm:mt-4 sm:text-6xl lg:text-7xl">
          {hero.name.first} {hero.name.second}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg/80 sm:mt-5 sm:text-base">{hero.subhead}</p>
        <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
          <button type="button" onClick={() => go("work")} className={primaryBtn}>
            See the work
          </button>
          <button type="button" onClick={() => go("contact")} className={secondaryBtn}>
            Get in touch
          </button>
        </div>
        <p className="mono-label mt-7 hidden text-muted lg:block">
          {webgl === false
            ? "This browser can't draw the 3D kiosk. Everything is in the menu above."
            : "Drag to look around · click a TV, the radio, the mailbox or a sign"}
        </p>
      </div>
    </div>
  );
}

/** Everything on the site as plain text, for screen readers and search engines. */
function Outline() {
  return (
    <div className="sr-only">
      <h2>Work</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.credit && <p>{p.credit}</p>}
            {p.liveUrl && <a href={p.liveUrl}>{p.liveLabel ?? `${p.title} live`}</a>}
            {p.githubUrl && <a href={p.githubUrl}>{p.title} source code</a>}
          </li>
        ))}
      </ul>
      <h2>About</h2>
      <p>{about.heading}</p>
      {about.storyBeats.map((b) => (
        <p key={b.index}>{b.body}</p>
      ))}
      <h2>Contact</h2>
      <p>{contact.supporting}</p>
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
    </div>
  );
}

/**
 * The home page: a neon repair kiosk at night. Each set behind the counter is a project,
 * the radio is About, the lightbox is the Tiptap work, the mailbox is Contact and the
 * signpost points to all four. Every station is also one click away in the top bar, and
 * the same content reads top to bottom in the Résumé view.
 */
export function Kiosk() {
  const station = useKiosk((s) => s.station);
  const webgl = useKiosk((s) => s.webgl);
  useHashSync(station);

  useEffect(() => {
    fx.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fx.coarse = window.matchMedia("(pointer: coarse)").matches;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setState({ webgl: ok });
  }, []);

  const current = projectIdOf(station) ? "work" : station;

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg text-fg">
      <a
        href="/classic"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-accent"
      >
        Skip to the text version
      </a>

      <div aria-hidden className="absolute inset-0 z-0">
        {webgl && <Scene />}
        {webgl === false && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,var(--color-violet)_0%,transparent_55%)] opacity-40" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-bg/40 lg:bg-gradient-to-r lg:from-bg/75 lg:via-bg/10 lg:to-transparent" />
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => go("overview")}
          aria-label={`${site.name}, back to the kiosk`}
          className="shrink-0 whitespace-nowrap font-display text-lg font-semibold tracking-tight"
        >
          <span className="sm:hidden">{site.logo}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </button>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {NAV.map((n) => (
            <button
              key={n.station}
              type="button"
              onClick={() => go(n.station)}
              aria-current={current === n.station ? "page" : undefined}
              className={`mono-label rounded-full px-2.5 py-2 transition-colors hover:text-accent sm:px-3 ${
                n.station === "open-source" ? "hidden md:inline-flex" : ""
              } ${current === n.station ? "text-accent" : "text-fg/80"}`}
            >
              {n.label}
            </button>
          ))}
          <Link
            href="/classic"
            className="mono-label ml-1 whitespace-nowrap rounded-full border border-fg/15 px-3 py-2 text-fg/90 transition-colors hover:border-accent/50 hover:text-accent"
          >
            Résumé<span className="hidden sm:inline"> view</span>
          </Link>
        </nav>
      </header>

      {station === "overview" && <Intro webgl={webgl} />}
      <Panel />
      <Tooltip />
      <Outline />
    </div>
  );
}
