"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import {
  type HeroScene,
  makeBackdrop,
  makeWoodAlbedo,
  makeSmokeSprite,
  makeContactShadow,
  makeSteamPoints,
  FILM_SHADER,
  disposeScene,
} from "./scene-common";

/**
 * "Atay" hero — the iconic Moroccan mint-tea moment. Scrolling pours the
 * tea: a thin stream falls from above, the glass fills (clipping-plane
 * liquid with a rippling surface), foam bubbles gather, steam swells, and
 * a mint leaf settles on top. Real glass refraction (transmission) against
 * the ember backdrop is what sells it.
 */

const POUR_START = 0.06;
const POUR_END = 0.93;
const LEVEL_MIN = 0.3;
const LEVEL_MAX = 1.72;

/** Inner glass radius at height y (linear fit of the inner profile). */
function innerRadiusAt(y: number): number {
  return 0.5 + (y / 2.1) * 0.14;
}

/* ---- gold band with cut-out khatam arches, the classic tea glass ---- */
function makeGoldBandTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#d9a435";
  // Top and bottom rails.
  ctx.fillRect(0, 8, width, 14);
  ctx.fillRect(0, height - 22, width, 14);
  // Arch arcade: repeated horseshoe arches with khatam dots between.
  const arches = 16;
  const archWidth = width / arches;
  for (let i = 0; i < arches; i++) {
    const cx = (i + 0.5) * archWidth;
    ctx.beginPath();
    ctx.arc(cx, height * 0.52, archWidth * 0.3, Math.PI, 0);
    ctx.lineTo(cx + archWidth * 0.3, height * 0.78);
    ctx.lineTo(cx - archWidth * 0.3, height * 0.78);
    ctx.closePath();
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#d9a435";
    ctx.stroke();
    // Diamond between arches.
    ctx.save();
    ctx.translate(cx + archWidth * 0.5, height * 0.3);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/* ---- geometry ---- */

// Closed double-wall profile: bottom → outer wall → rim → inner wall → inner floor.
const GLASS_POINTS: Array<[number, number]> = [
  [0.0, 0.0],
  [0.42, 0.0],
  [0.54, 0.03],
  [0.58, 0.12],
  [0.6, 0.3],
  [0.66, 1.0],
  [0.72, 1.85],
  [0.735, 2.12],
  [0.7, 2.14],
  [0.665, 2.08],
  [0.64, 1.9],
  [0.58, 1.05],
  [0.53, 0.4],
  [0.5, 0.24],
  [0.0, 0.22],
];

function latheGlass(): THREE.LatheGeometry {
  const points = GLASS_POINTS.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(points, 96);
}

/** Liquid body matching the inner contour, clipped at the fill level. */
function latheLiquid(): THREE.LatheGeometry {
  const points: Array<[number, number]> = [
    [0.0, 0.23],
    [0.48, 0.25],
    [0.5, 0.3],
    [0.55, 1.0],
    [0.62, 1.95],
    [0.0, 1.95],
  ];
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), 64);
}

/* ------------------------------------------------------------------ */

