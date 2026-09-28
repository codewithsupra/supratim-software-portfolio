"use client";

/* eslint-disable react-hooks/immutability, react-hooks/purity --
   three.js objects here are built once (procedurally, hence Math.random) and then mutated
   on every animation frame inside useFrame. None of it is React state, so the compiler
   rules about render purity do not apply. */

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  atmosphereFragment, coronaFragment, coronaVertex, cometTailFragment, cometTailVertex,
  planetFragment, ringFragment, ringVertex, starFragment, surfaceVertex,
} from "./shaders";
import { scene as colors } from "./palette";
import { clock } from "./clock";
import { flyTo } from "./store";
import { orbitPosition, worldPos, worlds, type World } from "./worlds";

const sphere = new THREE.SphereGeometry(1, 128, 96);
const lowSphere = new THREE.SphereGeometry(1, 48, 32);

function seedOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return h / 37;
}

/** A click that was really the end of a drag-to-steer should not also launch the autopilot. */
function selectOnClick(id: string) {
  return (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    flyTo(id);
  };
}

const pointer = {
  onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); document.body.style.cursor = "pointer"; },
  onPointerOut: () => { document.body.style.cursor = ""; },
};

/** Runs first each frame: advances simulation time and places every world on its orbit. */
export function Orbits() {
  useFrame((_, dt) => {
    clock.t += Math.min(dt, 0.1) * clock.scale;
    for (const w of worlds) orbitPosition(w, clock.t, worldPos[w.id]!);
  }, -2);
  return null;
}

