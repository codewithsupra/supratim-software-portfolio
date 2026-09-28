/**
 * GLSL for the scene. Every surface is procedural — there are no texture files — so each
 * world is a few hundred bytes of maths rather than megabytes of images, and nothing tiles
 * or pixelates when the camera flies right up to it.
 */

// Ashima Arts 3D simplex noise (MIT), then fractal sums of it.
export const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=0.5,f=0.0;for(int i=0;i<5;i++){f+=a*snoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return f;}
float fbm3(vec3 p){float a=0.5,f=0.0;for(int i=0;i<3;i++){f+=a*snoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return f;}
`;

export const surfaceVertex = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vObj = position;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const planetFragment = /* glsl */ `
uniform float uTime;
uniform float uSeed;
uniform int uType;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec3 uAtmo;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
${noise}
void main(){
  vec3 n = normalize(vObj);
  vec3 N = normalize(vNormalW);
  vec3 L = normalize(-vPosW);            // the star sits at the origin
  vec3 V = normalize(cameraPosition - vPosW);
  float ndl = dot(N, L);
  float day = smoothstep(-0.14, 0.4, ndl);
  vec3 sp = n * 1.0 + vec3(uSeed);
  vec3 col;
  vec3 emit = vec3(0.0);
  float spec = 0.0;

  if (uType == 0) {
    float warp = fbm(sp * vec3(1.4, 3.6, 1.4) + vec3(0.0, uTime * 0.012, 0.0));
    float band = n.y * 5.5 + warp * 1.9;
    float b = 0.5 + 0.5 * sin(band * 3.1);
    float b2 = 0.5 + 0.5 * sin(band * 7.7 + warp * 4.0);
    col = mix(uA, uB, b);
    col = mix(col, uC, b2 * 0.32);
    vec3 spot = normalize(vec3(0.62, -0.28, 0.73));
    float storm = smoothstep(0.34, 0.0, length((n - spot) * vec3(1.0, 1.7, 1.0)));
    float swirl = fbm3(n * 9.0 + uTime * 0.05);
    col = mix(col, uC * 1.15, storm * (0.65 + 0.35 * swirl));
  } else if (uType == 1) {
    float h = fbm(sp * 2.2) * 0.5 + 0.5;
    float sea = 0.53;
    float isLand = smoothstep(sea, sea + 0.012, h);
    vec3 ocean = mix(uA * 0.55, uA * 1.2, smoothstep(0.25, sea, h));
    vec3 land = mix(uB, uC, smoothstep(sea, 0.8, h));
    col = mix(ocean, land, isLand);
    col = mix(col, vec3(0.93, 0.96, 1.0), smoothstep(0.8, 0.92, abs(n.y) + (h - 0.5) * 0.25));
    spec = 1.0 - isLand;
    float cl = smoothstep(0.06, 0.6, fbm(sp * 3.4 + vec3(uTime * 0.008, 0.0, uTime * 0.005)));
    col = mix(col, vec3(1.0), cl * 0.85);
    spec *= 1.0 - cl;
    float city = smoothstep(0.66, 0.72, fbm3(sp * 16.0) * 0.5 + 0.5) * isLand * (1.0 - cl);
    emit += vec3(1.0, 0.72, 0.42) * city * 1.6 * (1.0 - day);
  } else if (uType == 2) {
    float r = pow(1.0 - abs(fbm(sp * 2.6)), 16.0);
    float r2 = pow(1.0 - abs(fbm3(sp * 7.0 + 3.0)), 22.0);
    float crack = max(r, r2 * 0.6);
    float flow = 0.5 + 0.5 * sin(uTime * 1.2 + fbm3(sp * 2.0) * 7.0);
    col = mix(uA, vec3(0.16, 0.1, 0.12), fbm3(sp * 5.0) * 0.5 + 0.5);
    emit += mix(uB, uC, r) * crack * (1.1 + flow * 0.9);
    emit += uB * 0.06 * (1.0 - day);
  } else if (uType == 3) {
    float f = fbm(sp * 2.4) * 0.5 + 0.5;
    col = mix(uB, uA, f);
    float cr = pow(1.0 - abs(fbm(sp * 6.0)), 12.0);
    col = mix(col, uC, cr * 0.75);
    spec = 0.55;
    emit += uB * cr * 0.5 * (1.0 - day);
  } else {
    float sw = fbm(sp * 2.0 + vec3(0.0, uTime * 0.01, 0.0));
    float sw2 = fbm(sp * 5.0 + sw * 1.6);
    col = mix(uA, uB, smoothstep(-0.35, 0.65, sw2));
    spec = 1.0;
    float glow = pow(0.5 + 0.5 * sin(sw2 * 15.0 + uTime * 0.55), 7.0);
    emit += uC * glow * (1.0 - day * 0.85) * 1.5;
  }

  vec3 lit = col * (0.025 + day * 1.2);
  vec3 H = normalize(L + V);
  lit += vec3(1.0) * pow(max(dot(N, H), 0.0), 70.0) * spec * day * 0.9;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  lit += uAtmo * fres * (0.12 + day * 1.1);
  gl_FragColor = vec4(lit + emit, 1.0);
}
`;

export const atmosphereFragment = /* glsl */ `
uniform vec3 uAtmo;
uniform float uIntensity;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 L = normalize(-vPosW);
  float x = 1.0 - abs(dot(N, V));
  float rim = smoothstep(0.05, 0.56, x) * pow(1.0 - smoothstep(0.56, 1.0, x), 1.6);
  float lightFac = smoothstep(-0.45, 0.7, dot(N, L));
  float a = rim * (0.12 + 0.88 * lightFac) * uIntensity;
  gl_FragColor = vec4(uAtmo * a, a);
}
`;

export const ringVertex = /* glsl */ `
uniform float uInner;
uniform float uOuter;
varying float vR;
varying vec3 vPosW;
void main(){
  vR = (length(position.xy) - uInner) / (uOuter - uInner);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const ringFragment = /* glsl */ `
uniform vec3 uTint;
uniform float uSeed;
uniform vec3 uCenter;
uniform float uPlanetR;
varying float vR;
varying vec3 vPosW;
${noise}
void main(){
  float r = vR;
  float n = fbm3(vec3(r * 22.0, uSeed, 0.0)) * 0.5 + 0.5;
  float fine = 0.5 + 0.5 * sin(r * 240.0 + n * 6.0);
  float dens = smoothstep(0.0, 0.06, r) * smoothstep(1.0, 0.86, r);
  dens *= 0.25 + 0.75 * n;
  dens *= 0.75 + 0.25 * fine;
  dens *= 1.0 - (1.0 - smoothstep(0.0, 0.035, abs(r - 0.63))) * 0.92;
  // The planet's shadow falls across the rings on the side facing away from the star.
  vec3 toSun = normalize(-uCenter);
  vec3 rel = vPosW - uCenter;
  float along = dot(rel, toSun);
  float perp = length(rel - toSun * along);
  float shadow = along < 0.0 ? smoothstep(uPlanetR * 0.92, uPlanetR * 1.08, perp) : 1.0;
  vec3 col = uTint * (0.25 + 0.95 * shadow);
  gl_FragColor = vec4(col * dens, dens * 0.9);
}
`;

export const starFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uCore;
uniform vec3 uHot;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
${noise}
void main(){
  vec3 n = normalize(vObj);
  float t = uTime * 0.05;
  float f = fbm(n * 2.8 + vec3(t, t * 0.7, -t));
  float g = fbm3(n * 9.0 + f * 2.2 + vec3(t * 2.0));
  float cells = 1.0 - abs(snoise(n * 18.0 + t * 3.0));
  float heat = clamp(0.5 + 0.35 * f + 0.25 * g + 0.12 * cells, 0.0, 1.0);
  vec3 col = mix(uHot * 1.3, uCore * 2.6, pow(heat, 1.4));
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  float limb = pow(1.0 - max(dot(N, V), 0.0), 2.2);
  col += uHot * limb * 1.8;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const coronaVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const coronaFragment = /* glsl */ `
uniform float uTime;
uniform float uCore;
uniform vec3 uColor;
uniform vec3 uWhite;
varying vec2 vUv;
${noise}
void main(){
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float ang = atan(p.y, p.x);
  vec3 q = vec3(cos(ang) * 2.2, sin(ang) * 2.2, r * 2.5 - uTime * 0.07);
  float rays = pow(fbm3(q + vec3(0.0, 0.0, uTime * 0.02)) * 0.5 + 0.5, 3.0);
  float d = max(r - uCore, 0.0);
  float glow = exp(-d * 7.0) * 1.1 + exp(-d * 2.4) * 0.35 + exp(-r * 1.2) * 0.08;
  float streak = (0.25 + rays * 1.8) * exp(-d * 3.2);
  float a = (glow * 0.38 + streak * 0.26) * smoothstep(1.0, 0.45, r);
  vec3 col = mix(uColor, uWhite, exp(-d * 9.0));
  gl_FragColor = vec4(col * a, a);
}
`;

export const nebulaFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uIndigo;
uniform vec3 uViolet;
uniform vec3 uMagenta;
varying vec3 vObj;
${noise}
void main(){
  vec3 d = normalize(vObj);
  float n1 = fbm(d * 1.5 + vec3(0.0, 0.0, uTime * 0.002));
  float n2 = fbm(d * 3.1 + n1 * 1.4 + 7.0);
  float n3 = fbm(d * 6.4 + n2 * 1.1 + 3.0);
  vec3 bandN = normalize(vec3(0.28, 1.0, -0.4));
  float band = exp(-pow(dot(d, bandN) * 3.0, 2.0));
  vec3 col = vec3(0.0015, 0.001, 0.005);
  col += uIndigo * smoothstep(-0.25, 0.85, n1) * 0.9;
  col += uViolet * smoothstep(0.0, 0.9, n2) * 0.55 * (0.35 + band);
  col += uMagenta * pow(smoothstep(0.15, 1.0, n2 * 0.6 + n3 * 0.55), 2.0) * 0.9 * (0.25 + band);
  col += vec3(0.08, 0.28, 0.34) * pow(max(n3, 0.0), 3.0) * 0.7 * band;
  float dust = smoothstep(0.05, 0.6, fbm(d * 4.2 + 11.0));
  col *= 1.0 - dust * 0.6 * band;
  col += vec3(0.55, 0.5, 0.75) * band * 0.035 * (n3 * 0.5 + 0.5);
  gl_FragColor = vec4(col * 0.7, 1.0);
}
`;

export const skyVertex = /* glsl */ `
varying vec3 vObj;
void main(){
  vObj = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const starsVertex = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
attribute float aPhase;
uniform float uTime;
uniform float uPR;
varying vec3 vColor;
varying float vTw;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.72 + 0.28 * sin(uTime * (0.5 + aPhase * 1.9) + aPhase * 40.0);
  vTw = tw;
  vColor = aColor;
  gl_PointSize = aSize * uPR * (0.85 + 0.15 * tw);
}
`;

export const starsFragment = /* glsl */ `
varying vec3 vColor;
varying float vTw;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.7);
  gl_FragColor = vec4(vColor * a * vTw * 1.6, a);
}
`;

/** Local dust that wraps around the camera: parallax at cruise, light streaks at warp. */
export const dustVertex = /* glsl */ `
attribute float aSeed;
attribute float aEnd;
uniform vec3 uCam;
uniform vec3 uVel;
uniform float uBox;
uniform float uStretch;
uniform float uPR;
uniform float uPoint;
varying float vA;
varying float vEnd;
void main(){
  vec3 rel = mod(position - uCam + uBox * 0.5, uBox) - uBox * 0.5;
  vec3 w = uCam + rel - uVel * uStretch * aEnd;
  vec4 mv = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mv;
  vA = smoothstep(uBox * 0.5, uBox * 0.18, length(rel)) * (0.4 + 0.6 * aSeed);
  vEnd = aEnd;
  gl_PointSize = uPoint * (1.0 + aSeed * 1.6) * uPR * (40.0 / max(-mv.z, 1.0));
}
`;

export const dustFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uIsPoint;
varying float vA;
varying float vEnd;
void main(){
  float shape = 1.0;
  if (uIsPoint > 0.5) shape = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  float a = vA * shape * uIntensity * (1.0 - vEnd);
  gl_FragColor = vec4(uColor * a, a);
}
`;

