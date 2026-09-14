"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderDevPanel } from "@/components/shader-dev-panel";
import {
  useNebulaUniforms,
  type NebulaUniforms,
} from "@/components/nebula-uniforms";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Full-page nebula shader — a fixed layer behind everything: slow drift of
 * indigo, violet and magenta clouds over the near-black void, cyan catching
 * the cloud edges, faint stars behind, a soft glow at the centre. The field
 * drifts toward the (eased) pointer, and the hero pins for 1.5 viewport
 * heights while scroll scrubs uScroll 0→1: the field travels vertically and
 * deepens, the palette evolves, and the central glow settles back.
 *
 * Ground (MOTION_BRIEF Look): after passing the hero the field recedes —
 * uGround scrubs 0→1 as About rises through the viewport, dimming the
 * field toward the void, slowing its clock, growing its features and
 * releasing the pointer parallax, until it reads as texture rather than
 * motion behind the rest of the page.
 *
 * The uniforms object comes from NebulaProvider (see nebula-uniforms.tsx);
 * every tunable value is a uniform so the dev-only panel can adjust them
 * live. The material holds the uniforms object by reference, so mutating
 * a `.value` anywhere reaches the GPU on the next frame.
 *
 * Under prefers-reduced-motion the canvas renders one frame on demand and
 * stops — the receded ground state held still: no clock, no pointer, no
 * scrub, and the hero never pins.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// False during SSR; tracks the media query live on the client, so a toggle
// switches the canvas between the frame loops without a reload.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

