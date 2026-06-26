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
    slug: "founder-os",
    title: "FounderOS",
    tagline: "AI Chief of Staff for Startup Founders",
    description:
      "A streaming AI pipeline and persistent memory system that gives startup founders a context-aware AI co-founder — remembering decisions, pivots, and milestones to deliver specific recommendations instead of generic answers.",
    bullets: [
      "Built a streaming AI pipeline using ReadableStream.tee() to fork the model response — one branch streams tokens to the user instantly while the other persists the conversation and auto-extracts context records in parallel, so memory saving never blocks the reply.",
      "Designed a Founder Memory system that captures decisions, pivots, and milestones from user actions and injects the 10 most relevant records into every AI system prompt — replacing generic responses with context-specific recommendations.",
      "Shipped Stripe subscription billing across 4 tiers with HMAC-verified webhooks and server-side feature gating; backend on InsForge (YC P26, Postgres BaaS) with row-level security and an isolated admin service client for privileged routes.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "OpenRouter/GPT-4o", "Stripe", "InsForge/Postgres"],
    liveUrl: "https://founderos.app",
    githubUrl: "https://github.com/codewithsupra/founder-os",
    year: 2024,
    category: "AI Engineering",
    mainImage: "/preview_dashboard.jpg",
    images: ["/preview_intro.jpg", "/preview_dashboard.jpg", "/preview_ai_chat.jpg", "/preview_features.jpg", "/preview_growth.jpg", "/preview_kpis.jpg", "/preview_weekly.jpg", "/preview_competitors.jpg"],
    video: "/FounderOS_pitch.mp4",
  },
  {
    slug: "anchor",
    title: "Anchor",
    tagline: "Offline-First Notes with Conflict-Free Sync",
    description:
      "A local-first collaborative notes app that persists every keystroke as a CRDT operation before any network call, enabling full offline functionality and deterministic multi-device sync — the same technology used by Figma and Notion.",
    bullets: [
      "Persisted every keystroke to IndexedDB as a CRDT operation before any network call — making the app fully functional offline across tab closures, browser restarts, and dropped connections with zero data loss.",
      "Implemented conflict-free multi-device sync with Yjs: state-vector exchange on reconnect replays only missing operations and merges concurrent edits deterministically at the character level — no last-write-wins, no server arbitration.",
      "Chose one Y.Doc per note for constant-time app load regardless of corpus size; BroadcastChannel tab sync via y-webrtc (no signaling server); stateless y-websocket relay for cross-device sync with offline-queue replay on reconnect.",
    ],
    stack: ["Yjs (CRDTs)", "Tiptap/ProseMirror", "IndexedDB", "y-webrtc", "y-websocket", "Next.js", "TypeScript"],
    liveUrl: "https://anchor-notes.app",
    githubUrl: "https://github.com/codewithsupra/anchor.ai",
    year: 2024,
    category: "Local-First",
    mainImage: "/anchor_portfolio_1.png",
    images: ["/anchor_portfolio_1.png", "/anchor_portfolio_2.png", "/anchor_portfolio_3.png"],
    video: "/Anchor_pitch.mp4",
  },
  {
    slug: "aria",
    title: "Aria",
    tagline: "AI Website Accessibility Auditor",
    description:
      "An AI-powered accessibility auditor that combines deterministic axe-core rule-based analysis with Claude Vision's visual reasoning to surface issues automated scanners structurally cannot detect.",
    bullets: [
      "Combined axe-core (injected into the live DOM via headless Chromium) with Claude Vision analysing the rendered screenshot — surfacing issues automated scanners structurally cannot detect: weak visual hierarchy, cramped touch targets, text-over-image contrast failures, and misleading reading order.",
      "Tagged every finding by source — deterministic axe-core (certain) vs. AI-inferred (probable) — and weighted them separately in the severity score, so model output is never presented with the same authority as rule-based findings.",
      "Ran headless Chromium serverless via puppeteer-core + @sparticuz/chromium; constrained the Claude vision prompt to emit only visible issues as structured JSON with WCAG 2.2 criterion references, suppressing hallucinated findings.",
    ],
    stack: ["Claude Vision API", "axe-core", "Puppeteer", "Next.js", "TypeScript", "Neon/Postgres", "Drizzle"],
    liveUrl: "https://aria-audit.app",
    githubUrl: "https://github.com/codewithsupra/aria-acess.ai",
    year: 2024,
    category: "AI Engineering",
    mainImage: "/aria_portfolio_1.png",
    images: ["/aria_portfolio_1.png", "/aria_portfolio_2.png", "/aria_portfolio_3.png"],
    video: "/Aria_pitch.mp4",
  },
];

export const openSource: OpenSourceContrib[] = [
  {
    repo: "Tiptap",
    stars: "37k",
    prs: [
      {
        id: "PR #7976",
        url: "https://github.com/ueberdosis/tiptap/pull/7976",
        summary:
          "Fixed a logic inversion in character-count where autoTrim deleted from the document beginning instead of the end. Implemented findDocPositionAtChar() to walk the ProseMirror node tree and locate the exact character-limit boundary; added a full regression test suite.",
      },
      {
        id: "PR #7977",
        url: "https://github.com/ueberdosis/tiptap/pull/7977",
        summary:
          "Fixed a ProseMirror console error in the Link extension by coercing undefined HTMLAttributes to null via ?? null on class, target, and rel in addAttributes().",
      },
    ],
  },
  {
    repo: "Infisical",
    stars: "27k",
    prs: [
      {
        id: "PR #7028",
        url: "https://github.com/Infisical/infisical/pull/7028",
        summary:
          "Fixed unreachable admin signup button on desktop caused by justify-center on a max-h-screen + overflow-y-auto flex container clipping content above the scroll origin. Replaced with my-auto on the inner wrapper.",
      },
    ],
  },
];

export const skills = {
  Languages: ["TypeScript", "JavaScript (ES6+)", "SQL", "HTML5", "CSS3"],
  Frontend: ["React", "Next.js", "Tiptap/ProseMirror", "Redux", "Zustand", "Tailwind CSS", "Shadcn UI", "Zod"],
  "Local-First & Real-Time": ["Yjs (CRDTs)", "IndexedDB", "Dexie", "BroadcastChannel", "y-webrtc", "y-websocket", "WebSockets"],
  Backend: ["Node.js", "Express", "REST APIs", "gRPC", "Drizzle ORM", "ReadableStream"],
  "AI Engineering": ["Claude Vision API", "OpenAI SDK / OpenRouter", "Gemini API", "Structured JSON generation", "Context & memory injection"],
  "Cloud & Infra": ["AWS (SAA-C03)", "Vercel", "Railway", "Puppeteer (serverless)", "PostgreSQL (Neon)", "InsForge (YC P26)", "Stripe"],
  Testing: ["Jest", "React Testing Library", "TDD"],
};
