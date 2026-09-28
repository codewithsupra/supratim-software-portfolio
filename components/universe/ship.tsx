"use client";

/* eslint-disable react-hooks/immutability --
   three.js objects here are built once and then mutated
   on every animation frame inside useFrame. None of it is React state, so the compiler
   rules about render purity do not apply. */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { flameFragment, flameVertex } from "./shaders";
import { scene as colors } from "./palette";
import { discover, flight, getState, openPanel, setState } from "./store";
import { shipState as ship } from "./ship-state";
import { standoff, worldPos, worlds, worldsById } from "./worlds";

const CRUISE = 34;
const WARP = 150;
const FORWARD = new THREE.Vector3(0, 0, -1);
const UP = new THREE.Vector3(0, 1, 0);

const damp = (a: number, b: number, rate: number, dt: number) => a + (b - a) * (1 - Math.exp(-rate * dt));
const angleDelta = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function useHullGeometry() {
  return useMemo(() => {
    const profile = [
      [0, -2.2], [0.3, -2.05], [0.52, -1.4], [0.6, -0.2], [0.56, 0.9], [0.4, 1.7], [0.14, 2.35], [0, 2.5],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const hull = new THREE.LatheGeometry(profile, 32);
    hull.rotateX(-Math.PI / 2);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0.35, -0.6);
    wingShape.lineTo(3.3, 1.3);
    wingShape.lineTo(3.25, 1.75);
    wingShape.lineTo(0.35, 1.55);
    wingShape.closePath();
    const wing = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.07, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.04, bevelSegments: 2,
    });
    wing.rotateX(Math.PI / 2);

    const finShape = new THREE.Shape();
    finShape.moveTo(0.6, 0);
    finShape.lineTo(2.1, 0.9);
    finShape.lineTo(2.45, 0.9);
    finShape.lineTo(2.2, 0);
    finShape.closePath();
    const fin = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: false });
    fin.rotateY(-Math.PI / 2);
    return { hull, wing, fin };
  }, []);
}

/** Engine exhaust: a pool of particles emitted from the nozzles in world space. */
function useExhaust(count: number) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const size = new Float32Array(count);
    const vel = new Float32Array(count * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aLife", new THREE.BufferAttribute(life, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: flameVertex, fragmentShader: flameFragment,
      uniforms: {
        uPR: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2) },
        uHot: { value: new THREE.Color(colors.flameHot) },
        uCool: { value: new THREE.Color(colors.flame) },
      },
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(g, mat);
    points.frustumCulled = false;
    return { points, pos, life, size, vel, next: 0, carry: 0 };
  }, [count]);
}