const vertexShader = /* glsl */ `
  // Fullscreen quad — bypass the camera entirely.
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uParallax;
  uniform float uScroll;
  uniform float uTravel;
  uniform float uDepth;
  uniform float uGlowSettle;
  uniform float uSpeed;
  uniform float uDrift;
  uniform float uScale;
  uniform float uTurbulence;
  uniform float uGlow;
  uniform float uEdge;
  uniform float uStars;
  uniform float uGrain;
  uniform float uGround;
  uniform float uGroundScale;
  uniform float uGroundFade;
  uniform vec3 uBg;
  uniform vec3 uIndigo;
  uniform vec3 uViolet;
  uniform vec3 uMagenta;
  uniform vec3 uCyan;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = rot * p * 2.03;
      amp *= 0.5;
    }
    return v;
  }

  // hash() breaks down at the large coordinates stars feed it — fp32 fract
  // quantizes and the points snap into rows. This one stays stable there.
  float starHash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float stars(vec2 frag, float t) {
    // Sparse scatter of single-pixel points, drifting very slowly.
    vec2 p = frag / 2.5 + vec2(t * 1.5, t * 0.6);
    vec2 cell = floor(p);
    float rnd = starHash(cell);
    float star = step(0.99775, rnd);
    // Jitter each point inside its cell, fading by distance so it stays small.
    vec2 offset = vec2(starHash(cell + 17.0), starHash(cell + 43.0));
    float d = length(fract(p) - offset);
    return star * smoothstep(0.5, 0.0, d) * (0.3 + 0.7 * starHash(cell + 7.31));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

    // Stars keep the slow master clock; clouds run on their own, faster one.
    float t = uTime * uSpeed;
    float tc = uTime * uDrift;

    // The whole field drifts toward the (already eased) pointer. The ground
    // releases the parallax and grows the features — larger, stiller.
    vec2 sp = (p - uPointer * uParallax * (1.0 - 0.7 * uGround)) * uScale
      * mix(1.0, uGroundScale, uGround);

    // Scrubbing the pinned hero descends through the field — a receding
    // zoom plus vertical travel, so scroll reads as motion through space.
    float s = uScroll;
    sp *= 1.0 + s * 0.4 * uDepth;
    sp.y -= s * uTravel;

    // Domain-warped fbm for the cloud field, warped twice for turbulence.
    vec2 q = vec2(
      fbm(sp * 1.3 + vec2(tc, -tc * 0.7)),
      fbm(sp * 1.3 + vec2(-tc * 0.4, tc * 0.6) + 3.7)
    );
    vec2 r = vec2(
      fbm(sp * 1.4 + uTurbulence * q + vec2(tc * 0.8, tc * 0.4) + 1.7),
      fbm(sp * 1.4 + uTurbulence * q + vec2(-tc * 0.5, tc * 0.9) + 8.3)
    );
    float f = fbm(sp * 1.5 + uTurbulence * r + vec2(tc * 0.5, -tc * 0.3));

    // The palette evolves with depth — highlights cool toward violet and
    // the mids sink toward indigo, so descent reads as colour, not just dark.
    vec3 mid = mix(uViolet, uIndigo, min(s * 0.35, 1.0));
    vec3 hi = mix(uMagenta, uViolet, min(s * 0.55, 1.0));

    vec3 col = uBg;
    col = mix(col, uIndigo, smoothstep(0.25, 0.9, f) * 0.9);
    col = mix(col, mid, smoothstep(0.5, 1.0, f) * 0.65);
    col = mix(col, hi, smoothstep(0.55, 1.05, f * q.y + 0.35 * q.x) * (0.45 - 0.1 * s));

    // Cyan catches the light where cloud density falls off.
    float edge = smoothstep(0.12, 0.0, abs(f - 0.58)) * smoothstep(0.3, 0.7, q.x);
    col += uCyan * edge * uEdge * max(1.0 - 0.5 * s, 0.0);

    // Soft glow at the centre, leaning a little further toward the pointer.
    // It settles back with scroll — tighter and dimmer, a light receding.
    vec2 gp = p - uPointer * uParallax * 1.6;
    float glow = exp(-dot(gp, gp) * (1.6 + 1.2 * s * uGlowSettle));
    col += (uViolet * 0.30 + uMagenta * 0.12) * glow * uGlow * max(1.0 - 0.75 * s * uGlowSettle, 0.0) * (1.0 - 0.85 * uGround);

    // Deepen: the whole cloud field settles toward the void as scroll ends.
    col = mix(col, uBg, min(s * uDepth * 0.3, 1.0));

    // Faint stars behind the clouds — dimmed where the field is dense.
    // They travel slower than the clouds, so the descent has parallax.
    col += vec3(0.9, 0.92, 1.0) * stars(gl_FragCoord.xy + vec2(0.0, -s * uResolution.y * 0.1), t) * uStars * (1.0 - smoothstep(0.45, 0.75, f));

    // Settle the corners back into the void.
    float vignette = smoothstep(1.9, 0.4, length(p * vec2(0.85, 1.0)));
    col = mix(uBg, col, vignette);

    // Ground: everything — clouds, edge light, stars — settles toward the
    // void together. The grain lands after, so texture is what remains.
    col = mix(col, uBg, uGround * uGroundFade);

    // Fine animated grain — breaks up banding in the flat void.
    float grain = hash(gl_FragCoord.xy + vec2(fract(uTime) * 61.7, fract(uTime * 0.731) * 47.3));
    col += (grain - 0.5) * uGrain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function NebulaPlane({
  uniforms,
  reduced,
}: {
  uniforms: NebulaUniforms;
  reduced: boolean;
}) {
  const gl = useThree((state) => state.gl);
  // Raw pointer target; uPointer eases toward it in useFrame.
  const pointerTarget = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (reduced) return;
    const onPointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      pointerTarget.current.set(
        THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(-(((e.clientY - rect.top) / rect.height) * 2 - 1), -1, 1),
      );
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl, reduced]);

  // Built imperatively so the material keeps this exact uniforms object —
  // the dev panel mutates the same entries.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
      }),
    [uniforms],
  );

  useEffect(() => () => material.dispose(), [material]);

  // Per-frame writes go through the mesh ref — uniforms are three.js state,
  // not React state, and the frozen-props rule only exempts refs.
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ size, viewport }, delta) => {
    const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;
    const u = mat.uniforms as unknown as NebulaUniforms;
    u.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr,
    );
    // Reduced motion: frameloop is "demand", so this runs only on the
    // frames the canvas must draw anyway (mount, resize). Hold the field
    // at full ground — the receded texture — and advance nothing.
    if (reduced) {
      u.uGround.value = 1;
      u.uGroundTarget.value = 1;
      return;
    }
    // uGround trails its scrubbed target with the same lag as uScroll.
    u.uGround.value =
      u.uScrubLag.value > 0.001
        ? THREE.MathUtils.lerp(
            u.uGround.value,
            u.uGroundTarget.value,
            1 - Math.exp((-3 * delta) / u.uScrubLag.value),
          )
        : u.uGroundTarget.value;
    // The clock integrates a scaled delta instead of reading elapsed time,
    // so the ground can slow the field without a phase jump.
    u.uTime.value +=
      delta * THREE.MathUtils.lerp(1, u.uGroundSpeed.value, u.uGround.value);
    // Lag behind the cursor and settle — frame-rate independent damping.
    u.uPointer.value.lerp(
      pointerTarget.current,
      1 - Math.exp(-delta * u.uDamping.value),
    );
    // uScroll trails the pin's progress the same way — uScrubLag is roughly
    // the seconds it takes to catch up; intensity scales how far it's pushed.
    const scrollTarget = u.uScrollTarget.value * u.uScrollIntensity.value;
    u.uScroll.value =
      u.uScrubLag.value > 0.001
        ? THREE.MathUtils.lerp(
            u.uScroll.value,
            scrollTarget,
            1 - Math.exp((-3 * delta) / u.uScrubLag.value),
          )
        : scrollTarget;
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export function ShaderBackground() {
  const uniforms = useNebulaUniforms();
  const reduced = usePrefersReducedMotion();

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pin the hero section for 1.5 viewport heights and feed the pin's raw
  // progress to uScrollTarget — the shader does the travelling, the DOM
  // holds still. The scrub easing lives CPU-side in useFrame (uScrubLag),
  // so the dev panel can tune the lag live without rebuilding the trigger.
  // A second trigger scrubs uGroundTarget 0→1 as About rises through the
  // viewport, so the field recedes to texture once the hero is passed.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Resolved by hand: selector text inside this scoped context would be
        // looked up inside the canvas wrapper, where the sections don't live.
        const hero = document.getElementById("hero");
        const about = document.getElementById("about");
        if (!uniforms || !hero || !about) return;
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "+=150%",
          pin: true,
          // This pin waits for the uniforms, so it's created after triggers
          // further down the page — but its spacer moves their start
          // positions, so it must refresh before them.
          refreshPriority: 1,
          onUpdate: (self) => {
            uniforms.uScrollTarget.value = self.progress;
          },
        });
        ScrollTrigger.create({
          trigger: about,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            uniforms.uGroundTarget.value = self.progress;
          },
        });
        ScrollTrigger.refresh();
      });
    },
    { scope: wrapperRef, dependencies: [uniforms] },
  );

  if (!uniforms) return null;

  return (
    <>
      <div
        ref={wrapperRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: false }}
          frameloop={reduced ? "demand" : "always"}
        >
          <NebulaPlane uniforms={uniforms} reduced={reduced} />
        </Canvas>
      </div>
      {process.env.NODE_ENV !== "production" && (
        <ShaderDevPanel uniforms={uniforms} />
      )}
    </>
  );
}
