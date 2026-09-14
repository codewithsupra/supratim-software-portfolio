import { hero } from "@/lib/content";
import { HeroIntro } from "@/components/hero-intro";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh w-full flex-col"
    >
      <div className="mx-auto flex w-full max-w-[68rem] flex-1 flex-col px-6 pt-16 sm:px-10">
        <HeroIntro />

        {/* Vertical, centered, with a segment looping down the track —
            points the visitor into the scroll. Still under reduced motion. */}
        <div
          aria-hidden="true"
          className="mx-auto flex flex-col items-center gap-3 pb-8"
        >
          <span className="mono-label text-muted">{hero.scrollHint}</span>
          <span className="relative h-12 w-px overflow-hidden bg-muted/25">
            <span className="absolute left-0 top-0 h-4 w-px bg-fg/70 motion-safe:animate-scroll-hint" />
          </span>
        </div>
      </div>
    </section>
  );
}
