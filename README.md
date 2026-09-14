# Supratim Sarkar — Portfolio

This is the site you are building in **The Vibe Coding Bootcamp**. It is a one-page personal portfolio whose only job is to make a team hiring a backend or full-stack engineer get in touch.

You are not assembling a template. You are directing a finished piece: look, copy, motion, and the constraints that keep an AI agent from inventing extras. When you fork this into your own portfolio, keep that job. Pretty is not the test. Would the person you want to hire you actually reach out?

Design adapted from Jacinto Wong's portfolio for The Vibe Coding Bootcamp ([jacinto-design-portfolio-v2](https://github.com/JacintoDesign/jacinto-design-portfolio-v2)), which the bootcamp shares for students to fork into their own portfolios. All content is Supratim's own.

## What the page does

Four parts, in this order:

1. **Hero** — full-viewport fold. A WebGL nebula sits behind the wordmark. The field lags the cursor, pins, and scrubs as you scroll. The headline arrives a line at a time. This is the two seconds that establish the tier.
2. **About** — five story beats on a horizontal track (one beat per screen on desktop), three stats that count up once, then two course cards. Form matches content: the story is chronological, so travel is sideways.
3. **Project grid** — four real, deployed projects. Cards unmask as they enter. Hover is a small lift; the screenshot is the colour, not a cyan border.
4. **Contact** — still, on purpose. A form and an email. Motion here would compete with the one action the page exists for.

A footer follows: a skills marquee, the wordmark, and elsewhere links. Navigation is site-wide chrome — glass after the hero, a menu on small screens.

The nebula is not a hero-only backdrop. It is the ground of the whole page. After the hero it recedes: dimmer, slower, larger, until it reads as texture rather than motion.

## How this repo is organised

Two markdown files are the plan. Code implements them. Do not invent copy, project names, or motion the brief does not assign.

| File | What it is |
| --- | --- |
| `MOTION_BRIEF.md` | The look and the motion plan. Feel, palette, type, every treatment, and what was cut. Read it before you touch animation. |
| `CONTENT.md` | About copy, stats, project details, contact. The only source for words. If something is missing, stop and ask — do not fill the gap. |
| `lib/content.ts` | That copy transcribed into typed data. Components stay structural; they import from here. Change copy in `CONTENT.md` first, then here. |
| `AGENTS.md` / `CLAUDE.md` | Standing orders for you and for any agent you direct. Same rules: do not invent content, do not add dependencies unasked, do not change the palette or type, do not add a preloader. |

Page composition lives in `app/page.tsx`: nebula provider, shader, then the four parts. Layout (skip link, fonts, header, footer) lives in `app/layout.tsx`.

| Path | Role |
| --- | --- |
| `app/globals.css` | Design tokens, `mono-label`, `link-sweep`, reduced-motion-aware utilities |
| `app/actions.ts` | Contact form server action (validate, honeypot, send via Resend) |
| `app/fonts/` | Self-hosted Clash Display (Fontshare, ITF Free Font License) |
| `components/` | One concern per file — hero, about timeline, project card, shader, and so on |
| `components/shader-dev-panel.tsx` | Dev-only sliders for the nebula. Never ships in production. |

## Stack

- **Next.js 16** App Router, **React 19**, TypeScript strict, **Tailwind v4**, deployed on Vercel
- Server components by default. `"use client"` only where the browser has to own the work (scroll, pointer, form state, WebGL)
- **GSAP** + ScrollTrigger — scroll-driven sequences: pinning, scrubbing, parallax, staggered reveals
- **Motion** — component-level interaction: hover, mount, exit (mobile menu, card lift)
- **Three.js** + React Three Fiber — the nebula shader

That split is a rule, not a preference. GSAP owns the scroll. Motion owns the widget. Do not add animation to a part the brief specifies as still. Contact is still. The about heading holds. If a movement draws attention to itself, it is wrong.

## Design system

Tokens are CSS variables in `app/globals.css`. Never hardcode a hex in a component.

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#05030C` | Near-black void |
| `--surface` | `#0D0A18` | Raised panels, cards |
| `--fg` | `#EDEAF5` | Primary text |
| `--muted` | `#8B84A8` | Secondary text, metadata |
| `--indigo` | `#2A1B5E` | Nebula, deep field |
| `--violet` | `#6B3FA0` | Nebula, mid |
| `--magenta` | `#A6329B` | Nebula, highlight |
| `--accent` | `#4DD8E8` | Links, focus, active states **only** |

If something is cyan, it is interactive. That is a promise the palette keeps — the about course card that links takes a cyan border; project cards do not, because the work is the colour.

Type: Clash Display 500/600/700 for display (wordmark, headings, project titles), Inter 400/500 for body, system mono for micro-labels via `mono-label` (11px, tracked +0.18em, uppercase). Two loaded families plus the system mono. No others.

Layout: airy, wide outer margins, content column narrower than it wants to be (`max-w-[68rem]`), 12px card radius (`rounded-card`). Semantic HTML, keyboard reachable, skip link in the layout. Responsive 360–1920px.

`prefers-reduced-motion` is first-class. The shader holds a still frame, the hero does not pin, the about beats fall back to a vertical list, marquees and letter-bounce stop. Build the reduced-motion path; do not bolt it on later.

## Getting started

You need Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page hot-reloads as you edit.

In development, a shader panel is available to tune nebula uniforms live (drift, parallax, scroll, ground recession). Use it to learn how the field is wired; do not treat the defaults as unfinished.

```bash
npm run build    # production build
npm run lint     # ESLint
```

## Making it yours

Work in this order so the agent — and you — stay on the rails:

1. Rewrite `CONTENT.md` as your story, stats, projects, and contact. Keep the structure; change the words. Projects should be real and deployed, not placeholders.
2. Transcribe into `lib/content.ts`. Update screenshots in `public/` to match the paths you set (`screenshot`, `alt`).
3. Point the contact form at you — see below.
4. Only then consider the brief. If you change the feel, edit `MOTION_BRIEF.md` first and implement what it now assigns. Do not sprinkle motion because a tool suggested it.

What this course project is *not*: a preloader with a percentage, magnetic buttons, SplitText on body copy, extra typefaces, or a palette rewrite. Those are listed under **Excluded** in the brief. A loading screen on a site this small adds perceived wait to look serious.

## Contact form

The form posts through a Next.js server action in `app/actions.ts`. It validates on the server, drops bots via a honeypot field (`company`), and sends mail with [Resend](https://resend.com).

Copy `.env.example` to `.env.local` and fill in:

```
RESEND_API_KEY=          # from resend.com
CONTACT_FROM_EMAIL=      # a sender you have verified with Resend
CONTACT_TO_EMAIL=        # where messages should arrive
```

Without those three, submit will fail closed (the visitor sees the error state; nothing is sent). Test the form end to end before you ship.

## Deploy

Vercel is the intended host. Push the repo, import the project, and add the same three env vars in the Vercel dashboard. The production shader panel is compiled out (`NODE_ENV !== "production"`).
