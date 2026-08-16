"use client";

import * as THREE from "three";

/**
 * Site-wide ambient silk — a high-key cloud of saffron silk that lives
 * behind ALL content. Two ideas drive it:
 *
 *  1. It stays near-cream (the body background) so text keeps its contrast;
 *     the flow reads as warm clouds, never as a poster.
 *  2. A kaleidoscope fold (8-fold khatam symmetry) is blended in and out as
 *     you travel down the page: the free-flowing silk gathers into a
 *     geometric rosette, holds, then dissolves and merges back — Moroccan
 *     motifs growing out of the flow itself.
 *
 * No post-processing: it is a background, the page's grain overlay already
 * sits on top of it.
 */

const BACKGROUND_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;
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
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(13.7, 7.1);
      amplitude *= 0.5;
    }
    return value;
  }

  vec2 rotate(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  // Fold the plane into an n-fold mirrored sector: khatam symmetry.
  vec2 kaleido(vec2 p, float n) {
    float segment = 6.28318 / n;
    float angle = atan(p.y, p.x);
    angle = mod(angle, segment);
    angle = abs(angle - segment * 0.5);
    return length(p) * vec2(cos(angle), sin(angle));
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv = (vUv - 0.5) * aspect;
    vec2 mouse = (uMouse * 0.5) * aspect;
    float s = uScroll;
    float t = uTime * 0.035;

    // Motif life-cycle: gathers and dissolves ~1.5 times over the page,
    // with a slow autonomous breath so it never fully sleeps.
    float wave = 0.5 + 0.5 * sin(s * 9.42478 - 1.35);
    float motif = smoothstep(0.28, 0.9, wave) * (0.74 + 0.2 * sin(uTime * 0.05));

    // Kaleidoscope coordinates drift and spin very slowly.
    vec2 folded = kaleido(rotate(uv, uTime * 0.012 + s * 1.2), 8.0);
    vec2 p = mix(uv, folded, motif);

    // Domain-warped flow; the pointer nudges it locally.
    float pointer = exp(-length(uv - mouse) * 2.0) * 0.38;
    vec2 q = vec2(fbm(p * 1.15 + vec2(0.0, t)), fbm(p * 1.15 - vec2(t * 0.7, 0.0)));
    vec2 r = vec2(
      fbm(p * 1.15 + q * 1.7 + vec2(1.7, 9.2) + t * 0.5),
      fbm(p * 1.15 + q * 1.7 + vec2(8.3, 2.8) - t * 0.35)
    );
    r += pointer;
    float f = fbm(p * 1.15 + r * (1.25 + s * 0.5) - vec2(0.0, uTime * 0.01 + s * 0.9));

    // Faint concentric zellige rings, only inside the motif.
    f += 0.085 * sin(length(uv) * 26.0 - uTime * 0.12) * motif;

    // High-key palette: cream → sand → light gold → a rare amber accent.
    vec3 color = vec3(1.0, 0.988, 0.962);
    color = mix(color, vec3(0.973, 0.915, 0.798), smoothstep(0.34, 0.62, f));
    color = mix(color, vec3(0.948, 0.838, 0.628), smoothstep(0.6, 0.82, f));
    color = mix(color, vec3(0.905, 0.713, 0.42), smoothstep(0.8, 0.99, f));

    // Slightly richer at the very top of the page (the hero moment).
    float rich = 1.0 - smoothstep(0.0, 0.13, s);
    color = mix(color, color * vec3(0.965, 0.92, 0.85), rich * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const BACKGROUND_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export class SilkBackgroundScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private material: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private rafId: number | null = null;
  private mouseTarget = { x: 0, y: 0 };
  private mouseCurrent = { x: 0, y: 0 };
  private scrollTarget = 0;
  private scrollCurrent = 0;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    this.material = new THREE.ShaderMaterial({
      vertexShader: BACKGROUND_VERTEX,
      fragmentShader: BACKGROUND_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
      },
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
  }

  resize(width: number, height: number) {
    if (this.disposed || width === 0 || height === 0) return;
    // Soft low-frequency clouds: capped DPR keeps the fill-rate trivial.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    if (this.rafId === null) this.renderFrame(0);
  }

  setMouse(x: number, y: number) {
    this.mouseTarget.x = x;
    this.mouseTarget.y = -y;
  }

  /** Overall page progress 0..1 (scrollY / max scroll). */
  setScroll(progress: number) {
    this.scrollTarget = THREE.MathUtils.clamp(progress, 0, 1);
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
    this.material.uniforms.uTime.value = 40;
    this.material.uniforms.uScroll.value = 0.05;
    this.renderer.render(this.scene, this.camera);
  }

  private renderFrame(delta: number) {
    if (this.disposed) return;
    const ease = 1 - Math.exp(-delta * 3);
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * ease;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * ease;
    this.scrollCurrent += (this.scrollTarget - this.scrollCurrent) * ease;

    this.material.uniforms.uTime.value = this.clock.elapsedTime;
    this.material.uniforms.uMouse.value.set(this.mouseCurrent.x, this.mouseCurrent.y);
    this.material.uniforms.uScroll.value = this.scrollCurrent;
    this.renderer.render(this.scene, this.camera);
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
    this.renderer.dispose();
  }
}
