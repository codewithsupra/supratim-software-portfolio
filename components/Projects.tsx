import { projects, projectsSection } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";

export function Projects() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="w-full py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[68rem] px-6 sm:px-10">
        <div className="border-t border-muted/20 pt-10">
          <p className="mono-label text-muted">
            02<span aria-hidden="true"> / </span>
            {projectsSection.eyebrow}
          </p>
          <SectionHeading id="work-heading">
            {projectsSection.heading}
          </SectionHeading>
        </div>

        <ul className="mt-20 divide-y divide-muted/20 border-t border-muted/20">
          {projects.map((project) => (
            <li key={project.index}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
