import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * Post-processing manager featuring UnrealBloomPass for magical Middle-earth glows
 */
export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.composer = new EffectComposer(this.renderer);
    
    // 1. Base Render Pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // 2. Unreal Bloom Pass
    // Tuned so that only emissive materials (Eye of Sauron, One Ring, lava, warm windows) bloom vibrantly
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.15, // strength
      0.45, // radius
      0.68  // threshold
    );
    this.composer.addPass(this.bloomPass);

    // 3. Output Pass (tone mapping & sRGB encoding)
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  resize(width, height) {
    this.composer.setSize(width, height);
    this.bloomPass.resolution.set(width, height);
  }

  render() {
    this.composer.render();
  }
}
