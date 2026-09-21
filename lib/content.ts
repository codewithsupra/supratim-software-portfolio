// All copy lives here, transcribed from CONTENT.md. Components stay structural.
// Every claim traces to a verified fact; every URL was loaded before it went in.

export interface Project {
  index: string;
  title: string;
  tags: string[];
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  screenshot: string;
  alt: string;
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
    { value: "6", label: "Live systems, all open source" },
    { value: "2", label: "Merged pull requests in Tiptap" },
    { value: "38K", label: "Stars on the repo they landed in" },
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
      body: "I landed two pull requests in Tiptap, the rich-text framework with 38K GitHub stars — fixing a Link-extension bug that had been open for seven months, and a defect that silently stripped bold and italic from indented numbered lists.",
    },
    {
      index: "04",
      title: "The craft",
      body: "After completing Zero To Mastery's Fullstack, Frontend, Backend and React career paths, I built and shipped six systems solo in 2026. The thread through all of them is correctness under failure: safe job claiming, crash recovery, and chaos tests — one engine ran 20 workflows through 187 random worker kills with every step succeeding exactly once.",
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
    index: "01",
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
    index: "02",
    title: "Durable Agent Engine",
    tags: ["Backend", "Queues", "2026"],
    description:
      "A crash-safe engine for multi-step AI-agent workflows, built on Postgres SKIP LOCKED — chaos-tested with 187 random worker kills across 20 runs.",
    tech: ["Node.js", "PostgreSQL", "WebSockets"],
    liveUrl:
      "https://durable-agent-engine-b034212e-e938-4496-b3f0-50045a25b6f9.fly.dev",
    githubUrl: "https://github.com/codewithsupra/durable-agent-engine",
    screenshot: "/dae.jpg",
    alt: "Durable Agent Engine — live run dashboard for a multi-step agent workflow",
  },
  {
    index: "03",
    title: "Pulse",
    tags: ["Backend", "Monitoring", "2026"],
    description:
      "Uptime and incident monitoring where only one instance runs each health check, however many are deployed, with live status over WebSockets and 19 integration tests.",
    tech: ["Node.js", "MongoDB", "Socket.io", "Docker"],
    liveUrl: "https://pulse-wy6e.onrender.com",
    githubUrl: "https://github.com/codewithsupra/pulse",
    screenshot: "/pulse.jpg",
    alt: "Pulse — uptime and incident monitoring dashboard",
  },
  {
    index: "04",
    title: "OSS Finder",
    tags: ["Full-Stack", "Web App", "2026"],
    description:
      "Ranks open-source projects by how likely they are to merge a first-time contributor's pull request.",
    tech: ["React", "TypeScript", "Redux Toolkit", "RTK Query"],
    liveUrl: "https://oss-finder-phi.vercel.app",
    githubUrl: "https://github.com/codewithsupra/oss-finder",
    screenshot: "/ossfinder.jpg",
    alt: "OSS Finder — ranked list of open-source projects for first contributions",
  },
  {
    index: "05",
    title: "Anchor",
    tags: ["Offline-First", "CRDTs", "2026"],
    description:
      "A local-first note editor that saves every keystroke in the browser as a CRDT, works offline, and syncs open tabs live with no server.",
    tech: ["TypeScript", "Yjs", "IndexedDB", "Tiptap"],
    liveUrl: "https://anchor-ai-indol.vercel.app",
    githubUrl: "https://github.com/codewithsupra/anchor.ai",
    screenshot: "/anchor.jpg",
    alt: "Anchor — offline-first note editor interface",
  },
  {
    index: "06",
    title: "Aria",
    tags: ["Accessibility", "AI", "2026"],
    description:
      "WCAG auditing that pairs axe-core rule checks with GPT-4o Vision analysis of the rendered page, in one severity-graded report with suggested fixes.",
    tech: ["Next.js", "TypeScript", "Puppeteer", "axe-core"],
    liveUrl: "https://aria-acess.vercel.app",
    githubUrl: "https://github.com/codewithsupra/aria-acess.ai",
    screenshot: "/aria.jpg",
    alt: "Aria — accessibility audit report interface",
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
  builtWith: "Built with Next.js, Three.js & WebGL. Design adapted from Jacinto Wong's portfolio.",
};

export const site = {
  name: "Supratim Sarkar",
  logo: "SS",
  title: "Supratim Sarkar — Software Engineer",
  description:
    "Software engineer building web products that stay correct under failure. Six live systems, all open source.",
  githubUrl: "https://github.com/codewithsupra",
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
};
