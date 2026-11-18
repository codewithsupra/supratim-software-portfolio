"use client";

/* eslint-disable react-hooks/immutability --
   The camera, controls and rig vectors are three.js objects mutated every frame inside
   useFrame; none of it is React state. */

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { shotFor } from "./layout";
import { fx, getState, useKiosk } from "./store";

/**
 * In the overview you can drag to look around (within limits, so the kiosk never leaves
 * the frame). Picking a station hands the camera to a smooth glide; on wide screens the
 * framed object is nudged left so it stays clear of the panel that opens on the right.
 */
export function CameraRig() {
  const { camera, gl, size } = useThree();
  const station = useKiosk((s) => s.station);

  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.07;
    c.enablePan = false;
    c.minDistance = 5.2;
    c.maxDistance = 14;
    c.minPolarAngle = 0.95;
    c.maxPolarAngle = 1.45;
    c.minAzimuthAngle = -0.35;
    c.maxAzimuthAngle = 1.3;
    c.rotateSpeed = 0.55;
    c.zoomSpeed = 0.6;
    c.enabled = false;
    return c;
  }, [camera, gl]);
  useEffect(() => () => controls.dispose(), [controls]);

  const rig = useMemo(
    () => ({
      target: new THREE.Vector3(),
      goalPos: new THREE.Vector3(),
      goalTarget: new THREE.Vector3(),
      moving: true,
      first: true,
    }),
    [],
  );

  useEffect(() => {
    const portrait = size.width < size.height;
    const shot = shotFor(station, portrait);
    rig.goalPos.set(...shot.pos);
    rig.goalTarget.set(...shot.target);
    if (size.width >= 1024) {
      // Panels open on the right, the introduction sits bottom-left: frame each subject
      // in the space left free.
      const forward = new THREE.Vector3().subVectors(rig.goalTarget, rig.goalPos);
      const right = forward.clone().cross(camera.up).normalize();
      rig.goalTarget.addScaledVector(right, forward.length() * (station === "overview" ? -0.17 : 0.18));
    } else if (station !== "overview") {
      // On narrow screens the panel is a bottom sheet: frame the subject above it.
      const len = rig.goalPos.distanceTo(rig.goalTarget);
      rig.goalTarget.y -= len * 0.21;
    }
    controls.enabled = false;
    rig.moving = true;
    if (rig.first) {
      rig.first = false;
      rig.target.copy(rig.goalTarget);
      camera.position.copy(rig.goalPos);
      if (!fx.reduced) camera.position.sub(rig.goalTarget).multiplyScalar(1.28).add(rig.goalTarget);
      camera.lookAt(rig.target);
    }
    if (fx.reduced) {
      camera.position.copy(rig.goalPos);
      rig.target.copy(rig.goalTarget);
    }
  }, [station, size.width, size.height, camera, controls, rig]);

  useFrame((_, dt) => {
    if (rig.moving) {
      const k = 1 - Math.exp(-Math.min(dt, 0.05) * 3.4);
      camera.position.lerp(rig.goalPos, k);
      rig.target.lerp(rig.goalTarget, k);
      camera.lookAt(rig.target);
      if (camera.position.distanceTo(rig.goalPos) < 0.004 && rig.target.distanceTo(rig.goalTarget) < 0.004) {
        rig.moving = false;
        if (getState().station === "overview") {
          controls.target.copy(rig.target);
          controls.update();
          controls.enabled = true;
        }
      }
    } else if (controls.enabled) {
      controls.update();
    }
  });

  return null;
}
