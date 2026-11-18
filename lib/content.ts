// All copy lives here, transcribed from CONTENT.md. Components stay structural.
// Every claim traces to a verified fact; every URL was loaded before it went in.

export interface Project {
  /** Stable key, used by the kiosk scene to place the project on its TV. */
  id: string;
  index: string;
  title: string;
  tags: string[];
  description: string;
  tech: string[];
  /** Absent for projects with nothing to open in a browser (Termpilot is a CLI). */
  liveUrl?: string;
  liveLabel?: string;
  /** Absent when the repository is private (Cairn). */
  githubUrl?: string;
  /** Absent when there is no web page to capture; `diagram` is shown instead. */
  screenshot?: string;
  alt: string;
  /** Plain-text diagram copied from the project README, shown when there is no screenshot. */
  diagram?: string;
  /** Required attribution, e.g. a project built by following a tutorial. */
  credit?: string;
}

export const hero = {
  eyebrow: "Software Engineer · Ex-Mendix (Siemens) · Muscat, Oman",
  name: { first: "Supratim", second: "Sarkar" },
  subhead:
    "Building software that stays correct when workers crash, jobs collide, and someone checks the numbers.",
  scrollHint: "Scroll",
};

export const about = {
  eyebrow: "About me",
  heading: "An engineer who proves guarantees instead of asserting them.",
  stats: [
    { value: "5", label: "Live products, shipped in 2026" },
    { value: "2", label: "Merged pull requests in Tiptap" },
    { value: "39K", label: "Stars on the repo they landed in" },
  ],
  storyBeats: [
    {
      index: "01",
      title: "The foundation",
      body: "I studied Computer Science at VIT, then completed a joint M.Sc. in Software Engineering & Green IT at VU Amsterdam and the University of Amsterdam. I'm also an AWS Certified Solutions Architect – Associate.",
    },
    {
      index: "02",
      title: "First production code",
      body: "At Mendix, a Siemens company, I interned in a cross-functional team on the React and TypeScript UI of a drag-and-drop microflow editor — migrating parts of it to TypeScript, writing Jest and React Testing Library tests, and fixing bugs from the team backlog, with every change reviewed by senior engineers.",
    },
    {
      index: "03",
      title: "Open source",
      body: "I landed two pull requests in Tiptap, the rich-text framework with 39K GitHub stars — fixing a Link-extension bug that had been open for seven months, and a defect that silently stripped bold and italic from indented numbered lists.",
    },
    {
      index: "04",
      title: "The craft",
      body: "After completing Zero To Mastery's Fullstack, Frontend, Backend and React career paths, I shipped a run of AI products in 2026. The thread through them is staying honest when things go wrong: Sponsorbound only calls an employer a licensed sponsor when the register link is confirmed, Verdict refuses to give a verdict it can't support, and Daybrief falls back to a rule-based plan when the model is down.",
    },
    {
      index: "05",
      title: "What's next",
      body: "I'm looking for a junior or mid-level role on a team that cares about the parts demos skip. Based in Muscat, Oman — open to remote roles worldwide, or on-site in Oman.",
    },
  ],
  latestCourse: {
    label: "Open source",
    // Rendered as two lines, broken after the colon.
    titleLines: ["Tiptap:", "Two merged pull requests"],
    blurb:
      "Fixed a Link-extension bug that had gone unresolved for seven months, and a Markdown-parser defect that silently stripped bold and italic from indented numbered lists. Both reviewed and merged by Tiptap's engineers.",
    url: "https://github.com/ueberdosis/tiptap/pulls?q=is%3Apr+author%3Acodewithsupra+is%3Amerged",
    linkLabel: "View the pull requests",
  },
  nowPanel: {
    label: "Now building",
    // Rendered as two lines, broken after the colon.
    titleLines: ["Verdict:", "Regression testing for LLM agents"],
    blurb:
      "Tells you whether a prompt change actually made an agent worse, or whether you're looking at sampling noise — using a paired bootstrap that refuses to answer when there aren't enough cases to support one.",
    url: "https://verdict-pi-peach.vercel.app",
    linkLabel: "Try it live",
  },
};

export const projectsSection = {
  eyebrow: "Selected work",
  heading: "Things I've Built",
};

