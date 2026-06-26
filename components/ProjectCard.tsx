import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/data";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800">
      {/* Main image */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={project.mainImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6">
          <h3 className="text-white font-black text-2xl text-center leading-tight">
            {project.title}
          </h3>
          <p className="text-zinc-300 text-sm text-center line-clamp-2">{project.tagline}</p>
          <Link
            href={`/projects/${project.slug}`}
            className="mt-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-base">{project.title}</h3>
          <p className="text-zinc-500 text-xs mt-0.5">{project.tagline}</p>
        </div>
        <span className="text-xs font-mono text-zinc-600">{project.year}</span>
      </div>
    </article>
  );
}
