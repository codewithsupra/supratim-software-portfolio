import { about } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { AboutStats } from "@/components/about-stats";
import { AboutCards } from "@/components/about-cards";
import { AboutTimeline } from "@/components/about-timeline";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="w-full py-24 sm:py-32"
    >
      {/* Heading and stats stay in normal flow — the timeline below pins
          on its own, full-bleed, so these scroll away above it. */}
      <div className="mx-auto w-full max-w-[68rem] px-6 sm:px-10">
        <div className="border-t border-muted/20 pt-10">
          <p className="mono-label text-muted">
            01<span aria-hidden="true"> / </span>
            {about.eyebrow}
          </p>
          <SectionHeading id="about-heading">{about.heading}</SectionHeading>
        </div>

        <AboutStats />
      </div>

      <AboutTimeline />

      <div className="mx-auto w-full max-w-[68rem] px-6 sm:px-10">
        <AboutCards>
          {/* The link's ::before stretches over the card, so the whole
              card is the click target and its hover drives the sweep. */}
          <aside
            aria-labelledby="course-heading"
            className="relative rounded-card border border-muted/20 bg-surface p-8 transition-[border-color,translate] duration-300 hover:border-accent/60 motion-safe:hover:-translate-y-1 sm:p-10"
          >
            <p className="mono-label text-muted">{about.latestCourse.label}</p>
            <h3
              id="course-heading"
              className="mt-4 font-display text-xl tracking-tight"
            >
              {about.latestCourse.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              {about.latestCourse.blurb}
            </p>
            <p className="mt-6">
              <a
                href={about.latestCourse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent before:absolute before:inset-0 before:content-['']"
              >
                <span className="link-sweep pb-1">
                  {about.latestCourse.linkLabel}
                </span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </p>
          </aside>

          <aside
            aria-labelledby="now-heading"
            className="relative rounded-card border border-muted/20 bg-surface p-8 transition-[border-color,translate] duration-300 hover:border-accent/60 motion-safe:hover:-translate-y-1 sm:p-10"
          >
            <p className="mono-label text-muted">{about.nowPanel.label}</p>
            <h3
              id="now-heading"
              className="mt-4 font-display text-xl tracking-tight"
            >
              {about.nowPanel.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              {about.nowPanel.blurb}
            </p>
            <p className="mt-6">
              <a
                href={about.nowPanel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent before:absolute before:inset-0 before:content-['']"
              >
                <span className="link-sweep pb-1">
                  {about.nowPanel.linkLabel}
                </span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </p>
          </aside>
        </AboutCards>
      </div>
    </section>
  );
}
