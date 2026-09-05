import * as THREE from 'three';

/**
 * Manages all user interface interactions, hotspot markers, and screenshots
 */
export class UIController {
  constructor(app) {
    this.app = app;
    this.hotspotElements = [];
    this.showHotspots = true;
    this.isCinematic = false;

    this.bindDOM();
    this.setupEventListeners();
  }

  bindDOM() {
    this.sceneTabs = document.querySelectorAll('.scene-tab');
    this.lightBtns = document.querySelectorAll('.btn-icon[data-light]');
    this.btnCinematic = document.getElementById('btn-cinematic');
    this.btnAssemble = document.getElementById('btn-assemble');
    this.btnHotspots = document.getElementById('btn-hotspots');
    this.btnAudio = document.getElementById('btn-audio');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioText = document.getElementById('audio-text');
    this.sliceSlider = document.getElementById('slice-slider');
    this.sliceVal = document.getElementById('slice-val');
    this.btnResetCam = document.getElementById('btn-reset-cam');
    this.btnScreenshot = document.getElementById('btn-screenshot');
    this.voxelCountEl = document.getElementById('voxel-count');
    this.fpsEl = document.getElementById('fps-counter');

    // Lore Modal
    this.loreModal = document.getElementById('lore-modal');
    this.loreTag = document.getElementById('lore-tag');
    this.loreTitle = document.getElementById('lore-title');
    this.loreSubtitle = document.getElementById('lore-subtitle');
    this.loreDesc = document.getElementById('lore-desc');
    this.loreQuote = document.getElementById('lore-quote');
    this.loreClose = document.getElementById('lore-close');
  }

  setupEventListeners() {
    // 1. Scene Switcher Tabs
    this.sceneTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const sceneName = tab.dataset.scene;
        if (this.app.currentSceneName === sceneName) return;

        this.sceneTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.app.switchScene(sceneName);
        this.createHotspotDOM();
      });
    });

    // 2. Lighting Mode Toggles
    this.lightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.lightBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.app.lighting.setMode(btn.dataset.light);
      });
    });

    // 3. Cinematic Auto-Rotate
    this.btnCinematic.addEventListener('click', () => {
      this.isCinematic = !this.isCinematic;
      this.app.controls.autoRotate = this.isCinematic;
      this.btnCinematic.classList.toggle('active', this.isCinematic);
    });

    // 4. Voxel Reassemble Animation
    this.btnAssemble.addEventListener('click', () => {
      this.app.world.triggerAssembleAnimation();
    });

    // 5. Hotspot Toggle
    this.btnHotspots.addEventListener('click', () => {
      this.showHotspots = !this.showHotspots;
      this.btnHotspots.classList.toggle('active', this.showHotspots);
      this.toggleHotspotsVisibility(this.showHotspots);
    });

    // 6. Audio Toggle
    this.btnAudio.addEventListener('click', () => {
      const isPlaying = this.app.audio.toggle();
      if (isPlaying) {
        this.audioIcon.textContent = '🔊';
        this.audioText.textContent = '사운드 끄기';
        this.btnAudio.classList.add('active');
      } else {
        this.audioIcon.textContent = '🔇';
        this.audioText.textContent = '사운드 켜기';
        this.btnAudio.classList.remove('active');
      }
    });

    // 7. Y-Slice Inspection Slider
    this.sliceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.sliceVal.textContent = `${val}%`;
      this.app.world.setSliceHeight(val);
    });

    // 8. Camera Reset
    this.btnResetCam.addEventListener('click', () => {
      this.app.resetCamera();
    });

    // 9. High-Res Screenshot Capture
    this.btnScreenshot.addEventListener('click', () => {
      this.captureScreenshot();
    });

    // 10. Lore Modal Close
    this.loreClose.addEventListener('click', () => {
      this.loreModal.classList.add('hidden');
    });
    this.loreModal.querySelector('.lore-modal-backdrop').addEventListener('click', () => {
      this.loreModal.classList.add('hidden');
    });
  }

  createHotspotDOM() {
    // Remove old hotspot pins
    this.hotspotElements.forEach(el => el.remove());
    this.hotspotElements = [];

    const container = document.body;

    this.app.world.hotspots.forEach(item => {
      const pin = document.createElement('div');
      pin.className = 'hotspot-marker';
      pin.innerHTML = `
        <span>✦</span>
        <div class="hotspot-label">${item.data.title.split('(')[0].trim()}</div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showLoreCard(item.data);
      });

      container.appendChild(pin);
      this.hotspotElements.push({
        element: pin,
        position: item.position.clone()
      });
    });

    this.toggleHotspotsVisibility(this.showHotspots);
  }

  toggleHotspotsVisibility(visible) {
    this.hotspotElements.forEach(h => {
      h.element.style.display = visible ? 'flex' : 'none';
    });
  }

  updateHotspotPositions() {
    if (!this.showHotspots || this.hotspotElements.length === 0) return;

    const camera = this.app.camera;
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    const tempV = new THREE.Vector3();

    this.hotspotElements.forEach(h => {
      tempV.copy(h.position);
      // Project 3D coordinate to 2D screen coordinate
      tempV.project(camera);

      // Check if behind camera
      if (tempV.z > 1) {
        h.element.style.display = 'none';
        return;
      }

      h.element.style.display = this.showHotspots ? 'flex' : 'none';

      const x = (tempV.x * widthHalf) + widthHalf;
      const y = -(tempV.y * heightHalf) + heightHalf;

      h.element.style.left = `${x}px`;
      h.element.style.top = `${y}px`;
    });
  }

  showLoreCard(data) {
    this.loreTag.textContent = data.tag || 'MIDDLE-EARTH';
    this.loreTitle.textContent = data.title;
    this.loreSubtitle.textContent = data.subtitle || '';
    this.loreDesc.textContent = data.desc;
    this.loreQuote.textContent = data.quote || '';
    this.loreModal.classList.remove('hidden');
  }

  setVoxelCount(count) {
    this.voxelCountEl.textContent = count.toLocaleString();
  }

  setFPS(fps) {
    this.fpsEl.textContent = fps;
  }

  captureScreenshot() {
    // 1. Hide UI elements
    const elementsToHide = [
      document.querySelector('.app-header'),
      document.querySelector('.control-panel'),
      document.querySelector('.view-instructions'),
      document.querySelector('.voxel-stats'),
      ...document.querySelectorAll('.hotspot-marker')
    ];

    elementsToHide.forEach(el => {
      if (el) el.style.visibility = 'hidden';
    });

    // 2. Render frame cleanly
    this.app.postProcessing.render();

    // 3. Extract canvas data URL
    const canvas = this.app.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');

    // 4. Trigger download
    const link = document.createElement('a');
    link.download = `LOTR_Voxel_${this.app.currentSceneName}_${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    // 5. Restore UI elements
    elementsToHide.forEach(el => {
      if (el) el.style.visibility = 'visible';
    });
  }
}
