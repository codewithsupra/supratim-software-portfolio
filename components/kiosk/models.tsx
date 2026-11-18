"use client";

/* eslint-disable react-hooks/immutability --
   three.js objects here are built once and then mutated on every animation frame inside
   useFrame. None of it is React state, so the compiler rules about render purity do not
   apply. */

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { about } from "@/lib/content";
import { Hotspot } from "./hotspot";
import { glowMap, mats } from "./materials";
import { k } from "./palette";
import { makeScreenMaterial } from "./screen-material";
import { drawnTexture, floorAlpha, font, MONO, neon } from "./textures";
import { COUNTER_TOP, MAILBOX, PLAQUE, RADIO, SIGNPOST, TV, TV_Z, tvs, type TvSlot, type V3 } from "./layout";
import { fx, useKiosk } from "./store";

type M = THREE.Material;

function Box({ s, p, r, m }: { s: V3; p: V3; r?: V3; m: M }) {
  return (
    <mesh position={p} rotation={r} material={m}>
      <boxGeometry args={s} />
    </mesh>
  );
}

function Cyl({ a, p, r, m, seg = 20 }: { a: [number, number, number]; p: V3; r?: V3; m: M; seg?: number }) {
  return (
    <mesh position={p} rotation={r} material={m}>
      <cylinderGeometry args={[a[0], a[1], a[2], seg]} />
    </mesh>
  );
}

/** Deterministic noise so the city and dust are the same on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------ floor */

export function Floor() {
  const { gl } = useThree();
  const reflector = useMemo(() => {
    const res = fx.coarse ? 512 : 1024;
    const r = new Reflector(new THREE.PlaneGeometry(60, 60), {
      textureWidth: res,
      textureHeight: res,
      color: new THREE.Color(k.reflect),
      clipBias: 0.003,
    });
    r.rotation.x = -Math.PI / 2;
    return r;
  }, []);
  const top = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: k.floor,
      transparent: true,
      alphaMap: floorAlpha(),
      roughness: 0.9,
      metalness: 0,
    });
  }, []);
  useEffect(
    () => () => {
      reflector.geometry.dispose();
      (reflector.material as M).dispose();
      reflector.getRenderTarget().dispose();
    },
    [reflector],
  );
  void gl;
  return (
    <>
      <primitive object={reflector} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.004} material={top}>
        <planeGeometry args={[60, 60]} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ kiosk shell */

