"use client";

/* eslint-disable react-hooks/immutability --
   three.js objects here are built once and then mutated
   on every animation frame inside useFrame. None of it is React state, so the compiler
   rules about render purity do not apply. */

import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Belt, Comet, OrbitLines, Orbits, Planet, Relay, Star } from "./bodies";
import { Dust, Nebula, Stars } from "./sky";
import { Ship } from "./ship";
import { Effects } from "./effects";
import { flight, getState, labelEls, setState } from "./store";
import { token } from "./palette";
import { worldPos, worlds } from "./worlds";

/**
 * Projects each world's position onto the screen and moves its HTML label there. Written
 * straight to the DOM every frame — React never re-renders for it.
 */
function LabelProjector() {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const order = useMemo(() => worlds.slice(), []);
  const rects = useMemo(() => [] as Array<[number, number, number, number]>, []);
  useFrame(() => {
    const ui = getState();
    order.sort((a, b) => camera.position.distanceTo(worldPos[a.id]!) - camera.position.distanceTo(worldPos[b.id]!));
    rects.length = 0;
    for (const w of order) {
      const el = labelEls.get(w.id);
      if (!el) continue;
      const p = worldPos[w.id]!;
      up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      v.copy(p).addScaledVector(up, w.size * (w.kind === "star" ? 1.35 : 1.6) + 0.6).project(camera);
      const dist = camera.position.distanceTo(p);
      const visible = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 && ui.panel === null && dist > w.size * 2.2;
      if (!visible) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        continue;
      }
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const fade = THREE.MathUtils.clamp(1.25 - dist / 420, 0.35, 1);
      const hw = el.offsetWidth / 2 + 6;
      const h = el.offsetHeight + 4;
      const hot = ui.target === w.id || ui.near === w.id;
      if (!hot && rects.some(([l, t, r, b]) => x - hw < r && x + hw > l && y - h < b && y > t)) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        continue;
      }
      rects.push([x - hw, y - h, x + hw, y]);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      el.style.opacity = String(hot ? 1 : fade);
      el.style.pointerEvents = "auto";
    }
  });
  return null;
}

function Ready() {
  useEffect(() => { setState({ ready: true }); }, []);
  return null;
}

export default function Scene() {
  const coarse = flight.coarse;
  const q = coarse
    ? { stars: 5000, dust: 900, belt: 700, exhaust: 360, dpr: 1.35, bloom: 0.35 }
    : { stars: 11000, dust: 1800, belt: 1600, exhaust: 700, dpr: 1.75, bloom: 0.5 };

  return (
    <div className="absolute inset-0 z-0">
    <Canvas
      dpr={[1, q.dpr]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: 58, near: 0.1, far: 9000, position: [-60, 110, 520] }}
      onCreated={({ gl, scene }) => {
        if (process.env.NODE_ENV !== "production") (window as unknown as { __scene: THREE.Scene }).__scene = scene;
        gl.setClearColor(token.bg);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Orbits />
      <Nebula />
      <Stars count={q.stars} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={[token.violet, token.bg, 0.35]} />
      {worlds.map((w) => {
        if (w.kind === "star") return <Star key={w.id} world={w} />;
        if (w.kind === "planet") return <Planet key={w.id} world={w} />;
        if (w.kind === "comet") return <Comet key={w.id} world={w} />;
        return <Relay key={w.id} world={w} />;
      })}
      <OrbitLines />
      <Belt count={q.belt} />
      <Dust count={q.dust} />
      <Ship exhaustCount={q.exhaust} />
      <LabelProjector />
      <Effects bloomScale={q.bloom} />
      <Ready />
    </Canvas>
    </div>
  );
}
