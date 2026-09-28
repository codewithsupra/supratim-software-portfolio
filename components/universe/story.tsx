"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { about, contact, elsewhere, hero, projects, projectsSection, site } from "@/lib/content";
import { flyTo, setState } from "./store";
import { worlds } from "./worlds";

/**
 * The page itself: ordinary sections in reading order, readable without touching
 * anything. Each section names the world it belongs to, and whichever section crosses
 * the middle of the viewport tells the ship where to fly, so the 3-D system behind the
 * text follows the reader instead of asking them to drive.
 */

const card =
  "w-full max-w-xl rounded-[20px] border border-fg/10 bg-bg/60 p-6 backdrop-blur-md sm:p-8 lg:p-10";
const btn =
  "mono-label inline-flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent";
const primary = `${btn} border-accent/60 text-accent hover:bg-accent/10`;
const secondary = `${btn} border-fg/15 text-fg hover:border-accent/50 hover:text-accent`;

const planetIds = worlds.filter((w) => w.kind === "planet").map((w) => w.id);

interface Chapter {
  id: string;
  label: string;
  world: string | null;
}

const chapters: Chapter[] = [
  { id: "top", label: "Home", world: null },
  { id: "about", label: "About", world: "sun" },
  ...projects.map((p, i) => ({ id: i === 0 ? "work" : `work-${p.index}`, label: p.title, world: planetIds[i] ?? null })),
  { id: "open-source", label: "Open source", world: "tiptap" },
  { id: "contact", label: "Contact", world: "relay" },
];

function Section({ chapter, children, className = "" }: { chapter: Chapter; children: React.ReactNode; className?: string }) {
  return (
    <section
      id={chapter.id}
      data-chapter={chapter.id}
      className={`relative flex min-h-screen scroll-mt-0 items-center px-5 py-28 sm:px-8 lg:px-16 ${className}`}
    >
      {children}
    </section>
  );
}

function useActiveChapter() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute("data-chapter") ?? "top");
      },
      // A section becomes current when it crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Story({ webgl }: { webgl: boolean | null }) {
  const active = useActiveChapter();
  const last = useRef<string | null>(null);

  useEffect(() => {
    const world = chapters.find((c) => c.id === active)?.world ?? null;
    if (world === last.current) return;
    last.current = world;
    if (!webgl) return;
    if (world) flyTo(world);
    else setState({ target: null, panel: null });
  }, [active, webgl]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 bg-gradient-to-b from-bg/85 to-transparent px-5 py-4 sm:px-8 lg:px-16">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">{site.name}</a>
        <nav aria-label="Sections" className="flex items-center gap-1 sm:gap-3">
          {[["About", "#about"], ["Work", "#work"], ["Contact", "#contact"]].map(([l, h]) => (
            <a key={h} href={h} className="mono-label hidden rounded-full px-3 py-2 text-fg transition-colors hover:text-accent sm:inline">{l}</a>
          ))}
          <Link href="/classic" className="mono-label rounded-full border border-fg/15 px-3 py-2 text-fg transition-colors hover:border-accent/50 hover:text-accent">
            Résumé view
          </Link>
        </nav>
      </header>

      {/* Chapter rail: where you are, and a jump to anywhere. */}
      <nav aria-label="Chapters" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex">
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="group flex items-center justify-end gap-3" aria-current={active === c.id ? "true" : undefined}>
            <span className={`mono-label transition-opacity ${active === c.id ? "text-accent opacity-100" : "text-muted opacity-0 group-hover:opacity-100"}`}>{c.label}</span>
            <span className={`h-1.5 rounded-full transition-all ${active === c.id ? "w-5 bg-accent" : "w-1.5 bg-fg/35 group-hover:bg-fg/70"}`} />
          </a>
        ))}
      </nav>

      <main id="main" className="relative z-10">
        <Section chapter={chapters[0]!} className="items-end">
          <div className="max-w-3xl pb-10">
            <p className="mono-label text-muted">{hero.eyebrow}</p>
            <h1 className="mt-4 font-display text-6xl font-semibold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              {hero.name.first}<br />{hero.name.second}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/85">{hero.subhead}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <a href="#work" className={primary}>See the work ↓</a>
              <a href="#contact" className={secondary}>Get in touch</a>
            </div>
            <p className="mono-label mt-14 text-muted">Scroll — the camera follows you through seven worlds</p>
          </div>
        </Section>

        <Section chapter={chapters[1]!}>
          <div className={card}>
            <p className="mono-label text-muted">{about.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{about.heading}</h2>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {about.stats.map((s) => (
                <div key={s.label} className="flex flex-col rounded-card border border-fg/10 p-3">
                  <dt className="order-last text-[11px] leading-snug text-muted">{s.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-fg">{s.value}</dd>
                </div>
              ))}
            </dl>
            <ol className="mt-7 space-y-5">
              {about.storyBeats.map((b) => (
                <li key={b.index}>
                  <p className="mono-label text-muted">{b.index} · {b.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-fg/85">{b.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {projects.map((p, i) => (
          <Section key={p.title} chapter={chapters[2 + i]!}>
            <article className={card}>
              {i === 0 && (
                <p className="mono-label mb-6 text-accent">{projectsSection.eyebrow} · {projectsSection.heading}</p>
              )}
              <p className="mono-label text-muted">
                Project {p.index} / {String(projects.length).padStart(2, "0")} · {p.tags.join(" · ")}
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl">{p.title}</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-fg/85 sm:text-base">{p.description}</p>
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
                <Image src={p.screenshot} alt={p.alt} width={1920} height={1020} sizes="(min-width: 640px) 560px, 100vw" className="h-auto w-full" />
              </a>
            </article>
          </Section>
        ))}

        <Section chapter={chapters[chapters.length - 2]!}>
          <div className={card}>
            <p className="mono-label text-muted">{about.latestCourse.label}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight">{about.latestCourse.titleLines[0]}</h2>
            <p className="mt-2 font-display text-xl text-fg/85">{about.latestCourse.titleLines[1]}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-fg/85">{about.latestCourse.blurb}</p>
            <div className="mt-6">
              <a href={about.latestCourse.url} target="_blank" rel="noreferrer" className={primary}>{about.latestCourse.linkLabel} ↗</a>
            </div>
          </div>
        </Section>

        <Section chapter={chapters[chapters.length - 1]!}>
          <div className={card}>
            <p className="mono-label text-muted">{contact.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl">{contact.heading}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-fg/85 sm:text-base">{contact.supporting}</p>
            <a href={`mailto:${contact.email}`} className="mt-6 block break-all font-display text-2xl text-accent underline-offset-4 hover:underline sm:text-3xl">
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
          </div>
        </Section>

        <footer className="relative px-5 pb-10 sm:px-8 lg:px-16">
          <p className="mono-label text-muted">© 2026 {site.name} · Built with Next.js, Three.js &amp; WebGL</p>
        </footer>
      </main>
    </>
  );
}
