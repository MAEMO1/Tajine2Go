"use client";

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { type HeroScene, FILM_SHADER } from "./scene-common";

/**
 * "Saffraan-zijde" hero — a fullscreen domain-warped flow field in the
 * brand palette: molten amber and gold folding like silk or slow caramel.
 * Deliberately abstract (it cannot read as "fake"), reactive to the pointer
 * (local warp bulge) and to scroll (the flow deepens and quickens).
 */

const SILK_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uProgress;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(13.7, 7.1);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv = (vUv - 0.5) * aspect;
    vec2 mouse = (uMouse * 0.5) * aspect;

    float t = uTime * 0.045;
    float depth = 1.35 + uProgress * 0.9;

    // Pointer pushes the silk around its position.
    float md = exp(-length(uv - mouse) * 2.2) * 0.5;

    vec2 q = vec2(
      fbm(uv * 1.3 + vec2(0.0, t)),
      fbm(uv * 1.3 - vec2(t * 0.7, 0.0))
    );
    vec2 r = vec2(
      fbm(uv * 1.3 + q * 1.9 + vec2(1.7, 9.2) + t * 0.55),
      fbm(uv * 1.3 + q * 1.9 + vec2(8.3, 2.8) - t * 0.4)
    );
    r += md;

    float f = fbm(uv * 1.3 + r * depth - vec2(0.0, uTime * 0.018));

    // Brand palette ramp: ember brown → terracotta → orange → gold → cream.
    vec3 color = vec3(0.105, 0.055, 0.02);
    color = mix(color, vec3(0.40, 0.17, 0.05), smoothstep(0.18, 0.5, f));
    color = mix(color, vec3(0.85, 0.48, 0.10), smoothstep(0.45, 0.72, f));
    color = mix(color, vec3(0.93, 0.67, 0.16), smoothstep(0.68, 0.88, f));
    color = mix(color, vec3(1.0, 0.92, 0.72), smoothstep(0.86, 1.0, f));

    // Deep folds darken; q adds cool shadow variation in the browns.
    color *= 0.72 + 0.4 * smoothstep(0.1, 0.7, q.y);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const SILK_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export class SilkScene implements HeroScene {
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private filmPass: ShaderPass;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private material: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private rafId: number | null = null;
  private mouseTarget = { x: 0, y: 0 };
  private mouseCurrent = { x: 0, y: 0 };
  private progressCurrent = 0;
  private progressTarget = 0;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.material = new THREE.ShaderMaterial({
      vertexShader: SILK_VERTEX,
      fragmentShader: SILK_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uProgress: { value: 0 },
      },
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.18, 0.5, 0.9));
    this.filmPass = new ShaderPass(FILM_SHADER);
    this.composer.addPass(this.filmPass);
    this.composer.addPass(new OutputPass());
  }

  resize(width: number, height: number) {
    if (this.disposed || width === 0 || height === 0) return;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5); // fbm is fill-rate heavy
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(width, height);
    this.material.uniforms.uResolution.value.set(width, height);
    if (this.rafId === null) this.renderFrame(0);
  }

  setMouse(x: number, y: number) {
    this.mouseTarget.x = x;
    this.mouseTarget.y = -y;
  }

  setProgress(progress: number) {
    this.progressTarget = THREE.MathUtils.clamp(progress, 0, 1);
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

  renderStatic() {
    this.material.uniforms.uTime.value = 30;
    this.material.uniforms.uProgress.value = 0.4;
    this.composer.render();
  }

  private renderFrame(delta: number) {
    if (this.disposed) return;
    const elapsed = this.clock.elapsedTime;
    const ease = 1 - Math.exp(-delta * 3.5);
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * ease;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * ease;
    this.progressCurrent += (this.progressTarget - this.progressCurrent) * ease;

    this.material.uniforms.uTime.value = elapsed;
    this.material.uniforms.uMouse.value.set(this.mouseCurrent.x, this.mouseCurrent.y);
    this.material.uniforms.uProgress.value = this.progressCurrent;
    this.filmPass.uniforms.uTime.value = elapsed;

    this.composer.render();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (!Array.isArray(object.material)) object.material.dispose();
      }
    });
    this.composer.dispose();
    this.renderer.dispose();
  }
}
