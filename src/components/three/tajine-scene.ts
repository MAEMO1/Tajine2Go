"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/**
 * Cinematic tajine hero — no external assets. The realism comes from four
 * layers working together:
 *   1. image-based lighting + ACES + physically-based clay/glaze materials
 *      with canvas-painted Moroccan decoration;
 *   2. grounding: a walnut turntable with real PCF-soft shadows instead of
 *      a pot floating in a void;
 *   3. film post-processing: bloom on steam/glaze, vignette, animated grain;
 *   4. a payoff: lifting the lid (scroll-scrubbed) reveals steaming couscous
 *      with apricots, prunes and almonds, and steam pours from the gap.
 *
 * Public API consumed by the React wrapper:
 *  - resize(w, h)        fit the drawing buffer
 *  - start() / stop()    run or pause the rAF loop
 *  - setMouse(x, y)      pointer parallax, both in [-1, 1]
 *  - setProgress(p)      scroll progress 0..1 → lid lifts, steam swells
 *  - renderStatic()      single styled frame for reduced-motion users
 *  - dispose()           free all GL resources
 */

const STEAM_COUNT = 130;
const GAP_STEAM_COUNT = 90;
const DUST_COUNT = 50;

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const STEAM_VERTEX = /* glsl */ `
  attribute vec3 aSeed; // x: phase, y: speed, z: radius
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform float uIntensity;
  uniform float uBaseY;
  uniform float uSpread;
  uniform float uRise;
  varying float vAlpha;
  varying float vRotation;

  void main() {
    float cycle = fract(aSeed.x + uTime * aSeed.y);
    float angle = aSeed.x * 6.28318;
    float rise = cycle * cycle * 0.35 + cycle * 0.65;
    float sway = sin(uTime * 0.55 + aSeed.x * 37.0) * (0.04 + rise * 0.5)
               + sin(uTime * 1.7 + aSeed.x * 91.0) * 0.045 * rise;
    vec3 pos = vec3(
      cos(angle) * (aSeed.z * uSpread) * (1.0 + rise * 0.6) + sway,
      uBaseY + rise * uRise,
      sin(angle) * (aSeed.z * uSpread) * 0.6
    );
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float size = 44.0 + rise * 170.0;
    gl_PointSize = size * uPixelRatio * uScale * (3.4 / -mvPosition.z);
    float fadeIn = smoothstep(0.0, 0.3, cycle);
    float fadeOut = 1.0 - smoothstep(0.5, 1.0, cycle);
    vAlpha = fadeIn * fadeOut * uIntensity;
    vRotation = aSeed.x * 6.28318 + uTime * (aSeed.y * 2.0 - 0.2);
  }
`;

const STEAM_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  varying float vAlpha;
  varying float vRotation;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float c = cos(vRotation);
    float s = sin(vRotation);
    vec2 uv = vec2(c * centered.x - s * centered.y, s * centered.x + c * centered.y) + vec2(0.5);
    float a = texture2D(uMap, uv).a * vAlpha * 0.36;
    gl_FragColor = vec4(0.98, 0.94, 0.88, a);
  }
`;

const DUST_VERTEX = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScale;
  varying float vAlpha;

  void main() {
    float t = uTime * aSeed.y * 0.3;
    float angle = aSeed.x * 6.28318 + t;
    float radius = 1.8 + aSeed.z * 1.9;
    vec3 pos = vec3(
      cos(angle) * radius,
      0.4 + fract(aSeed.x * 7.31 + t * 0.18) * 2.7,
      sin(angle) * radius * 0.7
    );
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (3.0 + aSeed.z * 5.0) * uPixelRatio * uScale * (3.4 / -mvPosition.z);
    vAlpha = (0.08 + 0.35 * sin(fract(aSeed.x * 7.31 + t * 0.18) * 3.14159));
  }
`;

const DUST_FRAGMENT = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(0.93, 0.67, 0.16, a);
  }
