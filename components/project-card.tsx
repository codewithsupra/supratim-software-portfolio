"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, MotionConfig } from "motion/react";
import type { Project } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Hover (MOTION_BRIEF: Project grid): a small, calm lift on the card and
 * a slight zoom on the screenshot, via Motion variants. The zoom lives on
 * its own wrapper between [data-mask] (GSAP owns its clip-path) and
 * [data-image] (GSAP owns its scale), so the two libraries never write
 * to the same transform. Link hovers are CSS.
 */
const hoverTransition = { duration: 0.45, ease: "easeOut" as const };

const lift = {
  rest: { y: 0, transition: hoverTransition },
  hover: { y: -4, transition: hoverTransition },
};

const zoom = {
  rest: { scale: 1, transition: hoverTransition },
  hover: { scale: 1.03, transition: hoverTransition },
};

/**
 * Each card reveals as it enters (MOTION_BRIEF: Project grid) — the
 * screenshot unmasks upward while the image settles from a slight
 * overscale, then index, title and meta follow a beat behind. Cards
 * stagger into a wave naturally: each carries its own once-only trigger,
 * so scroll order is arrival order. The markup carries everything, so
 * SSR, no-JS and reduced motion all read the finished card.
 */

export function ProjectCard({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const mask = root.current?.querySelector("[data-mask]") ?? null;
        const image = root.current?.querySelector("[data-image]") ?? null;
        const meta = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          root.current,
        );

        // Hidden before first paint so the finished card is never seen
        // ahead of the reveal.
        gsap.set(mask, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(image, { scale: 1.06 });
        gsap.set(meta, { autoAlpha: 0, y: 24 });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 80%",
              once: true,
            },
          })
          .to(mask, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }, 0)
          .to(image, { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
          .to(meta, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.25);
      });
    },
    { scope: root },
  );

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        ref={root}
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={lift}
        className="group grid gap-8 py-14 lg:grid-cols-2 lg:gap-14"
      >
        <div>
          <div
            data-reveal
            className="flex items-baseline justify-between gap-4"
          >
            <p className="font-display text-5xl tracking-tight text-muted sm:text-6xl">
              {project.index}
            </p>
            <p className="mono-label text-muted">{project.tags.join(" · ")}</p>
          </div>
          <h3
            data-reveal
            className="mt-6 font-display text-3xl tracking-tight sm:text-4xl"
          >
            {project.title}
          </h3>
          <p
            data-reveal
            className="mt-4 max-w-[36rem] leading-relaxed text-muted"
          >
            {project.description}
          </p>
          <ul
            data-reveal
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted"
          >
            {project.tech.map((item, i) => (
              <li key={item} className="flex items-center gap-x-3">
                {i > 0 && <span aria-hidden="true">✦</span>}
                {item}
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-8 flex items-center gap-6 text-sm">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep pb-1 text-accent"
            >
              Visit
              <span className="sr-only">
                {" "}
                — {project.title} (opens in new tab)
              </span>
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep pb-1 text-accent"
            >
              GitHub
              <span className="sr-only">
                {" "}
                — {project.title} (opens in new tab)
              </span>
            </a>
          </p>
        </div>

        <div
          data-mask
          className="self-center overflow-hidden rounded-card border border-muted/20"
        >
          <motion.div variants={zoom}>
            <Image
              data-image
              src={project.screenshot}
              alt={project.alt}
              width={1920}
              height={1020}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </motion.div>
        </div>
      </motion.article>
    </MotionConfig>
  );
}