export function Planet({ world }: { world: World }) {
  const look = world.look!;
  const group = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const moon = useRef<THREE.Mesh>(null!);
  const beacon = useRef<THREE.Group>(null!);

  const u = useMemo(() => ({
    uTime: { value: 0 },
    uSeed: { value: seedOf(world.id) },
    uType: { value: look.type },
    uA: { value: new THREE.Color(look.a) },
    uB: { value: new THREE.Color(look.b) },
    uC: { value: new THREE.Color(look.c) },
    uAtmo: { value: new THREE.Color(look.atmo) },
  }), [look, world.id]);

  const atmo = useMemo(() => ({
    uAtmo: { value: new THREE.Color(look.atmo) },
    uIntensity: { value: look.type === 2 ? 1.9 : 1.7 },
  }), [look]);

  const ring = useMemo(() => {
    if (!look.rings) return null;
    const inner = look.rings.inner * world.size;
    const outer = look.rings.outer * world.size;
    return {
      geo: new THREE.RingGeometry(inner, outer, 192, 1),
      u: {
        uInner: { value: inner },
        uOuter: { value: outer },
        uTint: { value: new THREE.Color(look.rings.tint) },
        uSeed: { value: seedOf(world.id) },
        uCenter: { value: new THREE.Vector3() },
        uPlanetR: { value: world.size },
      },
    };
  }, [look, world.id, world.size]);

  const pulse = useMemo(() => ({
    geo: new THREE.RingGeometry(0.97, 1.0, 128, 1),
    mats: [0, 1].map(() => new THREE.MeshBasicMaterial({
      color: new THREE.Color(look.atmo).multiplyScalar(2.2),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    })),
  }), [look]);

  useFrame(({ camera }, dt) => {
    const p = worldPos[world.id]!;
    group.current.position.copy(p);
    body.current.rotation.y += world.spin * Math.min(dt, 0.1) * clock.scale;
    u.uTime.value = clock.t;
    if (ring) ring.u.uCenter.value.copy(p);
    if (moon.current) {
      const a = clock.t * 0.35;
      moon.current.position.set(Math.cos(a) * world.size * 2.4, Math.sin(a * 0.7) * 0.8, Math.sin(a) * world.size * 2.4);
    }
    if (beacon.current) {
      beacon.current.quaternion.copy(camera.quaternion);
      beacon.current.children.forEach((c, i) => {
        const t = ((clock.t * 0.55 + i * 0.5) % 1 + 1) % 1;
        c.scale.setScalar(world.size * (1.15 + t * 3.2));
        (pulse.mats[i] as THREE.MeshBasicMaterial).opacity = Math.pow(1 - t, 2) * 0.9;
      });
    }
  });

  const select = selectOnClick(world.id);

  return (
    <group ref={group}>
      <group rotation={[0, 0, world.tilt]}>
        <mesh ref={body} geometry={sphere} scale={world.size} onClick={select} {...pointer}>
          <shaderMaterial vertexShader={surfaceVertex} fragmentShader={planetFragment} uniforms={u} />
        </mesh>
        <mesh geometry={sphere} scale={world.size * 1.12}>
          <shaderMaterial
            vertexShader={surfaceVertex} fragmentShader={atmosphereFragment} uniforms={atmo}
            transparent blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </mesh>
        {ring && (
          <mesh geometry={ring.geo} rotation={[-Math.PI / 2, 0, 0]}>
            <shaderMaterial
              vertexShader={ringVertex} fragmentShader={ringFragment} uniforms={ring.u}
              transparent depthWrite={false} side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
      {look.moon && (
        <mesh ref={moon} geometry={lowSphere} scale={world.size * 0.27}>
          <meshStandardMaterial color={colors.moon} roughness={1} metalness={0} />
        </mesh>
      )}
      {look.beacon && (
        <group ref={beacon}>
          {pulse.mats.map((m, i) => <mesh key={i} geometry={pulse.geo} material={m} />)}
        </group>
      )}
    </group>
  );
}

export function Star({ world }: { world: World }) {
  const corona = useRef<THREE.Mesh>(null!);
  const coronaSize = world.size * 8.5;
  const su = useMemo(() => ({
    uTime: { value: 0 },
    uCore: { value: new THREE.Color(colors.starCore) },
    uHot: { value: new THREE.Color(colors.starHot) },
  }), []);
  const cu = useMemo(() => ({
    uTime: { value: 0 },
    uCore: { value: world.size / coronaSize },
    uColor: { value: new THREE.Color(colors.corona) },
    uWhite: { value: new THREE.Color(colors.starCore) },
  }), [world.size, coronaSize]);

  useFrame(({ camera }) => {
    su.uTime.value = clock.t;
    cu.uTime.value = clock.t;
    corona.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group>
      <mesh geometry={sphere} scale={world.size} onClick={selectOnClick(world.id)} {...pointer}>
        <shaderMaterial vertexShader={surfaceVertex} fragmentShader={starFragment} uniforms={su} />
      </mesh>
      <mesh ref={corona}>
        <planeGeometry args={[coronaSize * 2, coronaSize * 2]} />
        <shaderMaterial
          vertexShader={coronaVertex} fragmentShader={coronaFragment} uniforms={cu}
          transparent blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>
      <pointLight intensity={2.4} decay={0} color={colors.starCore} />
    </group>
  );
}

export function Comet({ world }: { world: World }) {
  const head = useRef<THREE.Group>(null!);
  const count = 900;
  const { geo, u } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const t = new Float32Array(count);
    const s = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      t[i] = Math.random();
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.8);
      s[i * 2] = Math.cos(a) * r;
      s[i * 2 + 1] = Math.sin(a) * r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aT", new THREE.BufferAttribute(t, 1));
    g.setAttribute("aSpread", new THREE.BufferAttribute(s, 2));
    return {
      geo: g,
      u: {
        uHead: { value: new THREE.Vector3() }, uDir: { value: new THREE.Vector3(1, 0, 0) },
        uU: { value: new THREE.Vector3() }, uV: { value: new THREE.Vector3() },
        uLen: { value: 30 }, uTime: { value: 0 },
        uPR: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color(colors.comet) },
      },
    };
  }, []);

  useFrame(() => {
    const p = worldPos[world.id]!;
    head.current.position.copy(p);
    const dir = u.uDir.value.copy(p).normalize();
    const up = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    u.uU.value.crossVectors(dir, up).normalize();
    u.uV.value.crossVectors(dir, u.uU.value).normalize();
    u.uHead.value.copy(p);
    // The tail always streams away from the star, and grows as the comet falls inward.
    u.uLen.value = THREE.MathUtils.clamp(2400 / Math.max(p.length(), 20), 12, 70);
    u.uTime.value = clock.t;
  });

  return (
    <group>
      <group ref={head} onClick={selectOnClick(world.id)} {...pointer}>
        <mesh geometry={lowSphere} scale={world.size}>
          <meshBasicMaterial color={new THREE.Color(colors.comet).multiplyScalar(3)} />
        </mesh>
        <mesh geometry={lowSphere} scale={world.size * 2.6}>
          <meshBasicMaterial color={colors.comet} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={cometTailVertex} fragmentShader={cometTailFragment} uniforms={u}
          transparent blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </points>
    </group>
  );
}