`;

/** Final grade: vignette + animated film grain. */
const FILM_SHADER = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      // Vignette
      float d = distance(vUv, vec2(0.5));
      color.rgb *= smoothstep(0.95, 0.35, d) * 0.25 + 0.78;
      // Animated grain
      float grain = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 43.0) - 0.5;
      color.rgb += grain * 0.025;
      gl_FragColor = color;
    }
  `,
};

/* ------------------------------------------------------------------ */
/* Canvas texture helpers                                              */
/* ------------------------------------------------------------------ */

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  return [canvas, ctx];
}

function mottle(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: string[],
  count: number,
  maxRadius: number,
) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = (0.25 + Math.random() * 0.75) * maxRadius;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    const color = colors[Math.floor(Math.random() * colors.length)];
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
}

function throwingRidges(
  ctx: CanvasRenderingContext2D,
  size: number,
  count: number,
  alpha: number,
) {
  for (let i = 0; i < count; i++) {
    const y = Math.random() * size;
    ctx.fillStyle = `rgba(60, 28, 8, ${alpha * (0.4 + Math.random() * 0.6)})`;
    ctx.fillRect(0, y, size, 1 + Math.random() * 1.5);
    ctx.fillStyle = `rgba(255, 230, 200, ${alpha * 0.5 * Math.random()})`;
    ctx.fillRect(0, y + 2, size, 1);
  }
}

/**
 * Lid albedo — glazed terracotta with a painted Moroccan band. flipY is
 * disabled so canvas-top = lathe v=0 = the rim. LID_POINTS puts the cone in
 * v 0..0.5 and the chimney knob in v 0.5..1; bands are calibrated to that.
 */