export function Kiosk() {
  const m = mats();
  const sign = useMemo(
    () =>
      glowMap(
        drawnTexture(1400, 300, (ctx, w, h) => {
          neon(ctx, "SUPRATIM'S", w / 2, h * 0.38, font(600, 150), k.neonPink, 26);
          neon(ctx, "REPAIRS  ·  BUGS  ·  SYSTEMS  ·  AI", w / 2, h * 0.8, font(500, 54), k.neonViolet, 16);
        }),
        1.5,
      ),
    [],
  );
  const awning = useMemo(() => Array.from({ length: 13 }, (_, i) => i), []);

  return (
    <group>
      {/* platform */}
      <Box s={[3.5, 0.12, 2.35]} p={[0, 0.06, 0]} m={m.trim} />
      {/* back and left walls, right half wall */}
      <Box s={[3.3, 2.6, 0.1]} p={[0, 1.36, -1.0]} m={m.wall} />
      <Box s={[0.1, 2.6, 2.05]} p={[-1.62, 1.36, -0.02]} m={m.wallDark} />
      <Box s={[0.08, 1.0, 1.9]} p={[1.62, 0.62, -0.05]} m={m.wallDark} />
      {/* pillars */}
      <Box s={[0.1, 2.6, 0.1]} p={[-1.62, 1.36, 1.02]} m={m.trim} />
      <Box s={[0.1, 2.6, 0.1]} p={[1.62, 1.36, 1.02]} m={m.trim} />
      <Box s={[0.1, 2.6, 0.1]} p={[1.62, 1.36, -1.0]} m={m.trim} />
      {/* neon tubes up the front pillars and along the roof edge */}
      <Box s={[0.03, 2.4, 0.03]} p={[-1.56, 1.36, 1.085]} m={m.neonPink} />
      <Box s={[0.03, 2.4, 0.03]} p={[1.56, 1.36, 1.085]} m={m.neonPink} />
      <Box s={[3.95, 0.035, 0.035]} p={[0, 2.6, 1.36]} m={m.neonViolet} />
      {/* counter */}
      <Box s={[3.22, 0.98, 0.12]} p={[0, 0.6, 0.92]} m={m.counter} />
      <Box s={[3.34, 0.06, 0.58]} p={[0, COUNTER_TOP, 0.68]} m={m.wood} />
      <Box s={[3.2, 0.025, 0.025]} p={[0, COUNTER_TOP - 0.06, 0.985]} m={m.neonPink} />
      {[0.32, 0.55, 0.78].map((y) => (
        <Box key={y} s={[3.0, 0.03, 0.02]} p={[0, y, 0.985]} m={m.wallDark} />
      ))}
      {/* shelves the sets stand on */}
      <Box s={[3.1, 0.05, 0.62]} p={[0, 1.07, TV_Z]} m={m.wood} />
      <Box s={[3.1, 0.05, 0.62]} p={[0, 1.76, TV_Z]} m={m.wood} />
      {/* roof */}
      <Box s={[3.95, 0.12, 2.7]} p={[0, 2.7, 0.02]} r={[-0.05, 0, 0]} m={m.wallDark} />
      {/* awning */}
      {awning.map((i) => (
        <mesh key={i} position={[-1.8 + i * 0.3, 2.46, 1.42]} rotation={[0.5, 0, 0]} material={i % 2 ? m.awningB : m.awningA}>
          <boxGeometry args={[0.3, 0.02, 0.5]} />
        </mesh>
      ))}
      {/* sign */}
      <Box s={[0.06, 0.4, 0.06]} p={[-1.1, 2.9, 0.85]} m={m.metal} />
      <Box s={[0.06, 0.4, 0.06]} p={[1.1, 2.9, 0.85]} m={m.metal} />
      <Box s={[2.95, 0.66, 0.12]} p={[0, 3.2, 0.85]} m={m.wallDark} />
      <Box s={[3.0, 0.03, 0.14]} p={[0, 3.545, 0.85]} m={m.neonViolet} />
      <mesh position={[0, 3.2, 0.915]} material={sign}>
        <planeGeometry args={[2.8, 0.6]} />
      </mesh>
      {/* roof clutter: an AC unit and a water tank */}
      <Box s={[0.62, 0.36, 0.42]} p={[0.9, 2.95, -0.6]} m={m.metal} />
      <mesh position={[0.9, 2.95, -0.385]} material={m.black}>
        <circleGeometry args={[0.13, 24]} />
      </mesh>
      <Cyl a={[0.28, 0.28, 0.62]} p={[-0.95, 3.07, -0.55]} m={m.trim} />
    </group>
  );
}

/* ------------------------------------------------------------------ tv wall */

function terminalTexture(): THREE.CanvasTexture {
  return drawnTexture(640, 480, (ctx, w, h) => {
    ctx.fillStyle = "#03020a";
    ctx.fillRect(0, 0, w, h);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = `600 34px ${MONO}`;
    ctx.fillStyle = k.accent;
    ctx.fillText("termpilot", 40, 44);
    ctx.font = `400 24px ${MONO}`;
    const lines: [string, string][] = [
      ["mode", "Build · Plan"],
      ["tools", "read · glob · grep"],
      ["", "edit · bash"],
      ["models", "Claude · OpenAI · Gemini"],
    ];
    lines.forEach(([a, b], i) => {
      ctx.fillStyle = k.inkMuted;
      ctx.fillText(a, 40, 130 + i * 50);
      ctx.fillStyle = k.ink;
      ctx.fillText(b, 170, 130 + i * 50);
    });
    ctx.fillStyle = k.accent;
    ctx.fillText("›", 40, 360);
    ctx.fillRect(70, 362, 16, 28);
  });
}