export const flameVertex = /* glsl */ `
attribute float aLife;
attribute float aSize;
uniform float uPR;
varying float vLife;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * aLife * uPR * (95.0 / max(-mv.z, 0.5));
}
`;

export const flameFragment = /* glsl */ `
uniform vec3 uHot;
uniform vec3 uCool;
varying float vLife;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uCool, uHot, smoothstep(0.6, 1.0, vLife)) * (0.35 + vLife * 1.3);
  gl_FragColor = vec4(col * a * vLife, a * vLife);
}
`;

export const cometTailVertex = /* glsl */ `
attribute float aT;
attribute vec2 aSpread;
uniform vec3 uHead;
uniform vec3 uDir;
uniform vec3 uU;
uniform vec3 uV;
uniform float uLen;
uniform float uTime;
uniform float uPR;
varying float vT;
void main(){
  float t = fract(aT + uTime * 0.05);
  vec3 p = uHead + uDir * t * uLen + (uU * aSpread.x + uV * aSpread.y) * (0.3 + t * 4.5);
  vT = t;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.0 - t * 0.6) * 2.4 * uPR * (60.0 / max(-mv.z, 1.0));
}
`;

export const cometTailFragment = /* glsl */ `
uniform vec3 uColor;
varying float vT;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * pow(1.0 - vT, 1.6);
  gl_FragColor = vec4(uColor * a * 1.4, a);
}
`;

/** The last pass: vignette, a breath of film grain, and chromatic aberration at warp. */
export const finalPass = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uBoost: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uBoost;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 off = c * r2 * (0.004 + uBoost * 0.05);
      vec3 col;
      col.r = texture2D(tDiffuse, vUv - off).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv + off).b;
      col *= 1.0 - smoothstep(0.18, 0.75, r2 * (1.0 + uBoost * 0.6)) * 0.72;
      col += (hash(vUv * 900.0 + uTime) - 0.5) * 0.018;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