export const projects: Project[] = [
  {
    id: "sponsorbound",
    index: "01",
    title: "Sponsorbound",
    tags: ["AI", "Data pipeline", "2026"],
    description:
      "An AI job-search assistant for international students. It pulls about 9,300 vacancies from public job-board APIs, matches employers to 147,002 UK, Dutch and Irish visa-sponsor records, and only says \u201clicensed sponsor\u201d when the register link is confirmed.",
    tech: ["Next.js", "TypeScript", "Supabase", "Vercel AI SDK"],
    liveUrl: "https://h1bound.vercel.app",
    githubUrl: "https://github.com/codewithsupra/h1bound",
    screenshot: "/sponsorbound.jpg",
    alt: "Sponsorbound — landing page with a map of licensed visa sponsors across the UK, Netherlands and Ireland",
  },
  {
    id: "verdict",
    index: "02",
    title: "Verdict",
    tags: ["LLM Evals", "Statistics", "2026"],
    description:
      "Regression testing for LLM agents — a paired two-level bootstrap that separates a real quality drop from sampling noise, and withholds a verdict when it can't tell.",
    tech: ["TypeScript", "Node.js", "PostgreSQL", "Vitest"],
    liveUrl: "https://verdict-pi-peach.vercel.app",
    githubUrl: "https://github.com/codewithsupra/verdict",
    screenshot: "/verdict.jpg",
    alt: "Verdict — comparison of two prompt revisions with a confidence interval and verdict",
  },
  {
    id: "daybrief",
    index: "03",
    title: "Daybrief",
    tags: ["AI", "Gmail API", "2026"],
    description:
      "Reads your Gmail and where your browsing time went, then emails a ranked plan every morning. It drafts replies into Gmail but never sends mail, and a Chrome extension records time per site without page contents.",
    tech: ["Next.js", "TypeScript", "Neon Postgres", "Chrome extension"],
    liveUrl: "https://daybrief-puce.vercel.app/demo",
    liveLabel: "Try the demo",
    githubUrl: "https://github.com/codewithsupra/daybrief",
    screenshot: "/daybrief.jpg",
    alt: "Daybrief — dashboard with today's plan, attention chart and emails waiting on a reply",
  },
  {
    id: "persona",
    index: "04",
    title: "Persona Assist",
    tags: ["AI agent", "Telegram", "2026"],
    description:
      "A Claude assistant that lives in Telegram. It looks up live data and builds files in a private sandbox per user, and every message passes a webhook-secret, sender and billing check before it reaches the model.",
    tech: ["Hono", "TypeScript", "Neon Postgres", "Clerk"],
    liveUrl: "https://ai-assistant-d2gc.onrender.com",
    githubUrl: "https://github.com/codewithsupra/ai-assistant",
    screenshot: "/persona.jpg",
    alt: "Persona Assist — landing page with an example Telegram conversation",
  },
  {
    id: "cairn",
    index: "05",
    title: "Cairn",
    tags: ["AI", "Code editor", "2026"],
    description:
      "A browser-based AI workbench: describe what you want, an agent assembles the files, and you edit them in a live CodeMirror editor beside an in-browser preview. There is a no-login playground to try it.",
    tech: ["Next.js", "Convex", "Clerk", "Inngest"],
    liveUrl: "https://cairn-swart-beta.vercel.app/try",
    liveLabel: "Try without signing in",
    screenshot: "/cairn.jpg",
    alt: "Cairn — code editor with a live preview and an AI prompt bar",
  },
  {
    id: "termpilot",
    index: "06",
    title: "Termpilot",
    tags: ["AI agent", "CLI", "2026"],
    description:
      "An AI coding agent in your terminal: chat with a model that reads, searches and edits files and runs commands on your machine, with a read-only Plan mode beside the full Build mode.",
    tech: ["Bun", "TypeScript", "Hono", "Prisma"],
    githubUrl: "https://github.com/codewithsupra/termpilot",
    alt: "Termpilot — architecture: the terminal app runs tools locally while a Hono server streams the model reply",
    diagram: ` terminal (CLI)                 server (Hono)              services
┌───────────────────┐  SSE  ┌──────────────────────┐   ┌──────────────┐
│ React UI (OpenTUI)│ ────▶ │ /chat  streams reply │ ─▶│ Claude /     │
│ local tools:      │       │ /sessions            │   │ OpenAI /     │
│  read, list, glob,│ ◀──── │ /billing  /auth      │ ─▶│ Gemini       │
│  grep, edit, bash │ tool  └──────────────────────┘   │ Neon, Clerk, │
└───────────────────┘ calls                            │ Polar        │
                                                       └──────────────┘`,
    credit:
      "Built by following Code with Antonio's nightcode tutorial; the README lists what I added or changed.",
  },
];

export const contact = {
  eyebrow: "Contact",
  heading: "Let's build something.",
  supporting:
    "Hiring for a frontend, backend or full-stack role? I'm available now — remote worldwide, or on-site in Oman.",
  email: "supratim347@gmail.com",
  location: "Muscat, Oman",
  form: {
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "your.email@example.com" },
    message: {
      label: "Message",
      placeholder: "Tell me about the role or the project...",
    },
    submit: "Send message",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      message: "Please enter a message.",
      messageLength: "Please keep your message under 5,000 characters.",
    },
    status: {
      sending: "Sending…",
      sent: "Message sent — I'll get back to you soon.",
      failed: "Something went wrong. Please try again or email me directly.",
    },
  },
};

export interface ElsewhereLink {
  label: string;
  handle: string;
  href: string;
}

export const elsewhere: ElsewhereLink[] = [
  {
    label: "LinkedIn",
    handle: "in/supratimsarkar99",
    href: "https://www.linkedin.com/in/supratimsarkar99/",
  },
  {
    label: "GitHub",
    handle: "codewithsupra",
    href: "https://github.com/codewithsupra",
  },
];

export const skillsBand = [
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "Distributed Systems",
  "MongoDB",
  "React",
  "Next.js",
  "AWS",
];

export const footer = {
  locationEyebrow: "Based in Muscat, Oman",
  wordmark: { first: "Supratim", second: "Sarkar" },
  elsewhereLabel: "Elsewhere",
  backToTop: "Back to top",
  copyright: "© 2026 Supratim Sarkar. All rights reserved.",
  builtWith: "Built with Next.js, Three.js & WebGL. Scene inspired by Jesse Zhou's ramen shop portfolio; résumé view adapted from Jacinto Wong's portfolio.",
};

export const site = {
  name: "Supratim Sarkar",
  logo: "SS",
  title: "Supratim Sarkar — Software Engineer",
  description:
    "Software engineer building AI products that stay honest when things go wrong. Five live products, shipped in 2026.",
  githubUrl: "https://github.com/codewithsupra",
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
};
