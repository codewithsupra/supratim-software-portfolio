"use client";

import { useRef, useState } from "react";
import type { Vector3 } from "three";
import { hexToVec3, type NebulaUniforms } from "@/components/nebula-uniforms";

/**
 * Dev-only tuning panel for the hero shader. Writes straight into the
 * shared uniforms object — the canvas never re-renders, the GPU just sees
 * the new values on the next frame. Never rendered in production.
 */

const SECTIONS = [
  {
    title: "Field",
    sliders: [
      { key: "uDrift", label: "Drift", min: 0, max: 0.25, step: 0.001, dp: 3 },
      { key: "uSpeed", label: "Speed", min: 0, max: 0.15, step: 0.001, dp: 3 },
      { key: "uScale", label: "Scale", min: 0.4, max: 6, step: 0.01, dp: 2 },
      { key: "uTurbulence", label: "Turbulence", min: 0, max: 5, step: 0.01, dp: 2 },
      { key: "uGrain", label: "Grain", min: 0, max: 0.15, step: 0.001, dp: 3 },
    ],
  },
  {
    title: "Pointer",
    sliders: [
      { key: "uParallax", label: "Parallax", min: 0, max: 0.5, step: 0.005, dp: 3 },
      { key: "uDamping", label: "Settle", min: 0.5, max: 8, step: 0.1, dp: 1 },
    ],
  },
  {
    title: "Light",
    sliders: [
      { key: "uGlow", label: "Glow", min: 0, max: 2.5, step: 0.01, dp: 2 },
      { key: "uEdge", label: "Cyan edge", min: 0, max: 0.5, step: 0.005, dp: 3 },
      { key: "uStars", label: "Stars", min: 0, max: 2, step: 0.01, dp: 2 },
    ],
  },
  {
    title: "Scroll",
    sliders: [
      { key: "uScrollIntensity", label: "Intensity", min: 0, max: 2, step: 0.01, dp: 2 },
      { key: "uScrubLag", label: "Scrub lag", min: 0, max: 3, step: 0.05, dp: 2 },
      { key: "uTravel", label: "Travel", min: 0, max: 6, step: 0.05, dp: 2 },
      { key: "uDepth", label: "Depth", min: 0, max: 1.5, step: 0.01, dp: 2 },
      { key: "uGlowSettle", label: "Glow settle", min: 0, max: 1, step: 0.01, dp: 2 },
    ],
  },
  {
    title: "Ground",
    sliders: [
      { key: "uGroundFade", label: "Fade", min: 0, max: 1, step: 0.01, dp: 2 },
      { key: "uGroundScale", label: "Scale", min: 0.3, max: 1, step: 0.01, dp: 2 },
      { key: "uGroundSpeed", label: "Speed", min: 0, max: 1, step: 0.01, dp: 2 },
    ],
  },
  {
    title: "Wordmark",
    sliders: [
      { key: "uMarkDrift", label: "Drift", min: 0, max: 8, step: 0.1, dp: 1 },
      { key: "uMarkLean", label: "Lean", min: 0, max: 20, step: 0.5, dp: 1 },
    ],
  },
] as const;

type Slider = (typeof SECTIONS)[number]["sliders"][number];
const SLIDERS = SECTIONS.flatMap((s): readonly Slider[] => s.sliders);

const COLORS = [
  { key: "uBg", label: "Void" },
  { key: "uIndigo", label: "Indigo" },
  { key: "uViolet", label: "Violet" },
  { key: "uMagenta", label: "Magenta" },
  { key: "uCyan", label: "Cyan" },
] as const;

type SliderKey = Slider["key"];
type ColorKey = (typeof COLORS)[number]["key"];

function vec3ToHex(v: Vector3): string {
  const c = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${c(v.x)}${c(v.y)}${c(v.z)}`;
}

function snapshot(uniforms: NebulaUniforms) {
  return {
    sliders: Object.fromEntries(
      SLIDERS.map((s) => [s.key, uniforms[s.key].value]),
    ) as Record<SliderKey, number>,
    colors: Object.fromEntries(
      COLORS.map((c) => [c.key, vec3ToHex(uniforms[c.key].value)]),
    ) as Record<ColorKey, string>,
  };
}

export function ShaderDevPanel({ uniforms }: { uniforms: NebulaUniforms }) {
  const [defaults] = useState(() => snapshot(uniforms));
  const [values, setValues] = useState(defaults);
  const [open, setOpen] = useState(false);
  // Per-group disclosure, keyed by section title (plus "Palette").
  // Absent keys are falsy, so every group starts collapsed.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) =>
    setOpenGroups((g) => ({ ...g, [title]: !g[title] }));

  // Handlers write through a ref — uniforms are three.js state, not React
  // state, and the frozen-props rule only exempts refs.
  const uniformsRef = useRef(uniforms);

  const setSlider = (key: SliderKey, v: number) => {
    uniformsRef.current[key].value = v;
    setValues((s) => ({ ...s, sliders: { ...s.sliders, [key]: v } }));
  };

  const setColor = (key: ColorKey, hex: string) => {
    uniformsRef.current[key].value.copy(hexToVec3(hex));
    setValues((s) => ({ ...s, colors: { ...s.colors, [key]: hex } }));
  };

  const reset = () => {
    const u = uniformsRef.current;
    for (const s of SLIDERS) u[s.key].value = defaults.sliders[s.key];
    for (const c of COLORS)
      u[c.key].value.copy(hexToVec3(defaults.colors[c.key]));
    setValues(defaults);
  };

  const groupButton = (title: string) => (
    <button
      type="button"
      onClick={() => toggleGroup(title)}
      aria-expanded={!!openGroups[title]}
      className="mono-label flex w-full items-center justify-between py-3 text-muted"
    >
      {title}
      <span aria-hidden="true">{openGroups[title] ? "−" : "+"}</span>
    </button>
  );

  return (
    <aside className="fixed right-5 bottom-5 z-50 w-64 rounded-card border border-fg/10 bg-surface/90 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mono-label flex w-full items-center justify-between px-4 py-3 text-muted"
      >
        Shader controls
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="border-t border-fg/10 px-4 pb-4">
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-fg/10">
              {groupButton(section.title)}
              {openGroups[section.title] && (
                <div className="space-y-3 pb-4">
                  {section.sliders.map((s) => (
                    <label key={s.key} className="block">
                      <span className="mono-label flex items-baseline justify-between text-muted">
                        {s.label}
                        <span className="text-fg/60">
                          {values.sliders[s.key].toFixed(s.dp)}
                        </span>
                      </span>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={values.sliders[s.key]}
                        onChange={(e) => setSlider(s.key, e.target.valueAsNumber)}
                        className="accent-accent mt-1.5 w-full"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-b border-fg/10">
            {groupButton("Palette")}
            {openGroups["Palette"] && (
              <div className="grid grid-cols-5 gap-2 pb-4">
                {COLORS.map((c) => (
                  <input
                    key={c.key}
                    type="color"
                    value={values.colors[c.key]}
                    onChange={(e) => setColor(c.key, e.target.value)}
                    title={c.label}
                    aria-label={`${c.label} colour`}
                    className="h-8 w-full cursor-pointer rounded-[6px] border border-fg/10 bg-transparent p-0.5"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={reset}
            className="mono-label mt-4 w-full rounded-[6px] border border-fg/10 py-2 text-muted hover:border-accent hover:text-accent"
          >
            Reset
          </button>
        </div>
      )}
    </aside>
  );
}
