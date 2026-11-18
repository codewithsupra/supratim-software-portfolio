"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { about, contact, elsewhere, hero, projects, type Project } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";
import { go, projectIdOf, setState, useKiosk, type Station } from "./store";

const btn =
  "mono-label inline-flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors";
export const primaryBtn = `${btn} border-accent/60 text-accent hover:bg-accent/10`;
export const secondaryBtn = `${btn} border-fg/15 text-fg hover:border-accent/50 hover:text-accent`;
const link = "link-sweep pb-0.5 text-accent";

function titleFor(station: Station): string {
  const id = projectIdOf(station);
  if (id) return projects.find((p) => p.id === id)?.title ?? "Work";
  return { work: "Work", about: "About", "open-source": "Open source", contact: "Contact", overview: "" }[station as "work"];
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

function WorkList() {
  return (
    <div>
      <p className="text-muted">Six things I built in 2026. Each one is on a set behind the counter.</p>
      <ul className="mt-6 grid gap-2">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => go(`project:${p.id}`)}
              onMouseEnter={() => setState({ hover: `tv-${p.id}` })}
              onMouseLeave={() => setState({ hover: null })}
              onFocus={() => setState({ hover: `tv-${p.id}` })}
              onBlur={() => setState({ hover: null })}
              className="group grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-3 rounded-card border border-fg/10 px-4 py-3 text-left transition-colors hover:border-accent/50"
            >
              <span className="mono-label text-muted">{p.index}</span>
              <span className="font-display text-xl tracking-tight group-hover:text-accent">{p.title}</span>
              <span />
              <span className="mono-label mt-1 text-muted">{p.tags.join(" · ")}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(i - 1 + projects.length) % projects.length]!;
  const next = projects[(i + 1) % projects.length]!;
  return (
    <div>
      <div className="overflow-hidden rounded-card border border-fg/10">
        {project.screenshot ? (
          <Image src={project.screenshot} alt={project.alt} width={1600} height={900} sizes="440px" className="h-auto w-full" />
        ) : (
          <figure className="bg-surface p-4">
            <pre aria-label={project.alt} className="overflow-x-auto font-mono text-[9.5px] leading-snug text-muted">
              {project.diagram}
            </pre>
          </figure>
        )}
      </div>
      <p className="mono-label mt-6 text-muted">
        {project.index} · {project.tags.join(" · ")}
      </p>
      <p className="mt-3 leading-relaxed text-fg/90">{project.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <li key={t} className="mono-label rounded-full border border-fg/10 px-3 py-1.5 text-muted">
            {t}
          </li>
        ))}
      </ul>
      {project.credit && <p className="mt-5 text-sm leading-relaxed text-muted">{project.credit}</p>}
      <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        {project.liveUrl && <External href={project.liveUrl}>{project.liveLabel ?? "Visit live"}</External>}
        {project.githubUrl && <External href={project.githubUrl}>Source code</External>}
        {!project.githubUrl && <span className="text-muted">Private repository</span>}
      </p>
      <div className="mt-8 flex items-center justify-between border-t border-fg/10 pt-5">
        <button type="button" onClick={() => go(`project:${prev.id}`)} className="mono-label text-muted hover:text-accent">
          ← {prev.title}
        </button>
        <button type="button" onClick={() => go(`project:${next.id}`)} className="mono-label text-muted hover:text-accent">
          {next.title} →
        </button>
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div>
      <p className="mono-label text-muted">{hero.eyebrow}</p>
      <p className="mt-4 font-display text-2xl leading-tight tracking-tight">{about.heading}</p>
      <dl className="mt-6 grid grid-cols-3 gap-3">
        {about.stats.map((s) => (
          <div key={s.label} className="rounded-card border border-fg/10 p-3">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-3xl tracking-tight">{s.value}</dd>
            <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
          </div>
        ))}
      </dl>
      <ol className="mt-8 grid gap-6">
        {about.storyBeats.map((b) => (
          <li key={b.index}>
            <p className="mono-label text-muted">
              {b.index} · {b.title}
            </p>
            <p className="mt-2 leading-relaxed text-fg/85">{b.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OpenSourcePanel() {
  const o = about.latestCourse;
  return (
    <div>
      <p className="font-display text-2xl leading-tight tracking-tight">{o.titleLines.join(" ")}</p>
      <p className="mt-4 leading-relaxed text-fg/85">{o.blurb}</p>
      <p className="mt-6 text-sm">
        <External href={o.url}>{o.linkLabel}</External>
      </p>
    </div>
  );
}

function ContactPanel() {
  return (
    <div>
      <p className="font-display text-3xl leading-tight tracking-tight">{contact.heading}</p>
      <p className="mt-4 leading-relaxed text-fg/85">{contact.supporting}</p>
      <p className="mt-6">
        <a href={`mailto:${contact.email}`} className={`${link} font-display text-xl`}>
          {contact.email}
        </a>
      </p>
      <p className="mono-label mt-3 text-muted">{contact.location}</p>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {elsewhere.map((e) => (
          <li key={e.label}>
            <External href={e.href}>
              {e.label} · {e.handle}
            </External>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-fg/10 pt-6">
        <ContactForm />
      </div>
    </div>
  );
}

/** The readable side of every station: opens beside the framed object, closes with Esc. */
export function Panel() {
  const station = useKiosk((s) => s.station);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = projectIdOf(station);
  const project = id ? projects.find((p) => p.id === id) : undefined;
  const open = station !== "overview";

  useEffect(() => {
    if (open) heading.current?.focus({ preventScroll: true });
  }, [station, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (station.startsWith("project:")) go("work");
      else if (station !== "overview") go("overview");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [station]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {open && (
          <motion.aside
            key={project ? "project" : station}
            aria-labelledby="panel-title"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 max-h-[64vh] overflow-y-auto rounded-t-[20px] border border-fg/10 bg-bg/80 p-6 backdrop-blur-xl sm:p-8 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:top-24 lg:max-h-none lg:w-[460px] lg:rounded-card"
          >
            <div className="flex items-center justify-between gap-4">
              {project ? (
                <button type="button" onClick={() => go("work")} className="mono-label text-muted hover:text-accent">
                  ← All work
                </button>
              ) : (
                <span className="mono-label text-muted">Supratim&apos;s repairs</span>
              )}
              <button
                type="button"
                onClick={() => go("overview")}
                aria-label="Close and return to the kiosk"
                className="mono-label rounded-full border border-fg/15 px-3 py-1.5 text-muted hover:border-accent/50 hover:text-accent"
              >
                Close
              </button>
            </div>
            <h2 id="panel-title" ref={heading} tabIndex={-1} className="mt-6 font-display text-4xl tracking-tight outline-none">
              {project ? project.title : titleFor(station)}
            </h2>
            <div className="mt-5">
              {project && <ProjectDetail project={project} />}
              {station === "work" && <WorkList />}
              {station === "about" && <AboutPanel />}
              {station === "open-source" && <OpenSourcePanel />}
              {station === "contact" && <ContactPanel />}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}


