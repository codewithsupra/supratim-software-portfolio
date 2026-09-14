"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { hero } from "@/lib/content";
import { useNebulaUniforms } from "@/components/nebula-uniforms";

gsap.registerPlugin(useGSAP, SplitText);

/**
 * Hero intro reveal — the headline arrives a line at a time from behind a
 * mask, then the eyebrow and subhead follow a beat behind on a separate
 * one-shot timeline (see the comment at the fromTo). SplitText is
 * restricted to this headline (MOTION_BRIEF: none on body copy). autoSplit
 * waits for the display font and re-splits on resize, so the lines are
 * never measured against fallback metrics; the line timeline is killed
 * and rebuilt by SplitText on each re-split.
 *
 * Wordmark treatments: the two lines drift in opposite directions as the
 * pin scrubs, and the whole mark leans toward the cursor. Both read the
 * already-eased uScroll and uPointer values from the shared uniforms every
 * tick, so the type moves with exactly the same lag as the field. The
 * drift targets the SplitText masks, not the lines — the lines animate
 * vertically inside the overflow-clipped masks during the reveal, and
 * drifting them horizontally would clip against their own mask edges.
 */
export function HeroIntro() {
  const root = useRef<HTMLDivElement>(null);
  const uniforms = useNebulaUniforms();
  // Refilled on every re-split, so the ticker never drives stale nodes.
  const driftSetters = useRef<((value: number) => void)[]>([]);
  const introDone = useRef(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Everything below is skipped under reduced motion — the markup
      // already reads finished (visible copy, unsplit headline), so
      // there is nothing to un-hide and nothing to drive.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The eyebrow and subhead reveal on their own one-shot timeline,
        // deliberately OUTSIDE the SplitText lifecycle: autoSplit kills and
        // replays the timeline returned from onSplit on every re-split
        // (font load, any width change), which could catch these mid-fade —
        // or re-hide them long after the intro — depending on timing.
        // Standalone, no re-split can ever touch them.
        gsap.fromTo(
          "[data-hero-follow]",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.6,
          },
        );

        SplitText.create("#hero-heading", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            driftSetters.current = self.masks.map(
              (m) => gsap.quickSetter(m, "xPercent") as (value: number) => void,
            );
            // Re-splits (resize) after the reveal has finished get fresh,
            // already-visible line nodes — nothing to replay.
            if (introDone.current) return;
            return gsap
              .timeline({
                onComplete: () => {
                  introDone.current = true;
                },
              })
              .from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                stagger: 0.15,
                ease: "power3.out",
              });
          },
        });

        const heading = root.current?.querySelector("h1");
        if (!uniforms || !heading) return;
        const u = uniforms;
        const leanX = gsap.quickSetter(heading, "x", "px") as (
          v: number,
        ) => void;
        const leanY = gsap.quickSetter(heading, "y", "px") as (
          v: number,
        ) => void;

        const tick = () => {
          const drift = u.uScroll.value * u.uMarkDrift.value;
          const [top, bottom] = driftSetters.current;
          if (top && bottom) {
            top(-drift);
            bottom(drift);
          }
          // uPointer is the field's eased pointer; its y is up-positive
          // (GL space), so the screen-space lean flips it.
          leanX(u.uPointer.value.x * u.uMarkLean.value);
          leanY(-u.uPointer.value.y * u.uMarkLean.value);
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root, dependencies: [uniforms] },
  );

  return (
    <div ref={root} className="my-auto">
      <p data-hero-follow className="mono-label text-muted">
        {hero.eyebrow}
      </p>
      <h1
        id="hero-heading"
        className="mt-10 font-display font-bold leading-[0.85] tracking-tight uppercase"
      >
        <span className="block text-[clamp(3.5rem,14vw,13rem)]">
          {hero.name.first}
        </span>
        <span className="text-outline block text-[clamp(3.5rem,14vw,13rem)]">
          {hero.name.second}
        </span>
      </h1>
      <p
        data-hero-follow
        className="mt-10 max-w-[34rem] text-lg leading-relaxed text-muted"
      >
        {hero.subhead}
      </p>
    </div>
  );
}
