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
  eyebrow: "Backend Engineer · Ex-Mendix (Siemens) · Muscat, Oman",
  name: { first: "Supratim", second: "Sarkar" },
  subhead:
    "Building backend systems that stay correct when workers crash, jobs collide, and someone checks the numbers.",
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
      body: "At Mendix, a Siemens company, I shipped React and TypeScript into a drag-and-drop microflow editor used by thousands of enterprise developers — migrating core modules to TypeScript at around 85% test coverage without pausing releases.",
    },
    {
      index: "03",
      title: "Open source",
      body: "I landed two pull requests in Tiptap, the rich-text framework with 38K stars and 16.8M weekly downloads — fixing a crash that had been open for seven months and a defect that silently stripped formatting from nested lists.",
    },
    {
      index: "04",
      title: "The craft",
      body: "Since January 2026 I've built and shipped six systems solo. The thread through all of them is correctness under failure: exactly-once scheduling, crash recovery, and chaos tests that prove the guarantee holds.",
    },
    {
      index: "05",
      title: "What's next",
      body: "I'm looking for a team that cares about the parts demos skip. Based in Muscat, Oman — open to remote roles, or relocating to Bengaluru immediately.",
    },
  ],
  latestCourse: {
    label: "Open source",
    // Rendered as two lines, broken after the colon.
    titleLines: ["Tiptap:", "Two merged pull requests"],
    blurb:
      "Fixed a Link-extension crash that had gone unresolved for seven months, and a markdown-parser defect that silently stripped bold and italic from nested lists. Both reviewed and merged by the maintainers.",
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
      "A fault-tolerant engine for multi-step LLM agent workflows, built on Postgres SKIP LOCKED — chaos-tested by killing workers mid-task.",
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
      "Uptime and incident monitoring where each health check runs exactly once across any number of instances, with live status over WebSockets.",
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
      "A note editor with conflict-free multi-device sync that never loses an edit, online or offline.",
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
      "WCAG auditing that pairs axe-core rule checks with visual analysis of the rendered page, returning a full report in under ten seconds.",
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
    "Hiring for a backend or full-stack role? I'm available now — remote, or on-site in Bengaluru.",
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
  title: "Supratim Sarkar — Backend Engineer",
  description:
    "Backend engineer building distributed systems that stay correct under failure. Six live systems, all open source.",
  githubUrl: "https://github.com/codewithsupra",
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
};
