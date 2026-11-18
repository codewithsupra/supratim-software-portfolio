import * as THREE from "three";

/**
 * A CRT face: slight barrel bulge, rolling scanlines, a faint flicker and a vignette.
 * Output is pushed above 1.0 so the bloom pass gives each set a glow. `uFit` crops a
 * wide screenshot to the 4:3 tube instead of squashing it.
 */
export function makeScreenMaterial(map: THREE.Texture, fit: THREE.Vector2): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uFit: { value: fit },
      uTime: { value: 0 },
      uPower: { value: 0 },
      uHover: { value: 0 },
      uSeed: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec2 uFit;
      uniform float uTime;
      uniform float uPower;
      uniform float uHover;
      uniform float uSeed;
      varying vec2 vUv;

      vec2 bulge(vec2 uv) {
        uv = uv * 2.0 - 1.0;
        uv *= 1.0 + 0.07 * dot(uv, uv);
        return uv * 0.5 + 0.5;
      }

      void main() {
        vec2 uv = bulge(vUv);
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
        }
        vec2 st = (uv - 0.5) * uFit + 0.5;
        vec3 c = texture2D(uMap, st).rgb;
        float scan = 0.84 + 0.16 * sin(uv.y * 520.0 - uTime * 5.0);
        float roll = 0.92 + 0.08 * smoothstep(0.0, 0.08, abs(fract(uv.y * 0.7 - uTime * 0.11 + uSeed) - 0.5));
        float flick = 0.97 + 0.03 * sin(uTime * 41.0 + uSeed * 7.0);
        float vig = smoothstep(1.05, 0.35, length(vUv - 0.5) * 1.55);
        c *= scan * roll * flick * vig;
        c = mix(c, c * vec3(0.86, 1.0, 1.12), 0.3);
        c *= (1.25 + uHover * 0.7) * uPower;
        gl_FragColor = vec4(c, 1.0);
      }
    `,
    toneMapped: false,
  });
}
