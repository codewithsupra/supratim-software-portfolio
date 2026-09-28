"use client";

/* eslint-disable react-hooks/immutability, react-hooks/purity --
   three.js objects here are built once (procedurally, hence Math.random) and then mutated
   on every animation frame inside useFrame. None of it is React state, so the compiler
   rules about render purity do not apply. */

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  dustFragment, dustVertex, nebulaFragment, skyVertex, starsFragment, starsVertex,
} from "./shaders";
import { scene as colors, token } from "./palette";
import { clock } from "./clock";
import { flight } from "./store";
import { shipState } from "./ship-state";

const pr = () => Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2);

/** The backdrop: a sphere that travels with the camera, so it is always infinitely far. */
export function Nebula() {
  const { camera } = useThree();
  const u = useMemo(() => ({
    uTime: { value: 0 },
    uIndigo: { value: new THREE.Color(token.indigo) },
    uViolet: { value: new THREE.Color(token.violet) },
    uMagenta: { value: new THREE.Color(token.magenta) },
  }), []);
  const mesh = useMemo(() => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(4200, 64, 48),
      new THREE.ShaderMaterial({
        vertexShader: skyVertex, fragmentShader: nebulaFragment, uniforms: u,
        side: THREE.BackSide, depthWrite: false,
      }),
    );
    m.renderOrder = -10;
    m.frustumCulled = false;
    return m;
  }, [u]);
  useFrame(() => {
    mesh.position.copy(camera.position);
    u.uTime.value = clock.t;
  });
  return <primitive object={mesh} />;
}

export function Stars({ count }: { count: number }) {
  const { camera } = useThree();
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const band = new THREE.Vector3(0.28, 1, -0.4).normalize();
    const v = new THREE.Vector3();
    const c = new THREE.Color();
    const temps = [
      new THREE.Color(0.66, 0.78, 1.0), new THREE.Color(1, 1, 1),
      new THREE.Color(1.0, 0.86, 0.7), new THREE.Color(0.95, 0.72, 1.0),
    ];
    for (let i = 0; i < count; i++) {
      // Half the stars crowd into a galactic band, the rest scatter across the sky.
      do {
        v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      } while (v.lengthSq() > 1 || v.lengthSq() < 0.01);
      v.normalize();
      if (i % 2 === 0) {
        const off = v.dot(band);
        v.addScaledVector(band, -off * 0.88).normalize();
      }
      v.multiplyScalar(3400);
      pos.set([v.x, v.y, v.z], i * 3);
      c.copy(temps[Math.floor(Math.random() * temps.length)]!);
      const mag = Math.pow(Math.random(), 5);
      c.multiplyScalar(0.55 + mag * 2.2);
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = 1.1 + mag * 4.4;
      phase[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const p = new THREE.Points(g, new THREE.ShaderMaterial({
      vertexShader: starsVertex, fragmentShader: starsFragment,
      uniforms: { uTime: { value: 0 }, uPR: { value: pr() } },
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    p.renderOrder = -9;
    p.frustumCulled = false;
    return p;
  }, [count]);
  useFrame(() => {
    points.position.copy(camera.position);
    (points.material as THREE.ShaderMaterial).uniforms.uTime!.value = clock.t;
  });
  return <primitive object={points} />;
}

/**
 * Dust in a box that wraps around the camera. At cruise it is the parallax that makes
 * flight feel like motion; at warp the same particles are drawn a second time as lines
 * stretched back along the velocity, which is the hyperspace effect.
 */
export function Dust({ count }: { count: number }) {
  const { camera } = useThree();
  const box = 140;
  const { dots, streaks, u, su } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      base.set([Math.random() * box, Math.random() * box, Math.random() * box], i * 3);
      seed[i] = Math.random();
    }
    const common = () => ({
      uCam: { value: new THREE.Vector3() },
      uVel: { value: new THREE.Vector3() },
      uBox: { value: box },
      uStretch: { value: 0 },
      uPR: { value: pr() },
      uPoint: { value: 1.6 },
      uColor: { value: new THREE.Color(colors.dust) },
      uIntensity: { value: 0.6 },
      uIsPoint: { value: 1 },
    });

    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.BufferAttribute(base, 3));
    dg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    dg.setAttribute("aEnd", new THREE.BufferAttribute(new Float32Array(count), 1));
    const u = common();
    const dots = new THREE.Points(dg, new THREE.ShaderMaterial({
      vertexShader: dustVertex, fragmentShader: dustFragment, uniforms: u,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    dots.frustumCulled = false;

    const lp = new Float32Array(count * 6);
    const ls = new Float32Array(count * 2);
    const le = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      lp.set([base[i * 3]!, base[i * 3 + 1]!, base[i * 3 + 2]!], i * 6);
      lp.set([base[i * 3]!, base[i * 3 + 1]!, base[i * 3 + 2]!], i * 6 + 3);
      ls[i * 2] = ls[i * 2 + 1] = seed[i]!;
      le[i * 2] = 0;
      le[i * 2 + 1] = 1;
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.BufferAttribute(lp, 3));
    lg.setAttribute("aSeed", new THREE.BufferAttribute(ls, 1));
    lg.setAttribute("aEnd", new THREE.BufferAttribute(le, 1));
    const su = common();
    su.uColor.value = new THREE.Color(colors.streak);
    su.uIsPoint.value = 0;
    const streaks = new THREE.LineSegments(lg, new THREE.ShaderMaterial({
      vertexShader: dustVertex, fragmentShader: dustFragment, uniforms: su,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    streaks.frustumCulled = false;
    return { dots, streaks, u, su };
  }, [count]);

  useFrame(() => {
    u.uCam.value.copy(camera.position);
    su.uCam.value.copy(camera.position);
    su.uVel.value.copy(shipState.velocity);
    const warp = flight.boost;
    su.uStretch.value = 0.02 + warp * 0.16;
    su.uIntensity.value = Math.min(1, flight.speed / 60) * (0.25 + warp * 1.6);
    u.uIntensity.value = 0.55 * (1 - warp * 0.6);
  });

  return (
    <>
      <primitive object={dots} />
      <primitive object={streaks} />
    </>
  );
}
