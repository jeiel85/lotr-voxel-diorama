import * as THREE from 'three';

/**
 * High-performance Voxel World Renderer for Three.js
 * Uses InstancedMesh categorized by material type for 60+ FPS rendering.
 */
export class VoxelWorld {
  constructor(scene) {
    this.scene = scene;
    this.voxels = new Map(); // key: "x,y,z" -> { x, y, z, color, type, originalPos }
    this.instancedMeshes = new Map();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Animation states
    this.isAssembling = false;
    this.assembleProgress = 1.0;
    this.assembleDuration = 1.6;
    this.assembleTimer = 0;
    this.instanceData = []; // Array of voxel metadata for animation

    // Slice clipping plane
    this.sliceHeight = 1000;
    this.maxVoxelY = 30;
    this.minVoxelY = 0;

    // Hotspots data
    this.hotspots = [];

    // Shared Box Geometry with slight bevel/gap to give that signature MagicaVoxel look
    this.boxGeometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);

    // Base materials
    this.initMaterials();
  }

  initMaterials() {
    this.materials = {
      solid: new THREE.MeshStandardMaterial({
        roughness: 0.65,
        metalness: 0.05,
        flatShading: true
      }),
      foliage: new THREE.MeshStandardMaterial({
        roughness: 0.8,
        metalness: 0.02,
        flatShading: true
      }),
      emissive: new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.1,
        emissiveIntensity: 3.0,
        flatShading: true
      }),
      metallic: new THREE.MeshStandardMaterial({
        roughness: 0.25,
        metalness: 0.85,
        flatShading: true
      }),
      water: new THREE.MeshStandardMaterial({
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
        flatShading: true
      })
    };
  }

  clear() {
    // Remove existing instanced meshes
    this.instancedMeshes.forEach(mesh => {
      this.group.remove(mesh);
      mesh.geometry.dispose();
    });
    this.instancedMeshes.clear();
    this.voxels.clear();
    this.instanceData = [];
    this.hotspots = [];
    this.isAssembling = false;
    this.assembleProgress = 1.0;
  }

  setVoxel(x, y, z, colorHex, type = 'solid') {
    const key = `${Math.round(x)},${Math.round(y)},${Math.round(z)}`;
    const rx = Math.round(x);
    const ry = Math.round(y);
    const rz = Math.round(z);

    this.voxels.set(key, {
      x: rx,
      y: ry,
      z: rz,
      color: new THREE.Color(colorHex),
      type: type
    });

    if (ry > this.maxVoxelY) this.maxVoxelY = ry;
    if (ry < this.minVoxelY) this.minVoxelY = ry;
  }

  fillBox(minX, minY, minZ, maxX, maxY, maxZ, colorHex, type = 'solid') {
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          this.setVoxel(x, y, z, colorHex, type);
        }
      }
    }
  }

  fillCylinder(cx, cz, minY, maxY, radius, colorHex, type = 'solid') {
    const rSq = radius * radius;
    for (let y = minY; y <= maxY; y++) {
      for (let x = cx - radius; x <= cx + radius; x++) {
        for (let z = cz - radius; z <= cz + radius; z++) {
          const dx = x - cx;
          const dz = z - cz;
          if (dx * dx + dz * dz <= rSq) {
            this.setVoxel(x, y, z, colorHex, type);
          }
        }
      }
    }
  }

  fillSphere(cx, cy, cz, radius, colorHex, type = 'solid') {
    const rSq = radius * radius;
    for (let x = cx - radius; x <= cx + radius; x++) {
      for (let y = cy - radius; y <= cy + radius; y++) {
        for (let z = cz - radius; z <= cz + radius; z++) {
          const dx = x - cx;
          const dy = y - cy;
          const dz = z - cz;
          if (dx * dx + dy * dy + dz * dz <= rSq) {
            this.setVoxel(x, y, z, colorHex, type);
          }
        }
      }
    }
  }

  addHotspot(x, y, z, data) {
    this.hotspots.push({
      position: new THREE.Vector3(x, y, z),
      data: data
    });
  }

  build() {
    // Group voxels by material type
    const byType = new Map();
    Object.keys(this.materials).forEach(t => byType.set(t, []));

    this.voxels.forEach(v => {
      const list = byType.get(v.type) || byType.get('solid');
      list.push(v);
    });

    const dummy = new THREE.Object3D();
    this.instanceData = [];

    byType.forEach((list, type) => {
      if (list.length === 0) return;

      const mat = this.materials[type];
      const instMesh = new THREE.InstancedMesh(this.boxGeometry, mat, list.length);
      instMesh.castShadow = true;
      instMesh.receiveShadow = true;

      list.forEach((v, i) => {
        dummy.position.set(v.x, v.y, v.z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();

        instMesh.setMatrixAt(i, dummy.matrix);
        instMesh.setColorAt(i, v.color);

        // If emissive material, set custom emissive multiplier
        if (type === 'emissive') {
          // Three.js InstancedMesh emissive inherits from color
          mat.emissive = new THREE.Color(0xffffff);
          mat.emissiveIntensity = 2.2;
        }

        // Store animation offsets for magic assemble effect
        const randomSkyY = 40 + Math.random() * 35;
        const randomSpreadX = (Math.random() - 0.5) * 20;
        const randomSpreadZ = (Math.random() - 0.5) * 20;
        const delay = Math.random() * 0.4 + (v.y / 40) * 0.4;

        this.instanceData.push({
          mesh: instMesh,
          index: i,
          targetPos: new THREE.Vector3(v.x, v.y, v.z),
          startPos: new THREE.Vector3(v.x + randomSpreadX, v.y + randomSkyY, v.z + randomSpreadZ),
          delay: delay,
          color: v.color,
          y: v.y
        });
      });

      instMesh.instanceMatrix.needsUpdate = true;
      if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;

      this.instancedMeshes.set(type, instMesh);
      this.group.add(instMesh);
    });

    return this.voxels.size;
  }

  triggerAssembleAnimation() {
    this.isAssembling = true;
    this.assembleProgress = 0;
    this.assembleTimer = 0;
  }

  setSliceHeight(percent) {
    // percent is 10 to 100
    const range = this.maxVoxelY - this.minVoxelY;
    const cutoffY = this.minVoxelY + (range * percent) / 100;
    const dummy = new THREE.Object3D();

    this.instanceData.forEach(item => {
      const isVisible = item.y <= cutoffY;
      item.mesh.getMatrixAt(item.index, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      if (isVisible) {
        dummy.scale.set(1, 1, 1);
      } else {
        dummy.scale.set(0.0001, 0.0001, 0.0001);
      }
      dummy.updateMatrix();
      item.mesh.setMatrixAt(item.index, dummy.matrix);
    });

    this.instancedMeshes.forEach(mesh => {
      mesh.instanceMatrix.needsUpdate = true;
    });
  }

  update(delta, time) {
    // Animate assemble effect
    if (this.isAssembling) {
      this.assembleTimer += delta;
      const progress = Math.min(1.0, this.assembleTimer / this.assembleDuration);
      const dummy = new THREE.Object3D();

      this.instanceData.forEach(item => {
        // Individual progress with staggered delay
        const itemProgress = Math.max(0, Math.min(1.0, (progress - item.delay) / (1.0 - item.delay)));
        
        // Elastic bounce easing
        const t = itemProgress;
        const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3));

        dummy.position.lerpVectors(item.startPos, item.targetPos, ease);
        const s = Math.min(1, ease * 1.2);
        dummy.scale.set(s, s, s);
        dummy.rotation.set((1 - ease) * 2, (1 - ease) * 3, 0);
        dummy.updateMatrix();

        item.mesh.setMatrixAt(item.index, dummy.matrix);
      });

      this.instancedMeshes.forEach(mesh => {
        mesh.instanceMatrix.needsUpdate = true;
      });

      if (progress >= 1.0) {
        this.isAssembling = false;
        // Snap all precisely
        this.instanceData.forEach(item => {
          dummy.position.copy(item.targetPos);
          dummy.scale.set(1, 1, 1);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          item.mesh.setMatrixAt(item.index, dummy.matrix);
        });
        this.instancedMeshes.forEach(mesh => {
          mesh.instanceMatrix.needsUpdate = true;
        });
      }
    }

    // Gentle emissive pulsing for lava/eye/ring
    if (this.materials.emissive) {
      const pulse = 2.0 + Math.sin(time * 3.5) * 0.5 + Math.cos(time * 7) * 0.2;
      this.materials.emissive.emissiveIntensity = pulse;
    }
  }
}
