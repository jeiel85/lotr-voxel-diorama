import * as THREE from 'three';

/**
 * Dynamic lighting system supporting Day, Sunset, and Night with soft shadows.
 */
export class LightingSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentMode = 'day';
    this.targetMode = 'day';
    this.transitionTime = 0;
    this.transitionDuration = 1.0;

    this.initLights();
    this.setMode('day', true);
  }

  initLights() {
    // 1. Hemisphere Ambient Light (Sky/Ground)
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    // 2. Main Sun / Moon Directional Light
    this.dirLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    this.dirLight.position.set(30, 45, 25);
    this.dirLight.castShadow = true;

    // High quality shadow configuration
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 5;
    this.dirLight.shadow.camera.far = 120;
    this.dirLight.shadow.camera.left = -30;
    this.dirLight.shadow.camera.right = 30;
    this.dirLight.shadow.camera.top = 30;
    this.dirLight.shadow.camera.bottom = -30;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);

    // 3. Fill Light (Soft subtle bounce)
    this.fillLight = new THREE.DirectionalLight(0x7da4d4, 0.4);
    this.fillLight.position.set(-25, 20, -25);
    this.scene.add(this.fillLight);

    // 4. Accent Point Light (Dynamic landmark focus: lantern, Eye of Sauron, lava)
    this.accentLight = new THREE.PointLight(0xffaa44, 2.5, 30, 1.5);
    this.accentLight.position.set(0, 10, 0);
    this.scene.add(this.accentLight);

    // Presets
    this.presets = {
      day: {
        dirColor: new THREE.Color(0xfff4e0),
        dirIntensity: 2.2,
        dirPos: new THREE.Vector3(28, 42, 24),
        hemiSky: new THREE.Color(0x9bd4f5),
        hemiGround: new THREE.Color(0x5a6344),
        hemiIntensity: 0.8,
        fillColor: new THREE.Color(0x86b3e6),
        fillIntensity: 0.4,
        accentIntensity: 1.0,
        bgColor: new THREE.Color(0x12151e)
      },
      sunset: {
        dirColor: new THREE.Color(0xff7733),
        dirIntensity: 2.8,
        dirPos: new THREE.Vector3(38, 14, 20),
        hemiSky: new THREE.Color(0xe87a5d),
        hemiGround: new THREE.Color(0x3d2729),
        hemiIntensity: 0.6,
        fillColor: new THREE.Color(0x9e4b75),
        fillIntensity: 0.5,
        accentIntensity: 2.0,
        bgColor: new THREE.Color(0x1c1218)
      },
      night: {
        dirColor: new THREE.Color(0x7090d8),
        dirIntensity: 0.6,
        dirPos: new THREE.Vector3(20, 35, 25),
        hemiSky: new THREE.Color(0x131a33),
        hemiGround: new THREE.Color(0x0a0c14),
        hemiIntensity: 0.3,
        fillColor: new THREE.Color(0x232942),
        fillIntensity: 0.2,
        accentIntensity: 4.5, // Lanterns and glowing voxels shine brilliantly
        bgColor: new THREE.Color(0x06070a)
      }
    };
  }

  setMode(mode, immediate = false) {
    if (!this.presets[mode]) return;
    this.targetMode = mode;
    if (immediate) {
      this.currentMode = mode;
      this.applyPreset(this.presets[mode]);
    } else {
      this.transitionTime = 0;
    }
  }

  applyPreset(p) {
    this.dirLight.color.copy(p.dirColor);
    this.dirLight.intensity = p.dirIntensity;
    this.dirLight.position.copy(p.dirPos);

    this.hemiLight.color.copy(p.hemiSky);
    this.hemiLight.groundColor.copy(p.hemiGround);
    this.hemiLight.intensity = p.hemiIntensity;

    this.fillLight.color.copy(p.fillColor);
    this.fillLight.intensity = p.fillIntensity;

    this.accentLight.intensity = p.accentIntensity;
    this.scene.background = p.bgColor;
  }

  setAccentPosition(x, y, z, colorHex = 0xffaa44) {
    this.accentLight.position.set(x, y, z);
    this.accentLight.color.set(colorHex);
  }

  update(delta) {
    if (this.currentMode !== this.targetMode) {
      this.transitionTime += delta;
      const progress = Math.min(1.0, this.transitionTime / this.transitionDuration);

      const from = this.presets[this.currentMode];
      const to = this.presets[this.targetMode];

      this.dirLight.color.lerpColors(from.dirColor, to.dirColor, progress);
      this.dirLight.intensity = THREE.MathUtils.lerp(from.dirIntensity, to.dirIntensity, progress);
      this.dirLight.position.lerpVectors(from.dirPos, to.dirPos, progress);

      this.hemiLight.color.lerpColors(from.hemiSky, to.hemiSky, progress);
      this.hemiLight.groundColor.lerpColors(from.hemiGround, to.hemiGround, progress);
      this.hemiLight.intensity = THREE.MathUtils.lerp(from.hemiIntensity, to.hemiIntensity, progress);

      this.fillLight.color.lerpColors(from.fillColor, to.fillColor, progress);
      this.fillLight.intensity = THREE.MathUtils.lerp(from.fillIntensity, to.fillIntensity, progress);

      this.accentLight.intensity = THREE.MathUtils.lerp(from.accentIntensity, to.accentIntensity, progress);

      if (this.scene.background) {
        this.scene.background.lerpColors(from.bgColor, to.bgColor, progress);
      }

      if (progress >= 1.0) {
        this.currentMode = this.targetMode;
      }
    }
  }
}
