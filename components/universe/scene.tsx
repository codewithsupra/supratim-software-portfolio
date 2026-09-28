"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Belt, Comet, OrbitLines, Orbits, Planet, Relay, Star } from "./bodies";
import { Dust, Nebula, Stars } from "./sky";
import { Ship } from "./ship";
import { Effects } from "./effects";
import { flight, setState } from "./store";
import { token } from "./palette";
import { worlds } from "./worlds";

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
      <Effects bloomScale={q.bloom} />
      <Ready />
    </Canvas>
    </div>
  );
}
