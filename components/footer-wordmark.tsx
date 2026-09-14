"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { footer } from "@/lib/content";

gsap.registerPlugin(useGSAP);

/**
 * The footer wordmark, set like the hero headline. Each letter bounces on
 * hover — pointerover delegation on the block, one letter per crossing,
 * ignored while that letter is already in flight. The visible letters are
 * decorative spans; screen readers get the plain wordmark, and the block
 * is unselectable so a sweep of the cursor doesn't leave it highlighted.
 *
 * The second word can't take the gradient on a wrapper: a transformed
 * descendant of a background-clip:text element never gets the wrapper's
 * background painted into its layer, so a bouncing letter turns invisible.
 * Instead every letter carries the gradient itself, background-sized to
 * the full word and offset to the letter's slot, so the ramp still reads
 * as one continuous sweep across the word.
 */

function Letters({ text, gradient }: { text: string; gradient?: boolean }) {
  return (
    <>
      {Array.from(text).map((letter, i) => (
        <span
          key={i}
          data-letter
          className={gradient ? "text-gradient inline-block" : "inline-block"}
        >
          {letter}
        </span>
      ))}
    </>
  );
}

export function FooterWordmark() {
  const root = useRef<HTMLParagraphElement>(null);

  // Slice the word's gradient across its letters; repainted whenever the
  // word's size changes (font load, viewport resize).
  useEffect(() => {
    const word = root.current?.querySelector<HTMLElement>(
      "[data-gradient-word]",
    );
    if (!word) return;
    const letters = Array.from(
      word.querySelectorAll<HTMLElement>("[data-letter]"),
    );
    const paint = () => {
      const box = word.getBoundingClientRect();
      for (const letter of letters) {
        letter.style.backgroundSize = `${box.width}px 100%`;
        letter.style.backgroundPosition = `${
          box.left - letter.getBoundingClientRect().left
        }px 0`;
      }
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(word);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const block = root.current;
        if (!block) return;
        const enter = (event: PointerEvent) => {
          const letter = (event.target as Element).closest?.("[data-letter]");
          if (!letter || gsap.isTweening(letter)) return;
          gsap
            .timeline()
            .to(letter, { yPercent: -18, duration: 0.18, ease: "power2.out" })
            .to(letter, { yPercent: 0, duration: 0.8, ease: "bounce.out" });
        };
        block.addEventListener("pointerover", enter);
        return () => block.removeEventListener("pointerover", enter);
      });
    },
    { scope: root },
  );

  return (
    <p
      ref={root}
      className="mt-4 font-display text-[clamp(2.5rem,9vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight select-none"
    >
      <span className="sr-only">
        {footer.wordmark.first} {footer.wordmark.second}
      </span>
      {/* Inline-block letters add soft-wrap points inside a word — the
          nowrap wrappers keep line breaks at the space only. */}
      <span aria-hidden="true">
        <span className="whitespace-nowrap">
          <Letters text={footer.wordmark.first} />
        </span>{" "}
        <span data-gradient-word className="whitespace-nowrap">
          <Letters text={footer.wordmark.second} gradient />
        </span>
      </span>
    </p>
  );
}
