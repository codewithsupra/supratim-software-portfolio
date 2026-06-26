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
- **About** — Bio, headshot, open-source contributions (Tiptap, Infisical), full tech skills grid
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
| **FounderOS** — AI Chief of Staff for founders | Next.js 16, React 19, OpenRouter/GPT-4o, Stripe, InsForge | [v32fvcce.insforge.site](https://v32fvcce.insforge.site/) |
| **Anchor** — Offline-first notes with CRDT sync | Yjs, Tiptap, IndexedDB, y-websocket, Next.js | [anchor-ai-indol.vercel.app](https://anchor-ai-indol.vercel.app/) |
| **Aria** — AI accessibility auditor | Claude Vision API, axe-core, Puppeteer, Next.js, Neon | [aria-acess.vercel.app](https://aria-acess.vercel.app/) |

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
  *_pitch.mp4         # Demo videos (FounderOS, Anchor, Aria)
  favicon.svg         # Gradient SVG favicon
```

---

## Deploying

Ready to deploy on **Vercel** with zero config — connect the repo and it builds automatically.

Before going live, wire up the contact form in `app/api/contact/route.ts` using [Resend](https://resend.com) and set `RESEND_API_KEY` as an environment variable.
