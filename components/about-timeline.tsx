"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The five story beats on one horizontal track — the block pins and scroll
 * scrubs sideways through them, one beat per screen, a little under one
 * viewport of scroll per leg with a short scrub leg so the travel glides.
 * Index numbers over a hairline mark the travel; the number under the beat
 * on screen carries full foreground. The heading and stats live above this
 * component, outside the pin.
 *
 * The timeline only runs on desktop: viewport ≥ 64rem with a fine,
 * hover-capable pointer and motion allowed. Everywhere else — small
 * viewports, smartphones, prefers-reduced-motion — nothing pins and the
 * beats render as the original vertical list (the `beats-static` variant
 * in globals.css, which must stay the complement of MEDIA below).
 */

const MEDIA =
  "(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const LEGS = about.storyBeats.length - 1;
// Scroll distance per leg, as a fraction of the viewport height.
const LEG_HEIGHT = 0.85;

export function AboutTimeline() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA, () => {
        const numbers = gsap.utils.toArray<HTMLElement>(
          "[data-index]",
          rail.current,
        );
        const setActive = (active: number) => {
          numbers.forEach((el, i) => {
            el.style.color = i === active ? "var(--fg)" : "";
          });
        };
        setActive(0);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: pin.current,
              start: "top top",
              end: () =>
                `+=${Math.round(window.innerHeight * LEG_HEIGHT) * LEGS}`,
              pin: true,
              scrub: 0.75,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => setActive(Math.round(self.progress * LEGS)),
            },
          })
          .to(track.current, { xPercent: -100 * LEGS }, 0)
          .to(fill.current, { scaleX: 1 }, 0);
      });
    },
    { scope: pin },
  );

  return (
    <div className="mt-24">
      <div
        ref={pin}
        className="flex h-svh w-full flex-col justify-center overflow-hidden beats-static:block beats-static:h-auto beats-static:overflow-visible"
      >
        <ol
          ref={track}
          className="flex w-full beats-static:block beats-static:transform-none! beats-static:divide-y beats-static:divide-muted/20 beats-static:border-t beats-static:border-muted/20"
        >
          {about.storyBeats.map((beat) => (
            <li
              key={beat.index}
              className="w-full flex-none beats-static:py-10"
            >
              <div className="mx-auto grid w-full max-w-[68rem] gap-4 px-6 sm:grid-cols-[8rem_1fr] sm:gap-10 sm:px-10">
                <p className="font-display text-2xl tracking-tight text-muted">
                  {beat.index}
                </p>
                <div className="max-w-[42rem]">
                  <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                    {beat.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted">
                    {beat.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div
          ref={rail}
          aria-hidden="true"
          className="mx-auto mt-20 w-full max-w-[68rem] px-6 sm:px-10 beats-static:hidden"
        >
          <div className="flex justify-between">
            {about.storyBeats.map((beat) => (
              <span
                key={beat.index}
                data-index
                className="mono-label text-muted transition-colors duration-300"
              >
                {beat.index}
              </span>
            ))}
          </div>
          <div className="relative mt-4 h-px w-full bg-muted/20">
            <div
              ref={fill}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-fg/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