export class TeaScene implements HeroScene {
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private filmPass: ShaderPass;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private stage = new THREE.Group();
  private glassGroup = new THREE.Group();
  private liquidPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), LEVEL_MIN);
  private surface: THREE.Mesh;
  private foam: THREE.InstancedMesh;
  private floatingLeaf: THREE.Mesh;
  private stream: THREE.Mesh;
  private splash: THREE.ShaderMaterial;
  private steamMaterial: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private rafId: number | null = null;
  private mouseTarget = { x: 0, y: 0 };
  private mouseCurrent = { x: 0, y: 0 };
  private progress = 0;
  private spin = 0;
  private disposed = false;
  private textures: THREE.Texture[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.localClippingEnabled = true;

    const backdrop = makeBackdrop();
    this.textures.push(backdrop);
    this.scene.background = backdrop;

    this.camera = new THREE.PerspectiveCamera(33, 1, 0.1, 50);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = environment;
    this.scene.environmentIntensity = 0.5;
    this.textures.push(environment);
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffd9a8, 1.2);
    key.position.set(3, 5.5, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.0008;
    key.shadow.radius = 5;
    this.scene.add(key);
    const rim = new THREE.PointLight(0xd97b1a, 22, 0, 2);
    rim.position.set(-3.4, 2.6, -2.8);
    this.scene.add(rim);
    const bounce = new THREE.PointLight(0xedac2a, 7, 0, 2);
    bounce.position.set(2.4, 0.6, 3.2);
    this.scene.add(bounce);

    /* ---- walnut table ---- */
    const woodAlbedo = makeWoodAlbedo();
    this.textures.push(woodAlbedo);
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.7, 0.18, 64),
      new THREE.MeshStandardMaterial({ map: woodAlbedo, roughness: 0.55, envMapIntensity: 0.5 }),
    );
    table.position.y = -0.09;
    table.receiveShadow = true;
    this.stage.add(table);

    const contactTexture = makeContactShadow();
    this.textures.push(contactTexture);
    const contact = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 48),
      new THREE.MeshBasicMaterial({ map: contactTexture, transparent: true, depthWrite: false }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.004;
    this.stage.add(contact);

    /* ---- the glass ---- */
    const glassGeometry = latheGlass();
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      thickness: 0.25,
      roughness: 0.05,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide,
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.castShadow = true;
    this.glassGroup.add(glass);

    // Gold arcade band.
    const bandTexture = makeGoldBandTexture();
    this.textures.push(bandTexture);
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.715, 0.685, 0.62, 96, 1, true),
      new THREE.MeshStandardMaterial({
        map: bandTexture,
        transparent: true,
        alphaTest: 0.1,
        metalness: 0.9,
        roughness: 0.28,
        envMapIntensity: 1.4,
        side: THREE.DoubleSide,
      }),
    );
    band.position.y = 1.42;
    this.glassGroup.add(band);

    /* ---- tea ---- */
    // Opaque on purpose: transmissive materials are excluded from each
    // other's transmission pass, so tea-behind-glass must not transmit or
    // it disappears. Dark amber + clearcoat reads as real mint tea.
    const liquid = new THREE.Mesh(
      latheLiquid(),
      new THREE.MeshPhysicalMaterial({
        color: 0x602a03,
        roughness: 0.12,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        envMapIntensity: 0.8,
        clippingPlanes: [this.liquidPlane],
        side: THREE.DoubleSide,
      }),
    );
    this.glassGroup.add(liquid);

    // Rippling surface disc, repositioned to the fill level each frame.
    const surfaceGeometry = new THREE.CircleGeometry(1, 64);
    this.surface = new THREE.Mesh(
      surfaceGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0x5c2a03,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.9,
      }),
    );
    this.surface.rotation.x = -Math.PI / 2;
    this.glassGroup.add(this.surface);

    // Foam bubbles riding the surface near the rim. The surface circle lies
    // in its local XY plane (Z is the normal), and scaling the surface to
    // the fill radius scales the foam ring along with it.
    const foamGeometry = new THREE.SphereGeometry(0.028, 10, 8);
    const foamMaterial = new THREE.MeshStandardMaterial({ color: 0xf2dcae, roughness: 0.5 });
    this.foam = new THREE.InstancedMesh(foamGeometry, foamMaterial, 26);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.3;
      const radial = 0.72 + Math.random() * 0.24; // fraction of surface radius
      dummy.position.set(Math.cos(angle) * radial, Math.sin(angle) * radial, 0.012);
      const s = 0.6 + Math.random() * 0.9;
      dummy.scale.set(s, s, s * 0.6);
      dummy.updateMatrix();
      this.foam.setMatrixAt(i, dummy.matrix);
    }
    this.foam.instanceMatrix.needsUpdate = true;
    this.surface.add(this.foam);

    /* ---- the pour stream ---- */
    // A falling stream narrows as it accelerates: wide at the spout, thin below.
    const streamGeometry = new THREE.CylinderGeometry(0.055, 0.034, 1, 16, 1, true);
    streamGeometry.translate(0, -0.5, 0); // pivot at the top
    this.stream = new THREE.Mesh(
      streamGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0xb55f12,
        transmission: 0.6,
        thickness: 0.4,
        roughness: 0.08,
        ior: 1.34,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      }),
    );
    this.stream.position.y = 4.6;
    this.stream.visible = false;
    this.glassGroup.add(this.stream);

    // Splash at the impact point — reuses the steam system, tiny and tight.
    // Lives in the glass group; its base height follows the fill level.
    const smokeSprite = makeSmokeSprite();
    this.textures.push(smokeSprite);
    const splash = makeSteamPoints(50, smokeSprite, {
      baseY: LEVEL_MIN,
      spread: 0.5,
      rise: 0.35,
      intensity: 0,
    });
    splash.material.uniforms.uScale.value = 0.4;
    this.splash = splash.material;
    this.glassGroup.add(splash.points);

    /* ---- steam above the glass ---- */
    const steam = makeSteamPoints(110, smokeSprite, {
      baseY: 2.2,
      spread: 0.26,
      rise: 1.7,
      intensity: 0.22,
    });
    this.steamMaterial = steam.material;
    this.glassGroup.add(steam.points);

    /* ---- garnish: mint leaves and sugar cubes on the table ---- */
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x3f6b2a,
      roughness: 0.55,
      side: THREE.DoubleSide,
    });
    const leafGeometry = new THREE.SphereGeometry(0.16, 16, 10);
    leafGeometry.scale(1, 0.12, 0.55);
    for (const [x, z, rot] of [
      [1.25, 0.55, 0.6],
      [1.45, 0.3, -0.4],
      [-1.15, 0.7, 1.9],
    ] as const) {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, 0.025, z);
      leaf.rotation.y = rot;
      leaf.castShadow = true;
      this.stage.add(leaf);
    }
    this.floatingLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    this.floatingLeaf.scale.setScalar(0.8);
    this.floatingLeaf.visible = false;
    this.floatingLeaf.position.set(0.18, LEVEL_MAX + 0.02, 0.1);
    this.floatingLeaf.rotation.y = 0.8;
    this.glassGroup.add(this.floatingLeaf);

    const sugarMaterial = new THREE.MeshStandardMaterial({ color: 0xf5efe2, roughness: 0.85 });
    const sugarGeometry = new THREE.BoxGeometry(0.3, 0.22, 0.3);
    for (const [x, z, rot] of [
      [-1.35, 0.2, 0.4],
      [-1.05, 0.42, 1.1],
    ] as const) {
      const cube = new THREE.Mesh(sugarGeometry, sugarMaterial);
      cube.position.set(x, 0.11, z);
      cube.rotation.y = rot;
      cube.castShadow = true;
      this.stage.add(cube);
    }

    this.stage.add(this.glassGroup);
    this.stage.position.y = -0.85;
    this.scene.add(this.stage);

    /* ---- film pipeline ---- */
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.15, 0.4, 1.15));
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
    for (const material of [this.steamMaterial, this.splash]) {
      material.uniforms.uPixelRatio.value = pixelRatio;
    }
    this.steamMaterial.uniforms.uScale.value = Math.min(height / 640, 1.2);
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

  renderStatic() {
    this.progress = 0.7;
    this.steamMaterial.uniforms.uTime.value = 6.5;
    this.splash.uniforms.uTime.value = 6.5;
    this.applyProgress(6.5);
    this.updateCamera(6.5);
    this.stage.rotation.y = -0.2;
    this.composer.render();
  }

  /** Pour narrative: level, stream, splash, foam, steam, mint. */
  private applyProgress(elapsed: number) {
    const p = this.progress;
    const pour = THREE.MathUtils.clamp((p - POUR_START) / (POUR_END - POUR_START), 0, 1);
    const eased = Math.sin((pour * Math.PI) / 2);
    const level = LEVEL_MIN + eased * (LEVEL_MAX - LEVEL_MIN);

    // Liquid clip + surface placement (radius follows the conical wall).
    this.liquidPlane.constant = level;
    this.surface.position.y = level;
    const radius = innerRadiusAt(level) - 0.015;
    this.surface.scale.setScalar(radius);

    // Stream: from above the frame down to the surface, wobbling slightly.
    const pouring = p > POUR_START && p < POUR_END;
    this.stream.visible = pouring;
    if (pouring) {
      const top = 4.6;
      this.stream.scale.y = top - level;
      this.stream.position.x = Math.sin(elapsed * 6.5) * 0.012;
      this.splash.uniforms.uIntensity.value = 0.9;
      this.splash.uniforms.uBaseY.value = level + 0.01;
    } else {
      this.splash.uniforms.uIntensity.value = 0;
    }

    // Steam builds as the glass fills; foam fades in late; mint lands last.
    this.steamMaterial.uniforms.uIntensity.value = 0.22 + eased * 0.36;
    this.steamMaterial.uniforms.uBaseY.value = level + 0.18;
    const foamScale = THREE.MathUtils.clamp((pour - 0.35) / 0.4, 0.001, 1);
    this.foam.scale.setScalar(foamScale);
    this.floatingLeaf.visible = p > 0.9;
  }

  /** Camera settles from a high pour view down to a hero shot. */
  private updateCamera(elapsed: number) {
    const p = this.progress;
    this.camera.position.set(
      this.mouseCurrent.x * 0.25,
      2.9 - p * 0.95 + Math.sin(elapsed * 0.35) * 0.02,
      6.4 - p * 0.7,
    );
    this.camera.lookAt(0, 0.95 - p * 0.25, 0);
  }

  private renderFrame(delta: number) {
    if (this.disposed) return;
    const elapsed = this.clock.elapsedTime;
    this.steamMaterial.uniforms.uTime.value = elapsed;
    this.splash.uniforms.uTime.value = elapsed;
    this.filmPass.uniforms.uTime.value = elapsed;

    const ease = 1 - Math.exp(-delta * 4);
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * ease;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * ease;

    this.spin += delta * 0.06;
    this.stage.rotation.y = -0.2 + Math.sin(this.spin) * 0.1 + this.mouseCurrent.x * 0.12;
    this.applyProgress(elapsed);
    this.updateCamera(elapsed);

    this.composer.render();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    disposeScene(this.scene, this.textures);
    this.composer.dispose();
    this.renderer.dispose();
  }
}
