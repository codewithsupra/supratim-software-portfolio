# Supratim Sarkar — Portfolio

Personal portfolio site for Supratim Sarkar, Software Engineer. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

**Repo:** [github.com/codewithsupra/supratim-software-portfolio](https://github.com/codewithsupra/supratim-software-portfolio)

---

## What's inside

### Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, About, Projects, Contact, Footer |
| `/projects/[slug]` | Dynamic detail page per project (statically generated) |

### Sections

- **Hero** — WebGL shader + lightning canvas background, Framer Motion entrance animations, breathing-text subtitle
- **About** — Bio, headshot, open-source contributions (Tiptap), full tech skills grid
- **Projects** — Full-bleed 3-column image grid; hover reveals project title + "View Details" CTA
- **Contact** — `useActionState` form with field validation, honeypot spam protection, and a Next.js API route stub ready for an email provider post-deploy
- **Footer** — Dynamic year, social links (GitHub, LinkedIn, Email)

### Project detail pages

Each project page includes:
- Autoplay / muted / looping cinematic video hero
- Masonry image grid showing full-size screenshots
- Overview, engineering decisions, and tech stack
- View Live + View Code CTAs
- Prev / Next project navigation

### Projects featured

| Project | Stack | Live |
|---|---|---|
| **Pulse** — Real-time API uptime & incident monitoring | Node.js, Express, MongoDB, Socket.io, worker_threads, Docker | [pulse-wy6e.onrender.com](https://pulse-wy6e.onrender.com) |
| **Assay** — Verified proof-of-skill for deployed projects | Node.js, PostgreSQL, autocannon, Socket.io, Ed25519 | [assay-etaq.onrender.com](https://assay-etaq.onrender.com) |
| **OSS Finder** — Open-source contribution discovery | React 19, Redux Toolkit, RTK Query, Clerk, Vercel Functions | [oss-finder-phi.vercel.app](https://oss-finder-phi.vercel.app) |
| **Durable Agent Engine** — Fault-tolerant LLM agent orchestrator | Node.js, PostgreSQL, WebSockets, Fly.io | [live demo](https://durable-agent-engine-b034212e-e938-4496-b3f0-50045a25b6f9.fly.dev) |
| **PantryChef** — AI kitchen assistant | React Router v7, Prisma, PostgreSQL, Tailwind CSS | [pantry-chef-7s80.onrender.com](https://pantry-chef-7s80.onrender.com) |
| **FounderOS** — AI chief of staff for founders | Next.js 16, React 19, OpenRouter/GPT-4o, Stripe, Postgres | [founder-os.insforge.site](https://founder-os.insforge.site) |

Every live URL above is checked before each deploy — a dead link on a portfolio is worse than no link.

---

## Tech stack

- **Framework:** Next.js 16 (App Router) with SSG via `generateStaticParams`
- **UI:** React 19, Tailwind CSS v4, Framer Motion, Three.js (WebGL shaders)
- **Images:** `next/image` — automatic WebP/AVIF, srcset, lazy loading
- **SEO:** Dynamic `<meta>` + OpenGraph tags, JSON-LD structured data (Person + SoftwareApplication schemas), `sitemap.xml`, `robots.txt`
- **Fonts:** Geist Sans + Geist Mono via `next/font`
- **Type safety:** TypeScript throughout

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/
  layout.tsx          # Root layout, Navbar, JSON-LD Person schema
  page.tsx            # Home page (Hero → About → Projects → Contact → Footer)
  sitemap.ts          # Auto-generated sitemap.xml
  robots.ts           # Auto-generated robots.txt
  api/contact/        # Contact form API route (stub — wire up Resend post-deploy)
  projects/[slug]/    # Dynamic project detail pages
components/
  Hero.tsx            # WebGL + lightning background, animated intro
  About.tsx           # Bio, headshot, open-source, skills
  Projects.tsx        # Full-bleed 3-col project grid
  ProjectCard.tsx     # Image card with hover overlay
  Navbar.tsx          # Fixed nav with logo, Home/About/Projects/Contact links
  ContactForm.tsx     # Validated form with honeypot, useActionState
  Footer.tsx          # Social icons, dynamic year
lib/
  data.ts             # All project content, stack, URLs, images — single source of truth
public/
  *.png / *.jpg       # Portfolio screenshots per project
  *_pitch.mp4         # Demo video (FounderOS)
  favicon.svg         # Gradient SVG favicon
```

---

## Deploying

Ready to deploy on **Vercel** with zero config — connect the repo and it builds automatically.

Before going live, wire up the contact form in `app/api/contact/route.ts` using [Resend](https://resend.com) and set `RESEND_API_KEY` as an environment variable.
