"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Reveal for the two course cards — each fades in and settles a beat
 * behind the last, once, on first sight. The cards themselves stay
 * server-rendered; this wrapper only owns the motion, and reduced
 * motion leaves them still.
 */
export function AboutCards({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current!.children, {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mt-24 grid gap-8 lg:grid-cols-2">
      {children}
    </div>
  );
}