export function Ship({ exhaustCount }: { exhaustCount: number }) {
  const { camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const body = useRef<THREE.Group>(null!);
  const nozzles = useRef<THREE.MeshBasicMaterial[]>([]);
  const tips = useRef<THREE.MeshBasicMaterial[]>([]);
  const { hull, wing, fin } = useHullGeometry();
  const ex = useExhaust(exhaustCount);

  const tmp = useMemo(() => ({
    q: new THREE.Quaternion(), qv: new THREE.Quaternion(), e: new THREE.Euler(0, 0, 0, "YXZ"),
    fwd: new THREE.Vector3(), d: new THREE.Vector3(), camPos: new THREE.Vector3(),
    look: new THREE.Vector3(), lookSmooth: new THREE.Vector3(0, 0, 0), right: new THREE.Vector3(),
    introFrom: new THREE.Vector3(-60, 110, 520), nozzle: new THREE.Vector3(), prevYaw: ship.yaw,
    flameCol: new THREE.Color(colors.flame), hotCol: new THREE.Color(colors.flameHot),
  }), []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const ui = getState();
    const k = flight.keys;
    const t = state.clock.elapsedTime;

    if (ship.intro < 1) ship.intro = flight.reduced ? 1 : Math.min(1, ship.intro + dt / 3.4);
    const flying = ui.panel === null && ship.intro > 0.55;

    // ---- input
    let yawIn = 0, pitchIn = 0, thrust = 0;
    let boost = false;
    if (flying) {
      if (k.has("KeyA") || k.has("ArrowLeft")) yawIn += 1;
      if (k.has("KeyD") || k.has("ArrowRight")) yawIn -= 1;
      if (k.has("KeyR") || k.has("PageUp")) pitchIn += 1;
      if (k.has("KeyF") || k.has("PageDown")) pitchIn -= 1;
      yawIn -= flight.steer.x;
      pitchIn -= flight.steer.y;
      if (k.has("KeyW") || k.has("ArrowUp") || flight.touchThrust) thrust = 1;
      if (k.has("KeyS") || k.has("ArrowDown")) thrust = -1;
      boost = k.has("ShiftLeft") || k.has("ShiftRight");
    }
    const manual = yawIn !== 0 || pitchIn !== 0 || thrust !== 0;
    if (manual && ui.target) setState({ target: null });
    if (manual && ship.docked) ship.docked = null;

    // ---- steering and speed
    let targetSpeed = 0;
    let warp = 0;
    const target = getState().target;
    if (target) {
      const w = worldsById[target]!;
      const tp = worldPos[target]!;
      tmp.d.subVectors(tp, ship.position);
      const dist = tmp.d.length();
      const remaining = dist - standoff(w);
      const desiredYaw = Math.atan2(-tmp.d.x, -tmp.d.z);
      const desiredPitch = Math.atan2(tmp.d.y, Math.hypot(tmp.d.x, tmp.d.z));
      const turn = 1 - Math.exp(-2.4 * dt);
      ship.yaw += angleDelta(ship.yaw, desiredYaw) * turn;
      ship.pitch += (desiredPitch - ship.pitch) * turn;
      // Only accelerate once roughly facing the target, so the path curves instead of skids.
      const facing = Math.max(0, Math.cos(angleDelta(ship.yaw, desiredYaw)));
      warp = remaining > 140 ? 1 : 0;
      targetSpeed = THREE.MathUtils.clamp(remaining * 0.9, 0, warp ? WARP : CRUISE * 1.4) * facing;
      if (remaining < 1.2) {
        ship.docked = target;
        ship.dockLast.copy(tp);
        openPanel(target);
        targetSpeed = 0;
      }
    } else {
      ship.yaw += yawIn * 1.35 * dt;
      ship.pitch = THREE.MathUtils.clamp(ship.pitch + pitchIn * 0.95 * dt, -1.25, 1.25);
      if (thrust > 0) targetSpeed = boost ? WARP : CRUISE;
      else if (thrust < 0) targetSpeed = -6;
      else targetSpeed = flight.speed * 0.985;
      warp = boost && thrust > 0 ? 1 : 0;
    }
    const accel = targetSpeed > flight.speed ? (warp ? 0.9 : 1.5) : 1.8;
    flight.speed = damp(flight.speed, targetSpeed, accel, dt);
    flight.boost = damp(flight.boost, warp, warp ? 1.4 : 2.2, dt);

    tmp.e.set(ship.pitch, ship.yaw, 0);
    tmp.q.setFromEuler(tmp.e);
    tmp.fwd.copy(FORWARD).applyQuaternion(tmp.q);
    ship.velocity.copy(tmp.fwd).multiplyScalar(flight.speed);
    ship.position.addScaledVector(ship.velocity, dt);

    // A parked ship rides along with the world it is parked at.
    if (ship.docked) {
      const tp = worldPos[ship.docked]!;
      ship.position.add(tmp.d.subVectors(tp, ship.dockLast));
      ship.dockLast.copy(tp);
    }

    // ---- keep out of the worlds and inside the system
    for (const w of worlds) {
      const p = worldPos[w.id]!;
      tmp.d.subVectors(ship.position, p);
      const min = w.size * (w.kind === "star" ? 1.9 : 1.35) + 1.6;
      const len = tmp.d.length();
      if (len < min && len > 0.0001) {
        ship.position.copy(p).addScaledVector(tmp.d.divideScalar(len), min);
        flight.speed *= 0.6;
      }
    }
    if (ship.position.length() > 520) ship.position.setLength(520);

    // ---- proximity: what is the ship close enough to scan?
    let near: string | null = null;
    let best = Infinity;
    for (const w of worlds) {
      const d = ship.position.distanceTo(worldPos[w.id]!) - w.size;
      if (d < w.size * 4 + 14 && d < best) { best = d; near = w.id; }
    }
    if (near) discover(near);
    if (near !== ui.near) setState({ near });

    // ---- the ship's body: banks into turns, pitches with the climb
    const yawRate = angleDelta(tmp.prevYaw, ship.yaw) / Math.max(dt, 1e-4);
    tmp.prevYaw = ship.yaw;
    ship.roll = damp(ship.roll, THREE.MathUtils.clamp(yawRate * 0.45, -0.9, 0.9), 4, dt);
    body.current.position.copy(ship.position);
    tmp.e.set(ship.pitch, ship.yaw, ship.roll);
    body.current.quaternion.setFromEuler(tmp.e);
    // A little life when idle, so the ship never looks like a static model.
    body.current.position.y += Math.sin(t * 1.3) * 0.06;

    const throttle = THREE.MathUtils.clamp(Math.abs(flight.speed) / CRUISE, 0, 1);
    const glow = 0.3 + throttle * 1.5 + flight.boost * 4;
    nozzles.current.forEach((m) => m.color.copy(tmp.flameCol).lerp(tmp.hotCol, flight.boost * 0.7).multiplyScalar(glow));
    tips.current.forEach((m, i) => {
      const blink = Math.pow(0.5 + 0.5 * Math.sin(t * 4 + i * Math.PI), 12);
      m.opacity = 0.25 + blink;
    });

    // ---- exhaust particles
    const rate = 14 + throttle * 460 + flight.boost * 900;
    ex.carry += rate * dt;
    const n = exhaustCount;
    while (ex.carry >= 1) {
      ex.carry -= 1;
      const i = ex.next;
      ex.next = (ex.next + 1) % n;
      const side = i % 2 === 0 ? -0.55 : 0.55;
      tmp.nozzle.set(side, 0, 2.45).applyQuaternion(body.current.quaternion).add(body.current.position);
      ex.pos.set([tmp.nozzle.x, tmp.nozzle.y, tmp.nozzle.z], i * 3);
      const spread = 0.8;
      ex.vel.set([
        -ship.velocity.x * 0.35 + tmp.fwd.x * -8 + (Math.random() - 0.5) * spread,
        -ship.velocity.y * 0.35 + tmp.fwd.y * -8 + (Math.random() - 0.5) * spread,
        -ship.velocity.z * 0.35 + tmp.fwd.z * -8 + (Math.random() - 0.5) * spread,
      ], i * 3);
      ex.life[i] = 1;
      ex.size[i] = 0.16 + Math.random() * 0.14 + flight.boost * 0.22;
    }
    for (let i = 0; i < n; i++) {
      if (ex.life[i]! <= 0) continue;
      ex.life[i] = Math.max(0, ex.life[i]! - dt * (1.6 - flight.boost * 0.5));
      ex.pos[i * 3] = ex.pos[i * 3]! + ex.vel[i * 3]! * dt;
      ex.pos[i * 3 + 1] = ex.pos[i * 3 + 1]! + ex.vel[i * 3 + 1]! * dt;
      ex.pos[i * 3 + 2] = ex.pos[i * 3 + 2]! + ex.vel[i * 3 + 2]! * dt;
    }
    const g = ex.points.geometry;
    g.attributes.position!.needsUpdate = true;
    g.attributes.aLife!.needsUpdate = true;
    g.attributes.aSize!.needsUpdate = true;

    // ---- camera
    const panel = ui.panel;
    if (panel && worldsById[panel]) {
      // Dossier open: frame the world beside the panel, like a documentary establishing shot.
      const w = worldsById[panel]!;
      const p = worldPos[panel]!;
      tmp.d.subVectors(ship.position, p).normalize().applyAxisAngle(UP, 0.75);
      const reach = standoff(w) * 1.25;
      tmp.camPos.copy(p).addScaledVector(tmp.d, reach).addScaledVector(UP, w.size * 0.9 + 1.2);
      tmp.right.subVectors(p, tmp.camPos).normalize().cross(UP).normalize();
      const wide = size.width >= 900;
      tmp.look.copy(p);
      if (wide) tmp.look.addScaledVector(tmp.right, w.size * 1.25 + (w.kind === "star" ? 6 : 1.5));
      else tmp.look.addScaledVector(UP, -(w.size * 1.1 + 1));
      cam.position.lerp(tmp.camPos, 1 - Math.exp(-2.2 * dt));
      tmp.lookSmooth.lerp(tmp.look, 1 - Math.exp(-3 * dt));
    } else {
      tmp.e.set(ship.pitch, ship.yaw, 0);
      tmp.qv.setFromEuler(tmp.e);
      // Narrow screens pull the chase camera back so the ship doesn't fill a phone.
      const narrow = size.width < 700 ? 1.55 : 1;
      const back = (9.5 + flight.boost * 3) * narrow;
      tmp.camPos.set(0, (2.5 + flight.boost * 0.3) * narrow, back).applyQuaternion(tmp.qv).add(ship.position);
      tmp.look.copy(tmp.fwd).multiplyScalar(10).add(ship.position).addScaledVector(UP, 1.1);
      if (ship.intro < 1) {
        const k2 = ease(ship.intro);
        tmp.camPos.lerpVectors(tmp.introFrom, tmp.camPos, k2);
        tmp.look.lerpVectors(worldPos.sun!, tmp.look, k2);
        cam.position.copy(tmp.camPos);
        tmp.lookSmooth.copy(tmp.look);
      } else {
        cam.position.lerp(tmp.camPos, 1 - Math.exp(-5 * dt));
        tmp.lookSmooth.lerp(tmp.look, 1 - Math.exp(-8 * dt));
      }
    }
    cam.lookAt(tmp.lookSmooth);
    const fov = 58 + flight.boost * 24;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    flight.x = ship.position.x;
    flight.y = ship.position.y;
    flight.z = ship.position.z;
  }, -1);

  return (
    <>
      <group ref={body}>
        <mesh geometry={hull}>
          <meshStandardMaterial color={colors.hull} metalness={0.85} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.34, -0.7]} scale={[0.34, 0.26, 0.95]}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color={colors.canopy} metalness={0.3} roughness={0.6}
            emissive={colors.canopy} emissiveIntensity={0.25} />
        </mesh>
        {[1, -1].map((s) => (
          <group key={s} scale={[s, 1, 1]}>
            <mesh geometry={wing} position={[0, -0.05, 0]}>
              <meshStandardMaterial color={colors.hull} metalness={0.8} roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[1.83, -0.02, 0.35]} rotation={[0, -0.57, 0]}>
              <boxGeometry args={[3.5, 0.03, 0.05]} />
              <meshBasicMaterial color={new THREE.Color(colors.flame).multiplyScalar(1.3)} />
            </mesh>
            <mesh position={[3.28, 0, 1.55]}>
              <sphereGeometry args={[0.07, 12, 8]} />
              <meshBasicMaterial
                ref={(m) => { if (m) tips.current[s > 0 ? 0 : 1] = m; }}
                color={new THREE.Color(s > 0 ? colors.canopy : colors.flame).multiplyScalar(4)}
                transparent
              />
            </mesh>
            <mesh geometry={fin} position={[0.55, 0.2, 0]} rotation={[0, 0, -0.35]}>
              <meshStandardMaterial color={colors.hull} metalness={0.5} roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.55, 0, 1.95]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.3, 0.95, 20]} />
              <meshStandardMaterial color={colors.hullTrim} metalness={0.9} roughness={0.6} />
            </mesh>
            <mesh position={[0.55, 0, 2.43]}>
              <circleGeometry args={[0.17, 24]} />
              <meshBasicMaterial ref={(m) => { if (m) nozzles.current[s > 0 ? 0 : 1] = m; }} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 1.6, -1]} intensity={0.5} distance={8} decay={2} color={colors.canopy} />
      </group>
      <primitive object={ex.points} />
    </>
  );
}
