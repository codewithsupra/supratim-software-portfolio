"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { about, contact, elsewhere } from "@/lib/content";
import { flyTo, openPanel, useUi } from "./store";
import { worlds, worldsById, type World } from "./worlds";

const btn =
  "mono-label inline-flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent";
const primary = `${btn} border-accent/60 text-accent hover:bg-accent/10`;
const secondary = `${btn} border-fg/15 text-fg hover:border-accent/50 hover:text-accent`;

function ProjectBody({ w }: { w: World }) {
  const p = w.project!;
  return (
    <>
      <p className="mono-label text-muted">Project {p.index} · {p.tags.join(" · ")}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight">{p.title}</h2>
      <p className="mt-5 text-[15px] leading-relaxed text-fg/85">{p.description}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
        {p.tech.map((t) => (
          <li key={t} className="mono-label rounded-full border border-fg/12 px-2.5 py-1 text-muted">{t}</li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={p.liveUrl} target="_blank" rel="noreferrer" className={primary}>Launch live ↗</a>
        <a href={p.githubUrl} target="_blank" rel="noreferrer" className={secondary}>Source code ↗</a>
      </div>
      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="mt-6 block overflow-hidden rounded-card border border-fg/10">
        <Image src={p.screenshot} alt={p.alt} width={1920} height={1020} sizes="(min-width: 1024px) 400px, 100vw" className="h-auto w-full" />
      </a>
    </>
  );
}

function StarBody() {
  return (
    <>
      <p className="mono-label text-muted">{about.eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight">{about.heading}</h2>
      <dl className="mt-6 grid grid-cols-3 gap-3">
        {about.stats.map((s) => (
          <div key={s.label} className="rounded-card border border-fg/10 p-3">
            <dt className="text-[11px] leading-snug text-muted">{s.label}</dt>
            <dd className="order-first font-display text-2xl font-semibold text-fg">{s.value}</dd>
          </div>
        ))}
      </dl>
      <ol className="mt-6 space-y-5">
        {about.storyBeats.map((b) => (
          <li key={b.index}>
            <p className="mono-label text-muted">{b.index} · {b.title}</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-fg/85">{b.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={about.nowPanel.url} target="_blank" rel="noreferrer" className={primary}>{about.nowPanel.linkLabel} ↗</a>
        <Link href="/classic" className={secondary}>Résumé view</Link>
      </div>
    </>
  );
}

function CometBody() {
  const c = about.latestCourse;
  return (
    <>
      <p className="mono-label text-muted">{c.label}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight">{c.titleLines[0]}</h2>
      <p className="mt-2 font-display text-xl text-fg/85">{c.titleLines[1]}</p>
      <p className="mt-5 text-[15px] leading-relaxed text-fg/85">{c.blurb}</p>
      <div className="mt-6"><a href={c.url} target="_blank" rel="noreferrer" className={primary}>{c.linkLabel} ↗</a></div>
    </>
  );
}

function RelayBody() {
  return (
    <>
      <p className="mono-label text-muted">{contact.eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight">{contact.heading}</h2>
      <p className="mt-5 text-[15px] leading-relaxed text-fg/85">{contact.supporting}</p>
      <a href={`mailto:${contact.email}`} className="mt-6 block break-all font-display text-2xl text-accent underline-offset-4 hover:underline">
        {contact.email}
      </a>
      <p className="mono-label mt-2 text-muted">{contact.location}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {elsewhere.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className={secondary}>{l.label} · {l.handle} ↗</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Dossier() {
  const panel = useUi((s) => s.panel);
  const webgl = useUi((s) => s.webgl);
  const close = useRef<HTMLButtonElement>(null);
  // Keep showing the last dossier while the panel slides out, instead of emptying mid-exit.
  const [last, setLast] = useState<string | null>(null);
  if (panel && panel !== last) setLast(panel);
  const id = panel ?? last;
  const w = id ? worldsById[id] : undefined;
  const open = Boolean(panel);

  useEffect(() => {
    if (open) close.current?.focus({ preventScroll: true });
  }, [open, panel]);

  const i = w ? worlds.indexOf(w) : -1;
  const prev = worlds[(i - 1 + worlds.length) % worlds.length]!;
  const next = worlds[(i + 1) % worlds.length]!;
  const go = webgl === false ? openPanel : flyTo;

  return (
    <aside
      aria-label={w ? `${w.name} dossier` : "Dossier"}
      aria-hidden={!open}
      inert={!open}
      className={`fixed z-30 flex flex-col border-fg/10 bg-surface/75 backdrop-blur-2xl transition-[transform,opacity] duration-500 ease-out
        inset-x-0 bottom-0 max-h-[72vh] rounded-t-[20px] border-t
        lg:inset-x-auto lg:bottom-4 lg:right-4 lg:top-4 lg:max-h-none lg:w-[440px] lg:rounded-[20px] lg:border
        ${open ? "translate-y-0 opacity-100 lg:translate-x-0" : "translate-y-full opacity-0 lg:translate-x-[110%] lg:translate-y-0"}`}
    >
      <div className="flex items-center justify-between border-b border-fg/10 px-5 py-3">
        <span className="mono-label text-muted">{w ? `Scanning · ${w.name}` : ""}</span>
        <button ref={close} onClick={() => openPanel(null)} className="mono-label rounded-full px-3 py-1.5 text-fg hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent">
          Close · Esc
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 lg:px-7">
        {w?.kind === "planet" && <ProjectBody w={w} />}
        {w?.kind === "star" && <StarBody />}
        {w?.kind === "comet" && <CometBody />}
        {w?.kind === "relay" && <RelayBody />}
      </div>
      {w && (
        <div className="flex items-center justify-between gap-2 border-t border-fg/10 px-5 py-3">
          <button onClick={() => go(prev.id)} className="mono-label truncate rounded-full px-3 py-2 text-muted hover:text-accent">← {prev.name}</button>
          <button onClick={() => go(next.id)} className="mono-label truncate rounded-full px-3 py-2 text-fg hover:text-accent">{next.name} →</button>
        </div>
      )}
    </aside>
  );
}
