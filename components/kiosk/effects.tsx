"use client";

/* eslint-disable react-hooks/immutability --
   The composer and its passes are built once and driven every frame; not React state. */

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const finish = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float v = smoothstep(1.15, 0.25, length(vUv - 0.5) * 1.35);
      c *= mix(0.55, 1.0, v);
      c += (hash(vUv * 900.0 + uTime) - 0.5) * 0.022;
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

/** Render → bloom (only what is brighter than 1.0 glows) → tone map → vignette and grain. */
export function Effects({ bloomScale }: { bloomScale: number }) {
  const { gl, scene, camera, size } = useThree();
  const fx = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.62, 0.5, 0.92);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const fin = new ShaderPass(finish);
    composer.addPass(fin);
    return { composer, bloom, fin };
  }, [gl, scene, camera]);

  useEffect(() => {
    fx.composer.setPixelRatio(gl.getPixelRatio());
    fx.composer.setSize(size.width, size.height);
    fx.bloom.resolution.set(size.width * bloomScale, size.height * bloomScale);
  }, [fx, gl, size, bloomScale]);
  useEffect(() => () => fx.composer.dispose(), [fx]);

  useFrame((_, dt) => {
    fx.fin.uniforms.uTime!.value += dt;
    fx.composer.render(dt);
  }, 1);
  return null;
}
