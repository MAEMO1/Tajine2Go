"use client";

import * as THREE from "three";

/**
 * Shared building blocks for the hero scenes (tea, silk): the common scene
 * contract, canvas-texture helpers, the ember backdrop, walnut table, wispy
 * steam particle system and the film-grade shader. The tajine scene predates
 * this module and keeps its own copies so it stays self-contained.
 */

export interface HeroScene {
  resize(width: number, height: number): void;
  setMouse(x: number, y: number): void;
  setProgress(progress: number): void;
  start(): void;
  stop(): void;
  renderStatic(): void;
  dispose(): void;
}

/* ------------------------------------------------------------------ */
/* Canvas helpers                                                      */
/* ------------------------------------------------------------------ */

export function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  return [canvas, ctx];
}

/** Scene backdrop: vertical ember gradient with a warm halo. */
export function makeBackdrop(): THREE.CanvasTexture {
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

/** Walnut tabletop — warm dark wood streaks. */
export function makeWoodAlbedo(): THREE.CanvasTexture {
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

/** Wispy smoke sprite: a cluster of soft offset blobs. */
export function makeSmokeSprite(): THREE.CanvasTexture {
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

export function makeContactShadow(): THREE.CanvasTexture {
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
/* Steam particles                                                     */
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

export function makeSeedAttribute(
  count: number,
  speedBase = 0.035,
  speedSpan = 0.055,
): THREE.BufferAttribute {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    data[i * 3] = Math.random();
    data[i * 3 + 1] = speedBase + Math.random() * speedSpan;
    data[i * 3 + 2] = Math.random();
  }
  return new THREE.BufferAttribute(data, 3);
}

export function makeSteamPoints(
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
/* Film grade                                                          */
/* ------------------------------------------------------------------ */

export const FILM_SHADER = {
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
      float d = distance(vUv, vec2(0.5));
      color.rgb *= smoothstep(0.95, 0.35, d) * 0.25 + 0.78;
      float grain = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 43.0) - 0.5;
      color.rgb += grain * 0.025;
      gl_FragColor = color;
    }
  `,
};

export function disposeScene(scene: THREE.Scene, textures: THREE.Texture[]) {
  scene.traverse((object) => {
    if (
      object instanceof THREE.Mesh ||
      object instanceof THREE.Points ||
      object instanceof THREE.InstancedMesh
    ) {
      object.geometry.dispose();
      const material = object.material;
      if (Array.isArray(material)) {
        for (const m of material) m.dispose();
      } else {
        material.dispose();
      }
    }
  });
  for (const texture of textures) texture.dispose();
}
