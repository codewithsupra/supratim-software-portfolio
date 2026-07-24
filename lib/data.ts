export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  year: number;
  category: string;
  mainImage: string;
  images: string[];
  video?: string;
};

export type OpenSourceContrib = {
  repo: string;
  stars: string;
  prs: { id: string; url: string; summary: string }[];
};

export const projects: Project[] = [
  {
    slug: "pulse",
    title: "Pulse",
    tagline: "Real-Time API Uptime & Incident Monitoring",
    description:
      "A production uptime monitor built around a multi-worker job scheduler running on MongoDB primitives rather than a queue library — any number of instances share one queue with no double-execution, and incidents stream to the dashboard as they open and resolve.",
    bullets: [
      "Built a multi-worker job scheduler on MongoDB using an atomic findOneAndUpdate as a distributed lock, with a worker_threads pool for off-event-loop HTTP checks — any number of instances can share one queue with zero double-execution.",
      "Incidents auto-open and resolve with MTTR streamed to the React dashboard over WebSockets; uptime and latency analytics are computed in MongoDB aggregation pipelines rather than in application code.",
      "Shipped with a full Jest suite, Docker, and GitHub Actions CI, deployed and running in production.",
    ],
    stack: ["Node.js", "Express", "MongoDB", "Socket.io", "worker_threads", "React", "Docker", "GitHub Actions"],
    liveUrl: "https://pulse-wy6e.onrender.com",
    githubUrl: "https://github.com/codewithsupra/pulse",
    year: 2026,
    category: "Distributed Systems",
    mainImage: "/pulse_1.png",
    images: ["/pulse_1.png"],
  },
  {
    slug: "assay",
    title: "Assay",
    tagline: "Verified Proof-of-Skill for Deployed Projects",
    description:
      "A consent-first load-testing and verification platform. Prove you own a deployed app, and Assay runs uptime probes and real load campaigns against it, then issues a cryptographically signed report you can drop into a README — no screenshots, no self-reported numbers.",
    bullets: [
      "Consent-first by design: no traffic runs until the owner proves control of the target via a served token or a DNS record, and every campaign is hard-capped server-side — a live request for 9,999 connections over 9,999 seconds came back clamped to 50/30s — with per-target cooldowns and abort-on-error-budget logic, so it cannot be aimed at infrastructure someone doesn't own.",
      "Built a Postgres SKIP LOCKED job queue feeding a separate autocannon runner process, coordinated across OS processes over LISTEN/NOTIFY since the runner cannot share the API's in-memory socket server.",
      "Every report is Ed25519-signed, because the entire premise is a result the reader shouldn't have to take on trust — a tamper test in CI proves an edited report fails verification.",
    ],
    stack: ["Node.js", "PostgreSQL", "autocannon", "Socket.io", "React", "Framer Motion", "Ed25519"],
    liveUrl: "https://assay-etaq.onrender.com",
    githubUrl: "https://github.com/codewithsupra/assay",
    year: 2026,
    category: "Distributed Systems",
    mainImage: "/assay_1.png",
    images: ["/assay_1.png"],
  },
  {
    slug: "oss-finder",
    title: "OSS Finder",
    tagline: "Open-Source Contribution Discovery",
    description:
      "A tool that finds open-source issues worth your time — filtered to repos that actually merge outsiders' pull requests, with honest difficulty estimates and AI coaching on how to get yours accepted.",
    bullets: [
      "Architected the client state layer end-to-end in Redux Toolkit, including an RTK Query queryFn that fans out parallel GitHub Search API calls and normalizes the results into per-repo health scores (maintainer activity, external-contributor merge rate, median days-to-merge).",
      "Gated AI features on real Clerk Billing entitlements via useAuth().has({ feature }) rather than a cosmetic paywall, with a tiered usage-quota system enforced server-side.",
      "Parses uploaded resumes to text entirely in the browser, lazy-loading the ~1 MB PDF parser via dynamic import() so the shipped bundle stays flat for every user who never uploads a file. LLM calls proxy through serverless functions so provider keys never reach the client.",
    ],
    stack: ["React 19", "Redux Toolkit", "RTK Query", "Clerk (Auth + Billing)", "Tailwind CSS", "Vercel Functions", "OpenRouter"],
    liveUrl: "https://oss-finder-phi.vercel.app",
    githubUrl: "https://github.com/codewithsupra/oss-finder",
    year: 2026,
    category: "Frontend",
    mainImage: "/ossfinder_1.png",
    images: ["/ossfinder_1.png"],
  },
  {
    slug: "durable-agent-engine",
    title: "Durable Agent Engine",
    tagline: "Fault-Tolerant LLM Agent Orchestrator",
    description:
      "Most agent demos show the happy path. This one shows what happens when a worker crashes mid-step, two workers race for the same job, or a tool call fails — and proves the run still finishes correctly, exactly once, every time.",
    bullets: [
      "Built a Postgres-native durable queue for multi-step LLM agent DAGs — no Redis, no queue library — with SKIP LOCKED exactly-once claiming, a lock-TTL reaper that reclaims work from crashed workers, and exponential-backoff retries into a dead-letter table.",
      "Proved crash-safety with a chaos test injecting 40% failures plus kill -9 mid-run: every run still reaches a terminal state, with an append-only audit log of every state transition.",
      "Live demo streams each step's claim, retry, and completion over WebSockets so the failure handling is observable rather than asserted.",
    ],
    stack: ["Node.js", "PostgreSQL", "WebSockets", "Fly.io"],
    liveUrl: "https://durable-agent-engine-b034212e-e938-4496-b3f0-50045a25b6f9.fly.dev",
    githubUrl: "https://github.com/codewithsupra/durable-agent-engine",
    year: 2026,
    category: "Distributed Systems",
    mainImage: "/dae_1.png",
    images: ["/dae_1.png"],
  },
  {
    slug: "pantry-chef",
    title: "PantryChef",
    tagline: "AI Kitchen Assistant",
    description:
      "A pantry tracker that ranks recipes by how ready they are to cook right now, with a tool-calling agent that does the busywork — built as a progressive-enhancement app that still works with JavaScript disabled.",
    bullets: [
      "Built every mutation as a real HTML <form> under React Router v7's useFetcher, so pantry edits still work with JavaScript disabled — genuine progressive enhancement rather than optimistic UI layered over a client-only SPA.",
      "Streams the agent's execution to the UI step by step (plan → tool call → result) instead of a single final answer, so the user sees what it actually did to their data.",
      "Backed the agent with a three-model fallback chain across free-tier LLM endpoints, because no single free provider stayed up reliably enough on its own.",
    ],
    stack: ["React Router v7", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://pantry-chef-7s80.onrender.com",
    githubUrl: "https://github.com/codewithsupra/pantry-chef",
    year: 2026,
    category: "Frontend",
    mainImage: "/pantrychef_1.png",
    images: ["/pantrychef_1.png"],
  },
  {
    slug: "founder-os",
    title: "FounderOS",
    tagline: "AI Chief of Staff for Startup Founders",
    description:
      "A streaming AI pipeline and persistent memory system that gives startup founders a context-aware assistant — remembering decisions, pivots, and milestones so recommendations are specific rather than generic.",
    bullets: [
      "Built a streaming AI pipeline using ReadableStream.tee() to fork the model response — one branch streams tokens to the user instantly while the other persists the conversation and extracts context records in parallel, so memory saving never blocks the reply.",
      "Designed a memory system that captures decisions, pivots, and milestones from user actions and injects the 10 most relevant records into every system prompt.",
      "Shipped Stripe subscription billing across four tiers with HMAC-verified webhooks and server-side feature gating, on Postgres with row-level security and an isolated admin service client for privileged routes.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "OpenRouter/GPT-4o", "Stripe", "Postgres (RLS)"],
    liveUrl: "https://founder-os.insforge.site",
    githubUrl: "https://github.com/codewithsupra/founder-os",
    year: 2026,
    category: "AI Engineering",
    mainImage: "/preview_dashboard.jpg",
    images: ["/preview_intro.jpg", "/preview_dashboard.jpg", "/preview_ai_chat.jpg", "/preview_features.jpg", "/preview_growth.jpg", "/preview_kpis.jpg", "/preview_weekly.jpg", "/preview_competitors.jpg"],
    video: "/FounderOS_pitch.mp4",
  },
];

export const openSource: OpenSourceContrib[] = [
  {
    repo: "Tiptap",
    stars: "37k",
    prs: [
      {
        id: "PR #7977",
        url: "https://github.com/ueberdosis/tiptap/pull/7977",
        summary:
          "Fixed a Link-extension crash (“No value supplied for attribute class”) by coercing an undefined HTMLAttributes field to null in addAttributes(). Merged.",
      },
      {
        id: "PR #7998",
        url: "https://github.com/ueberdosis/tiptap/pull/7998",
        summary:
          "Root-caused a markdown-parser bug where indented ordered-list items silently lost bold and italic formatting — a hardcoded base indent made the tokenizer bail out. Fixed by deriving it from the list's own first item. Merged.",
      },
    ],
  },
];

export const skills = {
  Languages: ["TypeScript", "JavaScript (ES6+)", "SQL", "HTML5", "CSS3"],
  Frontend: ["React 19", "Next.js", "React Router v7", "Redux Toolkit", "RTK Query", "Tailwind CSS", "Framer Motion", "Zod"],
  "Backend & APIs": ["Node.js", "Express", "REST", "GraphQL", "WebSockets", "Socket.io", "worker_threads", "Prisma", "Drizzle ORM"],
  Databases: ["PostgreSQL", "MongoDB", "IndexedDB"],
  "AI Engineering": ["OpenAI SDK / OpenRouter", "Claude API", "Gemini API", "Response streaming", "Structured JSON generation"],
  "Cloud & DevOps": ["AWS (SAA-C03)", "Docker", "GitHub Actions", "Render", "Fly.io", "Vercel", "Stripe"],
  Testing: ["Jest", "React Testing Library", "Chaos / fault-injection testing", "TDD"],
};
