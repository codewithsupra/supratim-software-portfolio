import Image from "next/image";
import { skills, openSource } from "@/lib/data";
import { InView } from "@/components/core/in-view";

export default function About() {
  const skillEntries = Object.entries(skills);

  return (
    <section
      id="about"
      className="bg-[#0d0d0d] py-24 md:py-32 px-6 md:px-12 lg:px-24"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-violet-400 text-sm font-mono tracking-[0.25em] uppercase mb-4">
          About
        </p>

        <h2
          id="about-heading"
          className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-white mb-16"
        >
          Building at the
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            frontier.
          </span>
        </h2>

        <InView
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewOptions={{ once: true, margin: "0px 0px -80px 0px" }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-zinc-300 text-xl leading-relaxed">
            The rarest thing in engineering isn&apos;t brilliance — it&apos;s someone who can
            take a half-formed idea from whiteboard to production without losing momentum or
            quality. I&apos;ve shipped real-time collaborative editors, AI-powered pipelines,
            and accessibility tooling — independently, on time, in public. If you want someone
            who thinks in systems, writes code that lasts, and doesn&apos;t need hand-holding to
            deliver, that&apos;s the work I do.
          </p>
        </InView>

        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16 mb-20 items-start">
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-x-6 top-0 h-24 rounded-full bg-violet-500/15 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.5rem] bg-zinc-950">
                <Image
                  src="/about-headshot.jpg"
                  alt="Professional headshot of Supratim Sarkar"
                  width={896}
                  height={1152}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="order-1 lg:order-2 space-y-5">
            <p className="text-zinc-300 text-lg leading-relaxed">
              I&apos;m a software engineer with an M.Sc. in Software Engineering from{" "}
              <span className="text-white font-semibold">VU Amsterdam & University of Amsterdam</span>{" "}
              (Joint Degree) and an{" "}
              <span className="text-white font-semibold">AWS Solutions Architect – Associate</span>{" "}
              certification.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              I interned at{" "}
              <span className="text-white font-semibold">Mendix (Siemens)</span>, shipping
              production React/TypeScript to thousands of enterprise developers globally. Since then
              I&apos;ve independently designed, built, and deployed three live full-stack products
              covering local-first architecture, streaming AI infrastructure, and AI-powered
              accessibility auditing.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              I&apos;m an open-source contributor to{" "}
              <span className="text-white font-semibold">Tiptap (37k ★)</span> and{" "}
              <span className="text-white font-semibold">Infisical (27k ★)</span>, fixing bugs at
              the ProseMirror internals level.
            </p>

            {/* Highlights */}
            <ul className="mt-6 space-y-3" aria-label="Key highlights">
              {[
                "Local-first systems with Yjs CRDTs & IndexedDB",
                "Streaming AI pipelines using ReadableStream",
                "Serverless Chromium + Claude Vision for AI auditing",
                "Stripe billing with HMAC-verified webhooks",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-400 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Open-source */}
        <div className="mb-20">
          <h3 className="text-white font-bold text-xl mb-6">Open-Source Contributions</h3>
          <div className="space-y-5">
            {openSource.map((contrib) => (
              <div
                key={contrib.repo}
                className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold text-lg">{contrib.repo}</span>
                  <span className="text-zinc-500 text-sm font-mono">★ {contrib.stars}</span>
                </div>
                <ul className="space-y-3">
                  {contrib.prs.map((pr) => (
                    <li key={pr.id} className="text-sm">
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 font-mono font-semibold transition-colors"
                      >
                        {pr.id}
                      </a>
                      <span className="text-zinc-500 ml-2">—</span>
                      <span className="text-zinc-400 ml-2 leading-relaxed">{pr.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        <div>
          <h3 className="text-white font-bold text-xl mb-8">Technical Skills</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillEntries.map(([category, items]) => (
              <div
                key={category}
                className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900/30 hover:border-zinc-700 transition-colors"
              >
                <p className="text-violet-400 text-xs font-mono tracking-widest uppercase mb-3">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-zinc-300 text-xs bg-zinc-800 px-2.5 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