function useScreenTexture(slot: TvSlot): { tex: THREE.Texture | null; fit: THREE.Vector2 } {
  const shot = slot.project.screenshot;
  // A project with no web page (Termpilot) gets a drawn terminal instead of a screenshot.
  const drawn = useMemo(() => (shot ? null : terminalTexture()), [shot]);
  const [loaded, setLoaded] = useState<THREE.Texture | null>(null);
  const fit = useMemo(() => new THREE.Vector2(1, 1), []);
  useEffect(() => () => drawn?.dispose(), [drawn]);
  useEffect(() => {
    if (!shot) return;
    let alive = true;
    let tex: THREE.Texture | null = null;
    new THREE.TextureLoader().load(shot, (t) => {
      if (!alive) return t.dispose();
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      const img = t.image as { width: number; height: number };
      const screenAspect = 0.6 / 0.46;
      const imgAspect = img.width / img.height;
      // Crop the sides of a wide screenshot rather than squashing it into the 4:3 tube.
      if (imgAspect > screenAspect) fit.set(screenAspect / imgAspect, 1);
      tex = t;
      setLoaded(t);
    });
    return () => {
      alive = false;
      tex?.dispose();
    };
  }, [shot, fit]);
  return { tex: drawn ?? loaded, fit };
}

function Tv({ slot }: { slot: TvSlot }) {
  const m = mats();
  const { tex, fit } = useScreenTexture(slot);
  const hovered = useKiosk((s) => s.hover === `tv-${slot.project.id}`);
  const screen = useMemo(() => {
    if (!tex) return null;
    const mat = makeScreenMaterial(tex, fit);
    mat.uniforms.uSeed!.value = slot.index * 1.37;
    return mat;
  }, [tex, fit, slot.index]);
  useEffect(() => () => screen?.dispose(), [screen]);
  const label = useMemo(
    () =>
      glowMap(
        drawnTexture(512, 64, (ctx, w, h) => {
          ctx.font = font(600, 38);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = k.ink;
          ctx.fillText(`${slot.project.index}  ${slot.project.title.toUpperCase()}`, w / 2, h / 2 + 2);
        }),
        0.8,
      ),
    [slot.project.index, slot.project.title],
  );

  useFrame((state, dt) => {
    if (!screen) return;
    screen.uniforms.uTime!.value = state.clock.elapsedTime;
    screen.uniforms.uPower!.value = fx.power;
    const h = screen.uniforms.uHover!;
    h.value += ((hovered ? 1 : 0) - h.value) * Math.min(1, dt * 8);
  });

  const housing = m.crt[slot.index % 3]!;
  const front = TV.d / 2;
  return (
    <Hotspot
      id={`tv-${slot.project.id}`}
      label={slot.project.title}
      station={`project:${slot.project.id}`}
      halo={{ size: [TV.w + 0.07, TV.h + 0.07, 0.03], pos: [slot.x, slot.y, TV_Z + front + 0.03] }}
    >
      <group position={[slot.x, slot.y, TV_Z]}>
        <mesh material={housing}>
          <boxGeometry args={[TV.w, TV.h, TV.d]} />
        </mesh>
        <mesh position={[0, 0, -TV.d * 0.55]} material={housing}>
          <boxGeometry args={[TV.w * 0.66, TV.h * 0.7, TV.d * 0.5]} />
        </mesh>
        <mesh position={[-0.07, 0, front + 0.004]} material={m.bezel}>
          <boxGeometry args={[0.66, 0.52, 0.012]} />
        </mesh>
        <mesh position={[-0.07, 0, front + 0.012]} material={screen ?? m.screenOff}>
          <planeGeometry args={[0.6, 0.46]} />
        </mesh>
        <Cyl a={[0.03, 0.03, 0.03]} p={[0.33, 0.12, front + 0.01]} r={[Math.PI / 2, 0, 0]} m={m.black} />
        <Cyl a={[0.025, 0.025, 0.03]} p={[0.33, -0.02, front + 0.01]} r={[Math.PI / 2, 0, 0]} m={m.black} />
        <Box s={[0.08, 0.012, 0.01]} p={[0.33, -0.16, front + 0.006]} m={m.bezel} />
        <mesh position={[0, -TV.h / 2 + 0.035, front + 0.014]} material={label}>
          <planeGeometry args={[0.56, 0.07]} />
        </mesh>
      </group>
    </Hotspot>
  );
}

