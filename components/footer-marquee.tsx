"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillsBand } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Skills band marquee (MOTION_BRIEF: Footer) — a slow, seamless loop that
 * scroll velocity nudges faster, settling back once the page stops. The
 * track holds two identical halves and loops at -50%, so each half must
 * tile exactly: every item carries its own leading separator and each half
 * ends on the same trailing gap. Under prefers-reduced-motion (and before
 * JS runs) the motion-safe classes fall away, leaving the band as the
 * static wrapped list, with the duplicate half hidden.
 */

const LOOP_SECONDS = 45;
const SETTLE_SECONDS = 1.4;
const maxNudge = gsap.utils.clamp(1, 3.5);

function SkillsRow({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-label={hidden ? undefined : "Skills"}
      aria-hidden={hidden || undefined}
      className={`${
        hidden ? "hidden motion-safe:flex" : "flex"
      } w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 motion-reduce:px-6 sm:motion-reduce:px-10 motion-safe:w-max motion-safe:flex-nowrap motion-safe:pr-8`}
    >
      {skillsBand.map((skill) => (
        <li
          key={skill}
          className="flex items-center gap-8 font-display text-2xl tracking-tight text-muted/70 sm:text-4xl"
        >
          <span aria-hidden="true" className="text-xl text-magenta/70">
            ✦
          </span>
          {skill}
        </li>
      ))}
    </ul>
  );
}

export function FooterMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current?.querySelector("[data-track]") ?? null;
        if (!track) return;

        const loop = gsap.to(track, {
          xPercent: -50,
          duration: LOOP_SECONDS,
          ease: "none",
          repeat: -1,
        });

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate(self) {
            const nudge = maxNudge(1 + Math.abs(self.getVelocity()) / 1500);
            loop.timeScale(Math.max(loop.timeScale(), nudge));
            gsap.to(loop, {
              timeScale: 1,
              duration: SETTLE_SECONDS,
              ease: "power2.out",
              overwrite: true,
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="w-full overflow-hidden border-b border-muted/20 pb-12"
    >
      <div data-track className="flex motion-safe:w-max">
        <SkillsRow />
        <SkillsRow hidden />
      </div>
    </div>
  );
}
