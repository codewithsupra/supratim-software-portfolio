"use client";

/* eslint-disable react-hooks/immutability --
   three.js objects here are built once and then mutated
   on every animation frame inside useFrame. None of it is React state, so the compiler
   rules about render purity do not apply. */

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { finalPass } from "./shaders";
import { flight } from "./store";

/**
 * Render → bloom → tone map → a final pass for vignette, grain and warp aberration.
 * Everything that should glow is written brighter than 1.0 in linear space, so the bloom
 * threshold picks out the star, the engines and the lava without a separate glow layer.
 */
export function Effects({ bloomScale }: { bloomScale: number }) {
  const { gl, scene, camera, size } = useThree();

  const fx = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.72, 0.55, 0.85);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const fin = new ShaderPass(finalPass);
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
    fx.fin.uniforms.uBoost!.value = flight.reduced ? 0 : flight.boost;
    fx.bloom.strength = 0.72 + flight.boost * 0.45;
    fx.composer.render(dt);
  }, 1);

  return null;
}