export function Relay({ world }: { world: World }) {
  const group = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const lamp = useRef<THREE.MeshBasicMaterial>(null!);
  const glow = useMemo(() => new THREE.Color(colors.relayGlow), []);

  useFrame(({ camera }) => {
    group.current.position.copy(worldPos[world.id]!);
    ring.current.rotation.z = clock.t * 0.35;
    const blink = Math.pow(0.5 + 0.5 * Math.sin(clock.t * 3.2), 8);
    lamp.current.color.copy(glow).multiplyScalar(0.6 + blink * 6);
    group.current.lookAt(camera.position.x, group.current.position.y, camera.position.z);
  });

  return (
    <group ref={group} onClick={selectOnClick(world.id)} {...pointer}>
      <group rotation={[0.25, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 3.2, 24]} />
          <meshStandardMaterial color={colors.hull} metalness={0.8} roughness={0.6} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.6, 0.18, 16, 96]} />
          <meshStandardMaterial color={colors.hullTrim} metalness={0.9} roughness={0.6} emissive={colors.relayGlow} emissiveIntensity={0.35} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 3.6, 0, 0]}>
            <boxGeometry args={[3.2, 0.06, 1.3]} />
            <meshStandardMaterial color={colors.solarPanel} metalness={0.6} roughness={0.6} emissive={colors.solarPanel} emissiveIntensity={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 2.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshStandardMaterial color={colors.hullTrim} />
        </mesh>
        <mesh position={[0, 3.15, 0]} scale={0.22} geometry={lowSphere}>
          <meshBasicMaterial ref={lamp} />
        </mesh>
      </group>
    </group>
  );
}

/** A lumpy belt of rocks between the outer worlds and the relay, all one instanced draw. */
export function Belt({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 1);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const s = 0.72 + Math.random() * 0.5;
      pos.setXYZ(i, pos.getX(i) * s, pos.getY(i) * s * 0.8, pos.getZ(i) * s);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const ready = useRef(false);
  useFrame((_, dt) => {
    if (!ready.current) {
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const e = new THREE.Euler();
      const v = new THREE.Vector3();
      const sc = new THREE.Vector3();
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 110 + (Math.random() + Math.random() - 1) * 9;
        v.set(Math.cos(a) * r, (Math.random() - 0.5) * 5, Math.sin(a) * r);
        e.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        const s = 0.18 + Math.pow(Math.random(), 3) * 1.6;
        sc.set(s, s * (0.6 + Math.random() * 0.5), s);
        m.compose(v, q.setFromEuler(e), sc);
        mesh.current.setMatrixAt(i, m);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
      ready.current = true;
    }
    group.current.rotation.y += 0.0035 * Math.min(dt, 0.1) * clock.scale;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
        <meshStandardMaterial color={colors.rock} roughness={0.95} metalness={0.05} flatShading />
      </instancedMesh>
    </group>
  );
}

/** Faint orbit lines, so the system reads as a map and not a scatter of lights. */
export function OrbitLines() {
  const lines = useMemo(() => worlds
    .filter((w) => w.orbit.radius > 0 && w.kind !== "relay")
    .map((w) => {
      const pts: THREE.Vector3[] = [];
      const v = new THREE.Vector3();
      const steps = 256;
      for (let i = 0; i <= steps; i++) {
        if (w.kind === "comet") {
          const period = (Math.PI * 2) / w.orbit.speed;
          orbitPosition(w, (i / steps) * period, v);
        } else {
          const t = ((i / steps) * Math.PI * 2 - w.orbit.phase) / w.orbit.speed;
          orbitPosition(w, t, v);
        }
        pts.push(v.clone());
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: w.kind === "comet" ? colors.comet : colors.orbit,
        transparent: true, opacity: w.kind === "comet" ? 0.07 : 0.14,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      return { key: w.id, line: new THREE.Line(geo, mat) };
    }), []);

  return <>{lines.map((l) => <primitive key={l.key} object={l.line} />)}</>;
}
