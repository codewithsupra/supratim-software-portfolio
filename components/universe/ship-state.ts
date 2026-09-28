import * as THREE from "three";

/** The ship's physical state, shared by the flight model, the camera and the effects. */
export const shipState = {
  position: new THREE.Vector3(34, 44, 188),
  velocity: new THREE.Vector3(),
  // Angled down onto the system with the star off to the right, so the opening shot reads
  // as a map of orbits rather than a line of planets behind a glare.
  yaw: 0.52,
  pitch: -0.2,
  roll: 0,
  docked: null as string | null,
  dockLast: new THREE.Vector3(),
  intro: 0,
};