export function TvWall() {
  return (
    <>
      {tvs.map((slot) => (
        <Tv key={slot.project.id} slot={slot} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ radio = about */

export function Radio() {
  const m = mats();
  const [x, y, z] = RADIO;
  return (
    <Hotspot id="radio" label="About me" station="about" halo={{ size: [0.66, 0.48, 0.34], pos: [x, y + 0.2, z] }}>
      <group position={[x, y + 0.16, z]}>
        <mesh material={m.radio}>
          <boxGeometry args={[0.56, 0.3, 0.22]} />
        </mesh>
        <mesh position={[-0.12, 0, 0.111]} material={m.bezel}>
          <circleGeometry args={[0.105, 32]} />
        </mesh>
        <mesh position={[-0.12, 0, 0.113]} material={m.metal}>
          <ringGeometry args={[0.098, 0.11, 32]} />
        </mesh>
        <mesh position={[0.15, 0.05, 0.112]} material={m.dial}>
          <planeGeometry args={[0.18, 0.07]} />
        </mesh>
        <Cyl a={[0.028, 0.028, 0.03]} p={[0.1, -0.08, 0.12]} r={[Math.PI / 2, 0, 0]} m={m.black} />
        <Cyl a={[0.028, 0.028, 0.03]} p={[0.2, -0.08, 0.12]} r={[Math.PI / 2, 0, 0]} m={m.black} />
        <Cyl a={[0.006, 0.006, 0.42]} p={[-0.2, 0.33, -0.04]} r={[0, 0, 0.35]} m={m.metal} />
        <mesh position={[-0.27, 0.53, -0.04]} material={m.tip}>
          <sphereGeometry args={[0.014, 12, 12]} />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[0, 0, 0]} material={m.metal}>
          <torusGeometry args={[0.12, 0.012, 8, 24, Math.PI]} />
        </mesh>
      </group>
    </Hotspot>
  );
}

/* ------------------------------------------------------------------ workbench clutter */

export function Bench() {
  const m = mats();
  const y = COUNTER_TOP + 0.03;
  return (
    <group>
      {/* circuit board with chips */}
      <Box s={[0.42, 0.012, 0.28]} p={[-0.25, y + 0.006, 0.66]} r={[0, 0.2, 0]} m={m.pcb} />
      <Box s={[0.08, 0.02, 0.06]} p={[-0.3, y + 0.02, 0.64]} r={[0, 0.2, 0]} m={m.chip} />
      <Box s={[0.05, 0.02, 0.05]} p={[-0.17, y + 0.02, 0.7]} r={[0, 0.2, 0]} m={m.chip} />
      {/* soldering iron on its stand */}
      <mesh position={[0.18, y + 0.05, 0.7]} rotation={[0, 0.4, 0]} material={m.metal}>
        <torusGeometry args={[0.04, 0.008, 8, 20]} />
      </mesh>
      <Cyl a={[0.012, 0.006, 0.3]} p={[0.18, y + 0.08, 0.62]} r={[1.25, 0, 0.4]} m={m.black} />
      {/* desk lamp */}
      <Cyl a={[0.07, 0.08, 0.025]} p={[0.55, y + 0.012, 0.58]} m={m.black} />
      <Cyl a={[0.008, 0.008, 0.34]} p={[0.57, y + 0.18, 0.56]} r={[0, 0, -0.25]} m={m.metal} />
      <mesh position={[0.62, y + 0.33, 0.62]} rotation={[0.6, 0, -0.5]} material={m.black}>
        <coneGeometry args={[0.07, 0.1, 20, 1, true]} />
      </mesh>
      <mesh position={[0.625, y + 0.3, 0.645]} material={m.bulb}>
        <sphereGeometry args={[0.025, 12, 12]} />
      </mesh>
      {/* toolbox */}
      <Box s={[0.46, 0.2, 0.24]} p={[1.0, y + 0.1, 0.66]} m={m.toolbox} />
      <Box s={[0.48, 0.03, 0.26]} p={[1.0, y + 0.215, 0.66]} m={m.toolbox} />
      <mesh position={[1.0, y + 0.27, 0.66]} material={m.metal}>
        <torusGeometry args={[0.07, 0.01, 8, 20, Math.PI]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ tiptap lightbox = open source */

export function Plaque() {
  const m = mats();
  const [x, y, z] = PLAQUE;
  const face = useMemo(
    () =>
      glowMap(
        drawnTexture(720, 440, (ctx, w, h) => {
          ctx.fillStyle = "rgba(13,10,24,0.92)";
          ctx.fillRect(0, 0, w, h);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `500 30px ${MONO}`;
          ctx.fillStyle = k.inkMuted;
          ctx.fillText("OPEN SOURCE", w / 2, 70);
          neon(ctx, "TIPTAP", w / 2, 175, font(700, 120), k.neonViolet, 7);
          ctx.font = font(600, 50);
          ctx.fillStyle = k.ink;
          ctx.fillText("2 PRs MERGED", w / 2, 300);
          ctx.font = `500 30px ${MONO}`;
          ctx.fillStyle = k.inkMuted;
          ctx.fillText(`${about.stats[2]?.value ?? ""} STARS`, w / 2, 375);
        }),
        0.95,
      ),
    [],
  );
  return (
    <Hotspot id="plaque" label="Open source: Tiptap" station="open-source" halo={{ size: [0.86, 0.6, 0.08], pos: [x, y, z + 0.02], rot: [0, -0.35, 0] }}>
      <group position={[x, y, z]} rotation={[0, -0.35, 0]}>
        <Box s={[0.36, 0.035, 0.035]} p={[-0.28, 0.35, -0.02]} m={m.metal} />
        <Cyl a={[0.005, 0.005, 0.1]} p={[-0.28, 0.3, -0.02]} m={m.metal} />
        <Cyl a={[0.005, 0.005, 0.1]} p={[0.28, 0.3, -0.02]} m={m.metal} />
        <Box s={[0.6, 0.035, 0.035]} p={[0.02, 0.35, -0.02]} m={m.metal} />
        <Box s={[0.8, 0.52, 0.06]} p={[0, 0, 0]} m={m.wallDark} />
        <mesh position={[0, 0, 0.032]} material={face}>
          <planeGeometry args={[0.76, 0.46]} />
        </mesh>
      </group>
    </Hotspot>
  );
}

/* ------------------------------------------------------------------ mailbox = contact */

export function Mailbox() {
  const m = mats();
  const [x, , z] = MAILBOX;
  const decal = useMemo(
    () =>
      glowMap(
        drawnTexture(512, 128, (ctx, w, h) => {
          ctx.font = font(600, 64);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = k.ink;
          ctx.fillText("CONTACT", w / 2, h / 2 + 4);
        }),
        1.1,
      ),
    [],
  );
  return (
    <Hotspot id="mailbox" label="Contact" station="contact" halo={{ size: [0.46, 0.5, 0.66], pos: [x, 1.17, z] }}>
      <pointLight color={k.bulbLight} intensity={2.2} distance={2.6} decay={2} position={[x + 0.35, 1.9, z + 0.6]} />
      <group position={[x, 0, z]} rotation={[0, -0.5, 0]}>
        <Box s={[0.08, 0.95, 0.08]} p={[0, 0.48, 0]} m={m.metal} />
        <Box s={[0.34, 0.24, 0.52]} p={[0, 1.07, 0]} m={m.mailbox} />
        <mesh position={[0, 1.19, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.mailbox}>
          <cylinderGeometry args={[0.17, 0.17, 0.52, 24, 1, false, -Math.PI / 2, Math.PI]} />
        </mesh>
        <mesh position={[0, 1.13, 0.262]} material={m.black}>
          <planeGeometry args={[0.3, 0.3]} />
        </mesh>
        <Box s={[0.02, 0.26, 0.02]} p={[0.18, 1.25, -0.12]} m={m.metal} />
        <Box s={[0.015, 0.1, 0.16]} p={[0.18, 1.33, -0.05]} m={m.flag} />
        <mesh position={[0.172, 1.08, 0]} rotation={[0, Math.PI / 2, 0]} material={decal}>
          <planeGeometry args={[0.4, 0.1]} />
        </mesh>
      </group>
    </Hotspot>
  );
}

/* ------------------------------------------------------------------ signpost = navigation */

const ARROWS: { label: string; station: "work" | "about" | "open-source" | "contact"; y: number; dir: 1 | -1; turn: number; tint: "awningA" | "awningB" | "trim" }[] = [
  { label: "WORK", station: "work", y: 2.12, dir: 1, turn: -0.15, tint: "awningA" },
  { label: "ABOUT", station: "about", y: 1.8, dir: -1, turn: 0.35, tint: "awningB" },
  { label: "OPEN SOURCE", station: "open-source", y: 1.48, dir: 1, turn: 0.1, tint: "trim" },
  { label: "CONTACT", station: "contact", y: 1.16, dir: -1, turn: -0.3, tint: "awningA" },
];

function arrowGeometry(): THREE.ExtrudeGeometry {
  const w = 0.98;
  const h = 0.24;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2 - 0.12, -h / 2);
  s.lineTo(w / 2, 0);
  s.lineTo(w / 2 - 0.12, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  g.translate(0, 0, -0.02);
  return g;
}

function Arrow({ a }: { a: (typeof ARROWS)[number] }) {
  const m = mats();
  const geo = useMemo(() => arrowGeometry(), []);
  const face = useMemo(
    () =>
      glowMap(
        drawnTexture(512, 128, (ctx, w, h) => {
          ctx.font = font(600, 62);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = k.ink;
          ctx.fillText(a.label, w / 2 - 20, h / 2 + 4);
        }),
        1.25,
      ),
    [a.label],
  );
  const [x, , z] = SIGNPOST;
  const offset = 0.47 * a.dir;
  return (
    <Hotspot
      id={`sign-${a.station}`}
      label={a.label.charAt(0) + a.label.slice(1).toLowerCase()}
      station={a.station}
      halo={{ size: [1.06, 0.3, 0.08], pos: [x + Math.cos(a.turn) * offset, a.y, z - Math.sin(a.turn) * offset], rot: [0, a.turn, 0] }}
    >
      <group position={[x, a.y, z]} rotation={[0, a.turn, 0]}>
        <group position={[offset, 0, 0]} scale={[a.dir, 1, 1]}>
          <mesh geometry={geo} material={m[a.tint]} />
        </group>
        <mesh position={[offset - 0.03 * a.dir, 0, 0.022]} material={face}>
          <planeGeometry args={[0.82, 0.2]} />
        </mesh>
      </group>
    </Hotspot>
  );
}

export function Signpost() {
  const m = mats();
  const [x, , z] = SIGNPOST;
  return (
    <group>
      <Cyl a={[0.05, 0.06, 2.55]} p={[x, 1.27, z]} m={m.metal} />
      <Cyl a={[0.16, 0.2, 0.08]} p={[x, 0.04, z]} m={m.black} />
      <mesh position={[x, 2.6, z]} material={m.tip}>
        <sphereGeometry args={[0.045, 16, 16]} />
      </mesh>
      {ARROWS.map((a) => (
        <Arrow key={a.label} a={a} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ bulbs, stools, pole */

function Bulb({ p, intensity }: { p: V3; intensity: number }) {
  const m = mats();
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (light.current) light.current.intensity = intensity * fx.power;
  });
  return (
    <group position={p}>
      <Cyl a={[0.004, 0.004, 0.28]} p={[0, 0.17, 0]} m={m.black} />
      <Cyl a={[0.03, 0.03, 0.05]} p={[0, 0.04, 0]} m={m.metal} />
      <mesh material={m.bulb}>
        <sphereGeometry args={[0.065, 20, 20]} />
      </mesh>
      <pointLight ref={light} color={k.bulbLight} intensity={0} distance={5.5} decay={2} />
    </group>
  );
}

export function Bulbs() {
  return (
    <>
      <Bulb p={[-0.48, 2.28, 1.12]} intensity={5} />
      <Bulb p={[0.48, 2.28, 1.12]} intensity={5} />
    </>
  );
}

function Stool({ x }: { x: number }) {
  const m = mats();
  return (
    <group position={[x, 0, 1.3]}>
      <Cyl a={[0.18, 0.17, 0.06]} p={[0, 0.66, 0]} m={m.stool} />
      <Cyl a={[0.025, 0.025, 0.6]} p={[0, 0.34, 0]} m={m.metal} />
      <Cyl a={[0.15, 0.17, 0.03]} p={[0, 0.03, 0]} m={m.metal} />
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.metal}>
        <torusGeometry args={[0.11, 0.008, 8, 24]} />
      </mesh>
    </group>
  );
}

export function Stools() {
  return (
    <>
      <Stool x={-0.55} />
      <Stool x={0.4} />
    </>
  );
}

export function PoleAndCable() {
  const m = mats();
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.45, 3.45, 0.82),
      new THREE.Vector3(2.4, 3.05, -0.4),
      new THREE.Vector3(3.6, 3.95, -1.6),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.008, 6, false);
  }, []);
  const cable2 = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.6, 3.8, -1.6),
      new THREE.Vector3(1.0, 3.6, -3.5),
      new THREE.Vector3(-3.5, 4.4, -4.5),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.008, 6, false);
  }, []);
  return (
    <group>
      <Cyl a={[0.07, 0.09, 4.4]} p={[3.6, 2.2, -1.6]} m={m.wallDark} />
      <Box s={[0.9, 0.06, 0.06]} p={[3.6, 4.0, -1.6]} m={m.wallDark} />
      <mesh geometry={cable} material={m.black} />
      <mesh geometry={cable2} material={m.black} />
    </group>
  );
}

/* ------------------------------------------------------------------ the city behind */

export function Skyline() {
  const m = mats();
  const { boxes, windows } = useMemo(() => {
    const r = rng(7);
    const boxes: { p: V3; s: V3 }[] = [];
    const pos: number[] = [];
    const col: number[] = [];
    const warm = new THREE.Color(k.windowWarm);
    const cool = new THREE.Color(k.windowCool);
    for (let i = 0; i < 38; i++) {
      const w = 1.2 + r() * 2.2;
      const h = 1.5 + r() * 6;
      const d = 1 + r() * 2;
      const x = -18 + i * 0.95 + r() * 0.6;
      const z = -11 - r() * 8;
      boxes.push({ p: [x, h / 2, z], s: [w, h, d] });
      const n = Math.floor(h * w * 0.9);
      for (let j = 0; j < n; j++) {
        if (r() > 0.42) continue;
        pos.push(x - w / 2 + 0.2 + r() * (w - 0.4), 0.5 + r() * (h - 0.8), z + d / 2 + 0.02);
        const c = r() > 0.25 ? warm : cool;
        col.push(c.r, c.g, c.b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return { boxes, windows: g };
  }, []);
  const winMat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true }),
    [],
  );
  return (
    <group>
      {boxes.map((b, i) => (
        <Box key={i} s={b.s} p={b.p} m={m.skyline} />
      ))}
      <points geometry={windows} material={winMat} />
    </group>
  );
}

/* ------------------------------------------------------------------ drifting dust in the light */

export function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const r = rng(11);
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = -2.4 + r() * 4.8;
      p[i * 3 + 1] = 0.2 + r() * 3;
      p[i * 3 + 2] = -0.9 + r() * 2.8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.018,
        color: k.dust,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  useFrame((_, dt) => {
    if (fx.reduced) return;
    const a = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + dt * 0.05;
      if (y > 3.2) y = 0.2;
      a.setY(i, y);
    }
    a.needsUpdate = true;
    if (ref.current) ref.current.rotation.y += dt * 0.01;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}
