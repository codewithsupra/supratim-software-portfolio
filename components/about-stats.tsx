"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The three stats count up once, on first sight (MOTION_BRIEF: About).
 * The markup carries the finished values, so SSR, no-JS and reduced
 * motion all read the real numbers. With motion allowed the row is
 * hidden and zeroed before first paint, then on first sight each stat
 * fades in a beat behind the last while its number counts up.
 */

// Split "100+" into the part that counts and the suffix that doesn't.
const parse = (value: string) => {
  const match = value.match(/^(\d+)(.*)$/);
  return { target: Number(match?.[1] ?? 0), suffix: match?.[2] ?? "" };
};

export function AboutStats() {
  const root = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const blocks = gsap.utils.toArray<HTMLElement>(
          "[data-stat]",
          root.current,
        );
        const numbers = gsap.utils.toArray<HTMLElement>(
          "[data-count]",
          root.current,
        );
        // Hidden and zeroed before first paint, so the finished values
        // are never seen ahead of the count.
        gsap.set(blocks, { autoAlpha: 0, y: 16 });
        numbers.forEach((el) => {
          el.textContent = "0";
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            once: true,
          },
        });
        tl.to(blocks, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        });
        numbers.forEach((el, i) => {
          const counter = { value: 0 };
          tl.to(
            counter,
            {
              value: Number(el.dataset.count),
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(counter.value));
              },
            },
            // Each count sets off as its stat arrives.
            0.15 + i * 0.12,
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <dl
      ref={root}
      className="mt-20 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-muted/20"
    >
      {about.stats.map((stat, i) => {
        const { target, suffix } = parse(stat.value);
        return (
          <div
            key={stat.label}
            data-stat
            className={i > 0 ? "sm:pl-10" : undefined}
          >
            <dd className="font-display text-6xl tracking-tight sm:text-7xl">
              <span data-count={target}>{target}</span>
              {suffix}
            </dd>
            <dt className="mono-label mt-3 text-muted">{stat.label}</dt>
          </div>
        );
      })}
    </dl>
  );
}
