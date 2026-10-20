import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { VoxelWorld } from './engine/VoxelWorld.js';
import { DioramaPedestal } from './engine/DioramaPedestal.js';
import { LightingSystem } from './engine/LightingSystem.js';
import { PostProcessing } from './engine/PostProcessing.js';
import { AudioManager } from './engine/AudioManager.js';
import { UIController } from './ui/UIController.js';

import { buildShireScene } from './scenes/ShireScene.js';
import { buildMordorScene } from './scenes/MordorScene.js';
import { buildArgonathScene } from './scenes/ArgonathScene.js';

class LOTRApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.loaderEl = document.getElementById('loader');

    this.currentSceneName = 'shire';
    this.clock = new THREE.Clock();
    this.frameCount = 0;
    this.lastFpsUpdate = 0;

    this.initThree();
    this.initParticles();
    this.initApp();
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1017);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.defaultCamPos = new THREE.Vector3(34, 26, 38);
    this.defaultTarget = new THREE.Vector3(0, 7, 0);
    this.resetCamera();

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // For screenshots
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 14;
    this.controls.maxDistance = 85;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above pedestal
    this.controls.target.copy(this.defaultTarget);
    this.controls.autoRotateSpeed = 0.9;

    // 5. Engine Systems
    this.lighting = new LightingSystem(this.scene);
    this.pedestal = new DioramaPedestal(this.scene);
    this.world = new VoxelWorld(this.scene);
    this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);
    this.audio = new AudioManager();

    // Resize Handler
    window.addEventListener('resize', () => this.onWindowResize());
  }

  initParticles() {
    // Atmospheric ambient floating particles (fireflies / embers / pollen)
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = 2 + Math.random() * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36;

      // Golden yellow glow default
      colors[i * 3] = 0.96;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.45;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  updateParticles(time) {
    if (!this.particles) return;
    const pos = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] += Math.sin(time + pos[i]) * 0.02; // Floating bob
      pos[i] += Math.cos(time + pos[i + 2]) * 0.01;

      // Wrap if above/below bounds
      if (pos[i + 1] > 32) pos[i + 1] = 3;
      if (pos[i + 1] < 2) pos[i + 1] = 30;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  initApp() {
    // 1. Build initial scene (The Shire)
    this.switchScene('shire');

    // 2. Setup UI
    this.ui = new UIController(this);
    this.ui.createHotspotDOM();

    // 3. Hide Loader with smooth fade
    setTimeout(() => {
      this.loaderEl.classList.add('fade-out');
    }, 400);

    // 4. Start Animation Loop
    this.animate();
  }

  switchScene(sceneName) {
    this.currentSceneName = sceneName;
    let count = 0;

    if (sceneName === 'shire') {
      count = buildShireScene(this.world);
      this.lighting.setAccentPosition(0, 10, 3, 0xffbb44);
      this.setParticleTheme(0.96, 0.85, 0.45); // Golden pollen/fireflies
      this.defaultCamPos.set(34, 26, 38);
      this.defaultTarget.set(0, 7, 0);
    } else if (sceneName === 'mordor') {
      count = buildMordorScene(this.world);
      this.lighting.setAccentPosition(7, 30, -3, 0xff4400); // Eye of Sauron light
      this.setParticleTheme(1.0, 0.35, 0.08); // Fiery orange embers
      this.defaultCamPos.set(36, 30, 38);
      this.defaultTarget.set(2, 12, 0);
    } else if (sceneName === 'argonath') {
      count = buildArgonathScene(this.world);
      this.lighting.setAccentPosition(0, 10, 0, 0x88ccff);
      this.setParticleTheme(0.7, 0.9, 0.95); // River mist
      this.defaultCamPos.set(32, 28, 40);
      this.defaultTarget.set(0, 10, 0);
    }

    // Trigger magic assemble animation
    this.world.triggerAssembleAnimation();

    if (this.ui) {
      this.ui.setVoxelCount(count);
    }

    // Update audio theme if playing
    this.audio.setScene(sceneName);
  }

  setParticleTheme(r, g, b) {
    if (!this.particles) return;
    const col = this.particles.geometry.attributes.color.array;
    for (let i = 0; i < col.length; i += 3) {
      col[i] = r;
      col[i + 1] = g;
      col[i + 2] = b;
    }
    this.particles.geometry.attributes.color.needsUpdate = true;
  }

  resetCamera() {
    this.camera.position.copy(this.defaultCamPos);
    if (this.controls) {
      this.controls.target.copy(this.defaultTarget);
      this.controls.update();
    }
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.postProcessing.resize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Controls
    this.controls.update();

    // 2. Update Engine Components
    this.pedestal.update(delta, elapsedTime);
    this.lighting.update(delta);
    this.world.update(delta, elapsedTime);
    this.updateParticles(elapsedTime);

    // 3. Update Hotspot screen anchors
    if (this.ui) {
      this.ui.updateHotspotPositions();
    }

    // 4. Render with UnrealBloom & ToneMapping
    this.postProcessing.render();

    // 5. FPS Counter calculation
    this.frameCount++;
    if (elapsedTime - this.lastFpsUpdate >= 1.0) {
      if (this.ui) {
        this.ui.setFPS(this.frameCount);
      }
      this.frameCount = 0;
      this.lastFpsUpdate = elapsedTime;
    }
  }
}

// Start Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  new LOTRApp();
});

// PWA: 서비스워커 등록 (오프라인 실행·홈 화면 설치)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
