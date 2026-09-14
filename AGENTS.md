# AGENTS.md

Standing orders. Not a plan — the plan is `MOTION_BRIEF.md`.

## Project

A personal portfolio. Four parts in page order: hero, about, project grid,
contact. Audience is teams hiring backend and full-stack engineers. Its one
job is to make that person get in touch.

## Stack

Next.js 16 App Router · React 19 (server components by default) ·
TypeScript strict · Tailwind v4 · Vercel

## Sources of truth

- `MOTION_BRIEF.md` — the look, and the motion plan. Read it for structure.
  Do not implement its motion treatments unless the task says to.
- `CONTENT.md` — about copy, stats, project details. Never invent copy,
  project names, or placeholder text. If content is missing, stop and ask.

## Design tokens

Define as CSS variables. Never hardcode a hex in a component.

```
--bg       #05030C    --indigo   #2A1B5E
--surface  #0D0A18    --violet   #6B3FA0
--fg       #EDEAF5    --magenta  #A6329B
--muted    #8B84A8    --accent   #4DD8E8
```

`--accent` is for links, focus and active states only. If something is
cyan, it is interactive.

Type: Clash Display 500/600/700 for display, self-hosted via
`next/font/local` (Fontshare, ITF Free Font License — files in
`app/fonts/`). Inter 400/500 for body via `next/font/google`. Small
uppercase micro-labels (nav, eyebrows, tags, form labels) use the
system mono stack via the `mono-label` utility — 11px, tracked +0.18em.
No other families.

Layout: airy, wide margins, narrow content column, 12px card radius,
responsive 360–1920px. Semantic HTML, keyboard reachable throughout.

## Current phase: MOTION

GSAP owns scroll-driven sequences - pinning, scrubbing, parallax, staggered reveals. Motion owns component-level interaction - hover, mount, exit.

Motion is restricted to what MOTION_BRIEF.md assigns. Don't add animation to a part the brief specifies as still.

## Never

Invent content · add a dependency without asking · add a preloader,
splash screen · change the palette or type unasked