function makeLidAlbedo(): THREE.CanvasTexture {
  const size = 1024;
  const [canvas, ctx] = makeCanvas(size);

  const base = ctx.createLinearGradient(0, 0, 0, size);
  base.addColorStop(0, "#a8531a");
  base.addColorStop(0.45, "#b05c1e");
  base.addColorStop(1, "#9a4d16");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  mottle(ctx, size, ["rgba(140, 62, 16, 0.16)", "rgba(220, 140, 60, 0.13)", "rgba(90, 40, 10, 0.10)"], 260, 90);

  // Cream rim band with brown zigzag (v 0.04–0.12).
  const rimTop = 0.04 * size;
  const rimBottom = 0.12 * size;
  ctx.fillStyle = "#f3e4c8";
  ctx.fillRect(0, rimTop, size, rimBottom - rimTop);
  ctx.fillStyle = "#5C3214";
  const zigzagCount = 36;
  const zigzagWidth = size / zigzagCount;
  for (let i = 0; i < zigzagCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * zigzagWidth, rimBottom - 4);
    ctx.lineTo(i * zigzagWidth + zigzagWidth / 2, rimTop + 4);
    ctx.lineTo((i + 1) * zigzagWidth, rimBottom - 4);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#d9a435";
  ctx.fillRect(0, rimTop - 6, size, 5);
  ctx.fillRect(0, rimBottom + 2, size, 5);

  // Radiating spokes (v 0.16–0.40).
  const stripeBandTop = 0.16 * size;
  const stripeBandBottom = 0.4 * size;
  const spokes = 24;
  const spokeWidth = size / spokes;
  for (let i = 0; i < spokes; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(243, 228, 200, 0.95)";
      ctx.fillRect(i * spokeWidth + spokeWidth * 0.2, stripeBandTop, spokeWidth * 0.6, stripeBandBottom - stripeBandTop);
      ctx.fillStyle = "#5C3214";
      ctx.fillRect(i * spokeWidth + spokeWidth * 0.46, stripeBandTop + 10, spokeWidth * 0.08, stripeBandBottom - stripeBandTop - 20);
    }
  }
  ctx.fillStyle = "#d9a435";
  ctx.fillRect(0, stripeBandTop - 5, size, 4);
  ctx.fillRect(0, stripeBandBottom + 3, size, 4);

  // Dot row (v ≈ 0.44).
  ctx.fillStyle = "#f3e4c8";
  const dots = 48;
  for (let i = 0; i < dots; i++) {
    ctx.beginPath();
    ctx.arc((i + 0.5) * (size / dots), 0.44 * size, size * 0.009, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chimney knob (v 0.5–1): deeper glaze, gold collar, cream ticks.
  const knobGradient = ctx.createLinearGradient(0, 0.5 * size, 0, size);
  knobGradient.addColorStop(0, "rgba(0,0,0,0)");
  knobGradient.addColorStop(0.4, "rgba(96, 42, 10, 0.3)");
  knobGradient.addColorStop(1, "rgba(70, 30, 8, 0.45)");
  ctx.fillStyle = knobGradient;
  ctx.fillRect(0, 0.5 * size, size, size * 0.5);
  ctx.fillStyle = "#d9a435";
  ctx.fillRect(0, 0.52 * size, size, 5);
  ctx.fillStyle = "#f3e4c8";
  const ticks = 40;
  for (let i = 0; i < ticks; i++) {
    ctx.fillRect((i + 0.35) * (size / ticks), 0.62 * size, size * 0.006, 0.08 * size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.flipY = false;
  return texture;
}

function makeLidRoughness(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size);
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(0, 0, size, size);
  mottle(ctx, size, ["rgba(120,120,120,0.35)", "rgba(40,40,40,0.3)"], 160, 70);
  ctx.fillStyle = "rgba(130,130,130,0.55)";
  ctx.fillRect(0, 0.04 * size, size, 0.08 * size);
  ctx.fillRect(0, 0.16 * size, size, 0.24 * size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.flipY = false;
  return texture;
}

function makeBaseAlbedo(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size);
  const base = ctx.createLinearGradient(0, 0, 0, size);
  base.addColorStop(0, "#b36530");
  base.addColorStop(0.6, "#a85c28");
  base.addColorStop(1, "#8f4c1e");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  mottle(ctx, size, ["rgba(140, 70, 30, 0.22)", "rgba(215, 150, 95, 0.16)", "rgba(80, 38, 12, 0.12)"], 220, 60);
  throwingRidges(ctx, size, 26, 0.08);
  const foot = ctx.createLinearGradient(0, size * 0.55, 0, size);
  foot.addColorStop(0, "rgba(0,0,0,0)");
  foot.addColorStop(1, "rgba(40, 18, 6, 0.45)");
  ctx.fillStyle = foot;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function makeBump(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * 26;
    image.data[i] = n;
    image.data[i + 1] = n;
    image.data[i + 2] = n;
  }
  ctx.putImageData(image, 0, 0);
  throwingRidges(ctx, size, 32, 0.25);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/** Couscous: dense semolina speckle in saffron golds. */
function makeCouscousAlbedo(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size);
  ctx.fillStyle = "#d8a33c";
  ctx.fillRect(0, 0, size, size);
  const grainColors = ["#f2d28a", "#e3b657", "#c98f2e", "#b67d22", "#f7e3b0"];
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = grainColors[Math.floor(Math.random() * grainColors.length)];
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Walnut turntable top — warm dark wood streaks. */
function makeWoodAlbedo(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size);
  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, "#3a2313");
  base.addColorStop(0.5, "#462b17");
  base.addColorStop(1, "#33200f");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 90; i++) {
    const y = Math.random() * size;
    ctx.strokeStyle = Math.random() > 0.5
      ? `rgba(20, 10, 4, ${0.12 + Math.random() * 0.2})`
      : `rgba(120, 78, 40, ${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.5 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(size * 0.3, y + (Math.random() - 0.5) * 14, size * 0.7, y + (Math.random() - 0.5) * 14, size, y);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Scene backdrop: vertical ember gradient with a warm halo behind the pot. */
function makeBackdrop(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size);
  const vertical = ctx.createLinearGradient(0, 0, 0, size);
  vertical.addColorStop(0, "#1d1108");
  vertical.addColorStop(0.55, "#331e0d");
  vertical.addColorStop(1, "#4c2c11");
  ctx.fillStyle = vertical;
  ctx.fillRect(0, 0, size, size);
  const halo = ctx.createRadialGradient(size * 0.5, size * 0.52, 20, size * 0.5, size * 0.52, size * 0.55);
  halo.addColorStop(0, "rgba(217, 123, 26, 0.22)");
  halo.addColorStop(1, "rgba(217, 123, 26, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeSmokeSprite(): THREE.CanvasTexture {
  const size = 128;
  const [canvas, ctx] = makeCanvas(size);
  for (let i = 0; i < 11; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * size * 0.22;
    const x = size / 2 + Math.cos(angle) * distance;
    const y = size / 2 + Math.sin(angle) * distance;
    const radius = size * (0.12 + Math.random() * 0.18);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255,255,255,${0.10 + Math.random() * 0.12})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function makeShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(16, 8, 3, 0.5)");
  gradient.addColorStop(0.55, "rgba(16, 8, 3, 0.2)");
  gradient.addColorStop(1, "rgba(16, 8, 3, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const BASE_POINTS: Array<[number, number]> = [
  [0.0, 0.02],
  [0.55, 0.02],
  [1.0, 0.05],
  [1.25, 0.12],
  [1.4, 0.24],
  [1.47, 0.38],
  [1.5, 0.5],
  [1.56, 0.56],
  [1.58, 0.62],
  [1.5, 0.64],
  [1.42, 0.58],
];

const LID_POINTS: Array<[number, number]> = [
  [1.38, 0.62],
  [1.3, 0.74],
  [1.06, 1.06],
  [0.82, 1.38],
  [0.62, 1.66],
  [0.47, 1.9],
  [0.38, 2.06],
  [0.34, 2.16],
  [0.45, 2.24],
  [0.5, 2.32],
  [0.36, 2.4],
  [0.18, 2.44],
  [0.0, 2.45],
];

function lathe(points: Array<[number, number]>): THREE.LatheGeometry {
  const vectors = points.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(vectors, 96);
}

function handmadeWobble(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute("position");
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const angle = Math.atan2(z, x);
    const radius = Math.hypot(x, z);
    if (radius < 0.0001) continue;
    const wobble =
      1 +
      0.006 * Math.sin(angle * 3 + y * 2.1) +
      0.004 * Math.sin(angle * 7 + y * 5.3);
    position.setX(i, Math.cos(angle) * radius * wobble);
    position.setZ(i, Math.sin(angle) * radius * wobble);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function makeSeedAttribute(count: number, speedBase = 0.035, speedSpan = 0.055): THREE.BufferAttribute {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    data[i * 3] = Math.random();
    data[i * 3 + 1] = speedBase + Math.random() * speedSpan;
    data[i * 3 + 2] = Math.random();
  }
  return new THREE.BufferAttribute(data, 3);
}

function makeSteamPoints(
  count: number,
  sprite: THREE.Texture,
  options: { baseY: number; spread: number; rise: number; intensity: number },
): { points: THREE.Points; material: THREE.ShaderMaterial } {
  const material = new THREE.ShaderMaterial({
    vertexShader: STEAM_VERTEX,
    fragmentShader: STEAM_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uScale: { value: 1 },
      uIntensity: { value: options.intensity },
      uBaseY: { value: options.baseY },
      uSpread: { value: options.spread },
      uRise: { value: options.rise },
      uMap: { value: sprite },
    },
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aSeed", makeSeedAttribute(count));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, options.baseY + 1.5, 0), 7);
  return { points: new THREE.Points(geometry, material), material };
}

/* ------------------------------------------------------------------ */
/* Food                                                                */
/* ------------------------------------------------------------------ */

/** Couscous mound + apricots, prunes and almonds, hidden under the lid. */
function buildFood(couscousAlbedo: THREE.Texture): THREE.Group {
  const food = new THREE.Group();

  const moundGeometry = new THREE.SphereGeometry(1.0, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const position = moundGeometry.getAttribute("position");
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const bumps = 1 + 0.05 * Math.sin(x * 9) * Math.cos(z * 8) + 0.03 * Math.sin(z * 13 + x * 5);
    position.setXYZ(i, x * bumps, y * bumps, z * bumps);
  }
  moundGeometry.computeVertexNormals();
  const mound = new THREE.Mesh(
    moundGeometry,
    new THREE.MeshStandardMaterial({
      map: couscousAlbedo,
      bumpMap: couscousAlbedo,
      bumpScale: 0.06,
      roughness: 0.85,
      envMapIntensity: 0.5,
    }),
  );
  mound.scale.set(1.08, 0.62, 1.08);
  mound.position.y = 0.28;
  mound.castShadow = true;
  food.add(mound);

  // Garnish rings: apricot halves, prunes, almond slivers.
  const apricotMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe0762a,
    roughness: 0.35,
    clearcoat: 0.7,
    clearcoatRoughness: 0.3,
  });
  const pruneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x4a2415,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.45,
  });
  const almondMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2e0bc,
    roughness: 0.7,
  });

  const apricotGeometry = new THREE.SphereGeometry(0.16, 24, 16);
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + 0.35;
    const apricot = new THREE.Mesh(apricotGeometry, apricotMaterial);
    apricot.scale.set(1, 0.62, 1);
    apricot.position.set(Math.cos(angle) * 0.66, 0.72, Math.sin(angle) * 0.66);
    apricot.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
    apricot.castShadow = true;
    food.add(apricot);
  }

  const pruneGeometry = new THREE.SphereGeometry(0.11, 18, 14);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const prune = new THREE.Mesh(pruneGeometry, pruneMaterial);
    prune.scale.set(1, 0.8, 0.9);
    prune.position.set(Math.cos(angle) * 0.33, 0.86, Math.sin(angle) * 0.33);
    prune.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
    prune.castShadow = true;
    food.add(prune);
  }

  const almondGeometry = new THREE.CapsuleGeometry(0.02, 0.07, 4, 8);
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.85;
    const almond = new THREE.Mesh(almondGeometry, almondMaterial);
    const surfaceY = 0.28 + Math.sqrt(Math.max(0, 1 - (radius / 1.08) ** 2)) * 0.62;
    almond.position.set(Math.cos(angle) * radius, surfaceY + 0.01, Math.sin(angle) * radius);
    almond.rotation.set(Math.PI / 2 + (Math.random() - 0.5), Math.random() * Math.PI, (Math.random() - 0.5));
    food.add(almond);
  }

  return food;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export class TajineScene {
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private filmPass: ShaderPass;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private potGroup = new THREE.Group();
  private lid = new THREE.Group();
  private steamMaterial: THREE.ShaderMaterial;
  private gapSteamMaterial: THREE.ShaderMaterial;
  private dustMaterial: THREE.ShaderMaterial;
  private foodLight!: THREE.PointLight;
  private clock = new THREE.Clock();
  private rafId: number | null = null;
  private mouseTarget = { x: 0, y: 0 };
  private mouseCurrent = { x: 0, y: 0 };
  private progress = 0;
  private spin = 0;
  private disposed = false;
  private textures: THREE.Texture[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const backdrop = makeBackdrop();
    this.textures.push(backdrop);
    this.scene.background = backdrop;

    this.camera = new THREE.PerspectiveCamera(33, 1, 0.1, 50);
    this.camera.position.set(0, 1.75, 6.9);
    this.camera.lookAt(0, 1.0, 0);

    // Image-based lighting.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = environment;
    this.scene.environmentIntensity = 0.45;
    this.textures.push(environment);
    pmrem.dispose();

    // Warm grade + shadow-casting key.
    const key = new THREE.DirectionalLight(0xffd9a8, 1.15);
    key.position.set(3, 5.5, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3.5;
    key.shadow.camera.right = 3.5;
    key.shadow.camera.top = 4.5;
    key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.0008;
    key.shadow.radius = 6;
    this.scene.add(key);
    const rim = new THREE.PointLight(0xd97b1a, 26, 0, 2);
    rim.position.set(-3.6, 2.8, -3);
    this.scene.add(rim);
    const bounce = new THREE.PointLight(0xedac2a, 8, 0, 2);
    bounce.position.set(2.4, 0.5, 3.4);
    this.scene.add(bounce);

    /* ---- materials ---- */
    const lidAlbedo = makeLidAlbedo();
    const lidRoughness = makeLidRoughness();
    const baseAlbedo = makeBaseAlbedo();
    const bump = makeBump();
    const couscousAlbedo = makeCouscousAlbedo();
    const woodAlbedo = makeWoodAlbedo();
    this.textures.push(lidAlbedo, lidRoughness, baseAlbedo, bump, couscousAlbedo, woodAlbedo);
    const anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8);
    lidAlbedo.anisotropy = anisotropy;
    baseAlbedo.anisotropy = anisotropy;

    const lidMaterial = new THREE.MeshPhysicalMaterial({
      map: lidAlbedo,
      roughnessMap: lidRoughness,
      roughness: 1,
      bumpMap: bump,
      bumpScale: 0.012,
      clearcoat: 0.55,
      clearcoatRoughness: 0.4,
      envMapIntensity: 1.1,
      side: THREE.DoubleSide,
    });
    const baseMaterial = new THREE.MeshStandardMaterial({
      map: baseAlbedo,
      roughness: 0.72,
      metalness: 0.0,
      bumpMap: bump,
      bumpScale: 0.025,
      envMapIntensity: 0.55,
      side: THREE.DoubleSide,
    });

    /* ---- walnut turntable ---- */
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(2.7, 2.8, 0.18, 64),
      new THREE.MeshStandardMaterial({
        map: woodAlbedo,
        roughness: 0.55,
        envMapIntensity: 0.5,
      }),
    );
    table.position.y = -0.09;
    table.receiveShadow = true;
    this.potGroup.add(table);

    /* ---- pot ---- */
    const baseGeometry = lathe(BASE_POINTS);
    handmadeWobble(baseGeometry);
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    this.potGroup.add(base);

    const lidGeometry = lathe(LID_POINTS);
    handmadeWobble(lidGeometry);
    const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);
    lidMesh.castShadow = true;
    this.lid.add(lidMesh);
    this.potGroup.add(this.lid);

    /* ---- the payoff: food inside, lit as the lid opens ---- */
    this.potGroup.add(buildFood(couscousAlbedo));
    this.foodLight = new THREE.PointLight(0xffb45e, 0, 4, 2);
    this.foodLight.position.set(0.3, 1.6, 0.8);
    this.potGroup.add(this.foodLight);

    /* ---- soft contact shadow on the table ---- */
    const shadowTexture = makeShadowTexture();
    this.textures.push(shadowTexture);
    const contact = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 48),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.004;
    this.potGroup.add(contact);

    this.potGroup.position.y = -0.85;
    this.scene.add(this.potGroup);

    /* ---- steam: chimney plume + lid-gap pour ---- */
    const smokeSprite = makeSmokeSprite();
    this.textures.push(smokeSprite);

    const chimney = makeSteamPoints(STEAM_COUNT, smokeSprite, {
      baseY: 2.12,
      spread: 0.22,
      rise: 2.4,
      intensity: 0.6,
    });
    this.steamMaterial = chimney.material;
    this.potGroup.add(chimney.points);

    const gap = makeSteamPoints(GAP_STEAM_COUNT, smokeSprite, {
      baseY: 0.7,
      spread: 1.15,
      rise: 1.6,
      intensity: 0,
    });
    this.gapSteamMaterial = gap.material;
    this.potGroup.add(gap.points);

    /* ---- spice dust ---- */
    this.dustMaterial = new THREE.ShaderMaterial({
      vertexShader: DUST_VERTEX,
      fragmentShader: DUST_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uScale: { value: 1 },
      },
    });
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(DUST_COUNT * 3), 3),
    );
    dustGeometry.setAttribute("aSeed", makeSeedAttribute(DUST_COUNT));
    dustGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1.5, 0), 8);
    this.potGroup.add(new THREE.Points(dustGeometry, this.dustMaterial));

    /* ---- film pipeline: render → bloom → grade → output ---- */
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.15, 0.4, 1.15);
    this.composer.addPass(bloom);
    this.filmPass = new ShaderPass(FILM_SHADER);
    this.composer.addPass(this.filmPass);
    this.composer.addPass(new OutputPass());
  }

  resize(width: number, height: number) {
    if (this.disposed || width === 0 || height === 0) return;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    for (const material of [this.steamMaterial, this.gapSteamMaterial, this.dustMaterial]) {
      material.uniforms.uPixelRatio.value = pixelRatio;
      material.uniforms.uScale.value = Math.min(height / 640, 1.2);
    }
    if (this.rafId === null) this.renderFrame(0);
  }

  setMouse(x: number, y: number) {
    this.mouseTarget.x = x;
    this.mouseTarget.y = y;
  }

  setProgress(progress: number) {
    this.progress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  start() {
    if (this.disposed || this.rafId !== null) return;
    this.clock.start();
    const loop = () => {
      this.rafId = requestAnimationFrame(loop);
      this.renderFrame(this.clock.getDelta());
    };
    loop();
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** One presentable frame for reduced-motion users: lid ajar, food peeking. */
  renderStatic() {
    this.progress = 0.45;
    this.steamMaterial.uniforms.uTime.value = 6.5;
    this.gapSteamMaterial.uniforms.uTime.value = 6.5;
    this.dustMaterial.uniforms.uTime.value = 6.5;
    this.applyProgress();
    this.updateCamera(6.5);
    this.potGroup.rotation.y = -0.45;
    this.composer.render();
  }

  private applyProgress() {
    const p = this.progress;
    // The lid rises and tips back like a hand lifting it clear of the dish.
    this.lid.position.y = p * 2.1;
    this.lid.position.z = p * -0.4;
    this.lid.rotation.x = p * 0.5;
    this.steamMaterial.uniforms.uIntensity.value = 0.55 + p * 0.25;
    this.steamMaterial.uniforms.uBaseY.value = 2.25 + p * 2.1;
    this.gapSteamMaterial.uniforms.uIntensity.value = Math.sin(Math.min(p * 1.4, 1) * Math.PI * 0.5) * 0.9;
    this.foodLight.intensity = Math.sin(Math.min(p * 1.4, 1) * Math.PI * 0.5) * 8;
  }

  /** Crane move: rise over the pot as the lid opens, so the food shows. */
  private updateCamera(elapsed: number) {
    const p = this.progress;
    this.camera.position.y = 1.75 + p * 1.55 + Math.sin(elapsed * 0.35) * 0.02;
    this.camera.position.z = 6.9 - p * 0.95;
    this.camera.lookAt(0, 1.05 - p * 0.5, 0);
  }

  private renderFrame(delta: number) {
    if (this.disposed) return;
    const elapsed = this.clock.elapsedTime;
    this.steamMaterial.uniforms.uTime.value = elapsed;
    this.gapSteamMaterial.uniforms.uTime.value = elapsed;
    this.dustMaterial.uniforms.uTime.value = elapsed;
    this.filmPass.uniforms.uTime.value = elapsed;

    const ease = 1 - Math.exp(-delta * 4);
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * ease;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * ease;

    this.spin += delta * 0.07;
    this.potGroup.rotation.y = -0.45 + this.spin + this.mouseCurrent.x * 0.2;
    this.potGroup.rotation.x = this.mouseCurrent.y * 0.04;
    this.applyProgress();
    this.updateCamera(elapsed);

    this.composer.render();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) {
          for (const m of material) m.dispose();
        } else {
          material.dispose();
        }
      }
    });
    for (const texture of this.textures) texture.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}
