"use client";

/* eslint-disable react-hooks/immutability --
   three.js materials are built once and mutated every frame inside useFrame; none of it
   is React state. */

import { useMemo, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { k } from "./palette";
import { go, setState, useKiosk, type Station } from "./store";
import type { V3 } from "./layout";

/**
 * Anything you can click. Hovering lights a soft cyan halo (cyan means "interactive",
 * as in the interface) and shows a label by the pointer; a click that ends a drag is
 * ignored so orbiting never opens a panel by accident.
 */
export function Hotspot({
  id,
  label,
  station,
  halo,
  children,
}: {
  id: string;
  label: string;
  station: Station;
  halo: { size: V3; pos: V3; rot?: V3 };
  children: ReactNode;
}) {
  const hovered = useKiosk((s) => s.hover === id);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(k.accent).multiplyScalar(1.6),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useFrame((_, dt) => {
    const goal = hovered ? 0.16 : 0;
    mat.opacity += (goal - mat.opacity) * Math.min(1, dt * 10);
  });

  const tip = (e: ThreeEvent<PointerEvent>) => ({ label, x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta > 6) return;
        go(station);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setState({ hover: id, tip: tip(e) });
        document.body.style.cursor = "pointer";
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        setState({ tip: tip(e) });
      }}
      onPointerOut={() => {
        setState({ hover: null, tip: null });
        document.body.style.cursor = "";
      }}
    >
      {children}
      <mesh position={halo.pos} rotation={halo.rot} material={mat} raycast={() => null}>
        <boxGeometry args={halo.size} />
      </mesh>
    </group>
  );
}
