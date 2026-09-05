import * as THREE from 'three';

/**
 * Creates an ornate Tolkien-themed pedestal base for the diorama
 * featuring glowing golden Elvish Tengwar ring inscription.
 */
export class DioramaPedestal {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.radius = 24;
    this.createPedestal();
  }

  createPedestal() {
    // 1. Lower heavy obsidian base
    const baseGeo = new THREE.CylinderGeometry(this.radius + 1.2, this.radius + 2.5, 2.5, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x12141a,
      roughness: 0.8,
      metalness: 0.2
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.25;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // 2. Middle decorative gold bevel ring
    const goldBevelGeo = new THREE.CylinderGeometry(this.radius + 0.8, this.radius + 1.2, 0.4, 64);
    const goldBevelMat = new THREE.MeshStandardMaterial({
      color: 0xd4a84d,
      roughness: 0.3,
      metalness: 0.85
    });
    const goldBevelMesh = new THREE.Mesh(goldBevelGeo, goldBevelMat);
    goldBevelMesh.position.y = 0.1;
    this.group.add(goldBevelMesh);

    // 3. Ring with Glowing Tengwar / Elvish Inscription
    const ringGeo = new THREE.CylinderGeometry(this.radius + 0.5, this.radius + 0.8, 1.2, 64, 1, true);
    const ringTex = this.createElvishTexture();
    this.ringMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.4,
      metalness: 0.6,
      map: ringTex,
      emissive: 0xf5c862,
      emissiveMap: ringTex,
      emissiveIntensity: 1.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, this.ringMat);
    ringMesh.position.y = -0.7;
    this.group.add(ringMesh);

    // 4. Upper rim lip
    const upperLipGeo = new THREE.CylinderGeometry(this.radius, this.radius + 0.5, 0.3, 64);
    const upperLipMesh = new THREE.Mesh(upperLipGeo, goldBevelMat);
    upperLipMesh.position.y = 0.35;
    this.group.add(upperLipMesh);

    // 5. Plinth top surface (earthy dark bed underneath voxels)
    const topGeo = new THREE.CylinderGeometry(this.radius, this.radius, 0.2, 64);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x1f232e,
      roughness: 0.9,
      metalness: 0.1
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.25;
    topMesh.receiveShadow = true;
    this.group.add(topMesh);
  }

  createElvishTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Dark background
    ctx.fillStyle = '#0f1118';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Golden border lines
    ctx.strokeStyle = '#d4a84d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(canvas.width, 8);
    ctx.moveTo(0, canvas.height - 8);
    ctx.lineTo(canvas.width, canvas.height - 8);
    ctx.stroke();

    // Elvish Tengwar Ring Poem in ornate calligraphy representation
    ctx.font = 'italic 34px Georgia, "Cinzel", serif';
    ctx.fillStyle = '#ffdf78';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Repeating Black Speech inscription translated to Tengwar script / poetic transcription
    const poem = "•  Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk agh burzum-ishi krimpatul  •  One Ring to rule them all, One Ring to find them  ";
    ctx.fillText(poem, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    this.tengwarTexture = texture;
    return texture;
  }

  update(delta, time) {
    if (this.tengwarTexture) {
      // Gently scroll the glowing Elvish runes around the pedestal
      this.tengwarTexture.offset.x += delta * 0.015;
    }
    if (this.ringMat) {
      // Breathing golden pulse
      this.ringMat.emissiveIntensity = 1.4 + Math.sin(time * 2.0) * 0.5;
    }
  }
}
