"use client";

import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="bg-[#0a0a0a] py-24 md:py-32"
      aria-labelledby="projects-heading"
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-violet-400 text-sm font-mono tracking-[0.25em] uppercase mb-4">
            Work
          </p>
          <h2
            id="projects-heading"
            className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-white"
          >
            Independent
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-400">
              Engineering
            </span>
          </h2>
          <p className="mt-4 text-zinc-500 text-sm max-w-md leading-relaxed">
            Three live, production full-stack products — architecture, infrastructure, and
            deployment — full ownership.
          </p>
        </div>

        {/* 3-column grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          role="list"
          aria-label="Projects list"
        >
          {projects.map((project) => (
            <div key={project.slug} role="listitem">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
