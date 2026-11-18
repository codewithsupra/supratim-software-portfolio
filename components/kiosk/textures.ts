import * as THREE from "three";

/** The display face next/font registered for Clash Display, so canvas text matches the UI. */
function displayFamily(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-clash-display").trim();
  return v || "system-ui, sans-serif";
}

export function font(weight: number, px: number): string {
  return `${weight} ${px}px ${displayFamily()}`;
}

export const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';

/**
 * A canvas texture drawn now and drawn again once the display font has loaded, so signs
 * never stay stuck in the fallback face.
 */
export function drawnTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const paint = () => {
    ctx.clearRect(0, 0, w, h);
    draw(ctx, w, h);
    tex.needsUpdate = true;
  };
  paint();
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.load(font(600, 64)).then(paint, () => undefined);
  }
  return tex;
}

/** Glowing tube lettering: a soft halo pass, then a bright core. */
export function neon(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  f: string,
  color: string,
  blur: number,
): void {
  ctx.font = f;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = color;
  for (const b of [blur * 2, blur, blur * 0.4]) {
    ctx.shadowBlur = b;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(text, x, y);
}

/** Radial alpha: see-through near the kiosk (the wet reflection), opaque towards the edges. */
export function floorAlpha(): THREE.CanvasTexture {
  return drawnTexture(512, 512, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgb(196,196,196)");
    g.addColorStop(0.18, "rgb(210,210,210)");
    g.addColorStop(0.45, "rgb(255,255,255)");
    g.addColorStop(1, "rgb(255,255,255)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}
