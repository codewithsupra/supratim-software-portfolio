"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bench, Bulbs, Dust, Floor, Kiosk, Mailbox, Plaque, PoleAndCable, Radio, Signpost, Skyline, Stools, TvWall } from "./models";
import { CameraRig } from "./rig";
import { PowerUp } from "./power";
import { Effects } from "./effects";
import { k } from "./palette";
import { fx, setState } from "./store";

/** Clears the hover state if the pointer leaves the canvas mid-hover. */
function PointerReset() {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const off = () => {
      setState({ hover: null, tip: null });
      document.body.style.cursor = "";
    };
    el.addEventListener("pointerleave", off);
    return () => el.removeEventListener("pointerleave", off);
  }, [gl]);
  return null;
}

export default function Scene() {
  const q = fx.coarse ? { dpr: 1.35, bloom: 0.4, dust: 120 } : { dpr: 1.75, bloom: 0.5, dust: 260 };
  return (
    <Canvas
      dpr={[1, q.dpr]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: 38, near: 0.05, far: 80, position: [7, 4, 10] }}
      onCreated={({ gl }) => {
        gl.setClearColor(k.bg);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
    >
      <fog attach="fog" args={[k.bg, 9, 24]} />
      <ambientLight color={k.violet} intensity={0.35} />
      <hemisphereLight args={[k.indigo, k.bg, 0.6]} />
      <directionalLight color={k.moon} intensity={0.45} position={[-6, 8, -4]} />
      <pointLight color={k.signLight} intensity={6} distance={7} decay={2} position={[0, 3.3, 1.7]} />
      <pointLight color={k.screenLight} intensity={2.4} distance={3.6} decay={2} position={[0, 1.8, 0.3]} />
      <pointLight color={k.accent} intensity={1.6} distance={3} decay={2} position={[-2.5, 2.7, 1.6]} />
      <Floor />
      <Kiosk />
      <TvWall />
      <Radio />
      <Bench />
      <Plaque />
      <Mailbox />
      <Signpost />
      <Bulbs />
      <Stools />
      <PoleAndCable />
      <Skyline />
      <Dust count={q.dust} />
      <CameraRig />
      <PowerUp />
      <PointerReset />
      <Effects bloomScale={q.bloom} />
    </Canvas>
  );
}
