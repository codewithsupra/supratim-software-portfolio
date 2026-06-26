import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Supratim Sarkar`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Supratim Sarkar`,
      description: project.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Supratim Sarkar`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const prev = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const next = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    url: project.liveUrl,
    codeRepository: project.githubUrl,
    author: { "@type": "Person", name: "Supratim Sarkar" },
    programmingLanguage: project.stack,
    dateCreated: `${project.year}-01-01`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-24 px-6 md:px-12 lg:px-24" id="main-content">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors mb-12 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 rounded"
          aria-label="Back to projects"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to projects
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full border bg-violet-500/10 text-violet-400 border-violet-500/20">
              {project.category}
            </span>
            <span className="text-zinc-600 text-sm font-mono">{project.year}</span>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.9] tracking-tight text-white mb-4">
            {project.title}
          </h1>
          <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mb-8">
            {project.tagline}
          </p>

          {/* CTA links */}
          <div className="flex flex-wrap gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 text-sm"
            >
              View Live
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 text-sm"
            >
              View Code
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </header>

        <hr className="border-zinc-800 mb-12" />

        {/* Video */}
        {project.video && (
          <section aria-labelledby="video-heading" className="mb-12">
            <h2 id="video-heading" className="text-white font-bold text-2xl mb-6">Demo Video</h2>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-video">
              <video
                src={project.video}
                controls
                className="w-full h-full object-cover"
                aria-label={`${project.title} demo video`}
              />
            </div>
          </section>
        )}

        {/* Images */}
        {project.images.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mb-12">
            <h2 id="gallery-heading" className="text-white font-bold text-2xl mb-6">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800">
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <hr className="border-zinc-800 mb-12" />

        {/* Overview */}
        <section aria-labelledby="overview-heading" className="mb-12">
          <h2 id="overview-heading" className="text-white font-bold text-2xl mb-6">Overview</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">{project.description}</p>
        </section>

        {/* Technical deep-dive */}
        <section aria-labelledby="details-heading" className="mb-12">
          <h2 id="details-heading" className="text-white font-bold text-2xl mb-6">Technical Details</h2>
          <ul className="space-y-6" role="list">
            {project.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="text-zinc-400 leading-relaxed">{bullet}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section aria-labelledby="stack-heading" className="mb-16">
          <h2 id="stack-heading" className="text-white font-bold text-2xl mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3" role="list" aria-label="Technologies used">
            {project.stack.map((tech) => (
              <span
                key={tech}
                role="listitem"
                className="text-zinc-300 text-sm bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Prev / Next navigation */}
        <nav
          className="border-t border-zinc-800 pt-10 grid sm:grid-cols-2 gap-4"
          aria-label="Project navigation"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 transition-all hover:bg-zinc-900/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest mb-2">← Previous</p>
              <p className="text-white font-bold group-hover:text-violet-300 transition-colors">{prev.title}</p>
              <p className="text-zinc-500 text-sm mt-1">{prev.tagline}</p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 transition-all hover:bg-zinc-900/50 text-right focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest mb-2">Next →</p>
              <p className="text-white font-bold group-hover:text-violet-300 transition-colors">{next.title}</p>
              <p className="text-zinc-500 text-sm mt-1">{next.tagline}</p>
            </Link>
          )}
        </nav>
      </div>
    </main>
    </>
  );
}
