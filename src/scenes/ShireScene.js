/**
 * Bag End, The Shire (샤이어 호빗골 백엔드) Voxel Scene Builder
 */
export function buildShireScene(world) {
  world.clear();

  // Color Palette Constants
  const C_BEDROCK = 0x3a3b40;
  const C_DIRT_DARK = 0x422a18;
  const C_DIRT_MID = 0x5e3c23;
  const C_GRASS_TOP = 0x4f872c;
  const C_GRASS_LIGHT = 0x62a837;
  const C_GRASS_DARK = 0x3b6621;
  const C_PATH = 0x9c9384;
  const C_PATH_ACCENT = 0xb5ab98;
  const C_WOOD_DARK = 0x382212;
  const C_WOOD_MID = 0x5c391e;
  const C_WOOD_LIGHT = 0x8a5b35;
  const C_DOOR_GREEN = 0x22663b;
  const C_DOOR_DARK = 0x174728;
  const C_BRASS = 0xffd13b;
  const C_WINDOW_GLOW = 0xffe28a;
  const C_CHIMNEY = 0x6b6864;
  const C_SMOKE = 0xe8edf2;
  const C_FENCE = 0x734a26;
  const C_LEAF_1 = 0x367a24;
  const C_LEAF_2 = 0x469430;
  const C_LEAF_3 = 0x27591a;
  const C_LEAF_BRIGHT = 0x6bb847;
  const C_WATER = 0x3283a8;

  // 1. Base Island Foundation & Strata (Circular / Oval slice)
  const radius = 17;
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const distSq = x * x + z * z;
      if (distSq <= radius * radius) {
        // Bedrock layer
        world.setVoxel(x, 1, z, C_BEDROCK);
        // Dirt layers
        world.setVoxel(x, 2, z, C_DIRT_DARK);
        world.setVoxel(x, 3, z, C_DIRT_MID);
      }
    }
  }

  // 2. Rolling Shire Hill & Topography
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const distSq = x * x + z * z;
      if (distSq > radius * radius) continue;

      // Hill equation: higher towards center-back (x: -2 to 6, z: -8 to 2)
      const dx = x - 1;
      const dz = z + 2;
      const hillDist = Math.sqrt(dx * dx + dz * dz);
      
      let hillHeight = Math.max(3, Math.round(11 - (hillDist * 0.55)));
      // Flatten the front yard area for the path and garden
      if (z > 4) {
        hillHeight = Math.min(hillHeight, 4);
      } else if (z > 1 && Math.abs(x) < 7) {
        hillHeight = Math.min(hillHeight, 5); // Front porch terrace
      }

      for (let y = 4; y <= hillHeight; y++) {
        if (y === hillHeight) {
          // Top grass with organic shade variation
          const rand = (x * 13 + z * 37) % 5;
          const grassCol = rand === 0 ? C_GRASS_LIGHT : (rand === 1 ? C_GRASS_DARK : C_GRASS_TOP);
          world.setVoxel(x, y, z, grassCol, 'foliage');
        } else {
          world.setVoxel(x, y, z, C_DIRT_MID);
        }
      }
    }
  }

  // 3. Hobbit Hole Front Facade (Bag End Front Wall dug into hill at z = 2)
  // Wall frame
  for (let x = -6; x <= 6; x++) {
    for (let y = 4; y <= 9; y++) {
      world.setVoxel(x, y, 2, C_WOOD_DARK);
    }
  }

  // Iconic Circular Green Door (centered at x = 0, y: 5-8)
  world.setVoxel(-1, 5, 2, C_DOOR_GREEN);
  world.setVoxel(0, 5, 2, C_DOOR_GREEN);
  world.setVoxel(1, 5, 2, C_DOOR_GREEN);

  world.setVoxel(-2, 6, 2, C_DOOR_GREEN);
  world.setVoxel(-1, 6, 2, C_DOOR_DARK);
  world.setVoxel(0, 6, 2, C_DOOR_GREEN);
  world.setVoxel(1, 6, 2, C_DOOR_DARK);
  world.setVoxel(2, 6, 2, C_DOOR_GREEN);

  world.setVoxel(-2, 7, 2, C_DOOR_GREEN);
  world.setVoxel(-1, 7, 2, C_DOOR_DARK);
  world.setVoxel(0, 7, 2, C_BRASS, 'metallic'); // Exact Center Brass Knob!
  world.setVoxel(1, 7, 2, C_DOOR_DARK);
  world.setVoxel(2, 7, 2, C_DOOR_GREEN);

  world.setVoxel(-2, 8, 2, C_DOOR_GREEN);
  world.setVoxel(-1, 8, 2, C_DOOR_DARK);
  world.setVoxel(0, 8, 2, C_DOOR_GREEN);
  world.setVoxel(1, 8, 2, C_DOOR_DARK);
  world.setVoxel(2, 8, 2, C_DOOR_GREEN);

  world.setVoxel(-1, 9, 2, C_DOOR_GREEN);
  world.setVoxel(0, 9, 2, C_DOOR_GREEN);
  world.setVoxel(1, 9, 2, C_DOOR_GREEN);

  // Left Circular Window (x = -4, y: 6-8) with warm interior glow
  world.setVoxel(-4, 6, 2, C_WINDOW_GLOW, 'emissive');
  world.setVoxel(-4, 7, 2, C_WOOD_MID); // Window pane frame
  world.setVoxel(-4, 8, 2, C_WINDOW_GLOW, 'emissive');
  world.setVoxel(-5, 7, 2, C_WINDOW_GLOW, 'emissive');
  world.setVoxel(-3, 7, 2, C_WINDOW_GLOW, 'emissive');

  // Right Circular Window (x = 4, y: 6-8)
  world.setVoxel(4, 6, 2, C_WINDOW_GLOW, 'emissive');
  world.setVoxel(4, 7, 2, C_WOOD_MID);
  world.setVoxel(4, 8, 2, C_WINDOW_GLOW, 'emissive');
  world.setVoxel(3, 7, 2, C_WINDOW_GLOW, 'emissive');
  world.setVoxel(5, 7, 2, C_WINDOW_GLOW, 'emissive');

  // Front Porch Lantern (warm glowing lantern above door)
  world.setVoxel(0, 10, 3, C_WOOD_DARK);
  world.setVoxel(0, 9, 3, 0xffbb44, 'emissive');

  // 4. Cobblestone Path winding from Door to Front Gate
  const pathCoords = [
    [0, 4, 3], [0, 4, 4], [1, 4, 4], [1, 4, 5], [2, 4, 6],
    [2, 4, 7], [1, 4, 8], [0, 4, 9], [-1, 4, 10], [-2, 4, 11],
    [-2, 4, 12], [-1, 4, 13], [0, 4, 14], [0, 4, 15]
  ];
  pathCoords.forEach(([px, py, pz], idx) => {
    const col = idx % 2 === 0 ? C_PATH : C_PATH_ACCENT;
    world.setVoxel(px, py, pz, col);
    world.setVoxel(px + 1, py, pz, col);
  });

  // 5. Stone Chimney with Animated Rising Smoke Puffs
  for (let cy = 9; cy <= 14; cy++) {
    world.setVoxel(4, cy, -3, C_CHIMNEY);
    world.setVoxel(5, cy, -3, C_CHIMNEY);
    world.setVoxel(4, cy, -2, C_CHIMNEY);
    world.setVoxel(5, cy, -2, C_CHIMNEY);
  }
  // Smoke puffs floating upward
  world.setVoxel(4, 15, -3, C_SMOKE);
  world.setVoxel(5, 16, -2, C_SMOKE);
  world.setVoxel(5, 17, -1, C_SMOKE);
  world.setVoxel(6, 18, 0, C_SMOKE);
  world.setVoxel(6, 19, 1, C_SMOKE);
  world.setVoxel(7, 20, 2, C_SMOKE);

  // 6. The Great Oak Tree on Top of Bag End (Rooted at x = -2, z = -3, y = 10)
  // Gnarled Trunk
  for (let ty = 10; ty <= 17; ty++) {
    world.setVoxel(-2, ty, -3, C_WOOD_DARK);
    world.setVoxel(-1, ty, -3, C_WOOD_MID);
    world.setVoxel(-2, ty, -2, C_WOOD_MID);
    world.setVoxel(-1, ty, -2, C_WOOD_DARK);
  }
  // Branches spreading outward
  world.setVoxel(-3, 15, -3, C_WOOD_DARK);
  world.setVoxel(-4, 16, -4, C_WOOD_MID);
  world.setVoxel(0, 16, -2, C_WOOD_DARK);
  world.setVoxel(1, 17, -1, C_WOOD_MID);
  world.setVoxel(-2, 17, -1, C_WOOD_DARK);
  world.setVoxel(-2, 18, 0, C_WOOD_MID);

  // Volumetric Canopy of Leaves (Multiple overlapping leafy spheres)
  const leafClusters = [
    [-2, 18, -3, 5],
    [-4, 17, -4, 4],
    [1, 18, -1, 4],
    [-2, 19, 0, 4],
    [-1, 21, -2, 4],
    [2, 17, -4, 3],
    [-5, 16, -1, 3]
  ];

  leafClusters.forEach(([cx, cy, cz, rad]) => {
    for (let lx = cx - rad; lx <= cx + rad; lx++) {
      for (let ly = cy - rad; ly <= cy + rad; ly++) {
        for (let lz = cz - rad; lz <= cz + rad; lz++) {
          const dSq = (lx - cx) ** 2 + (ly - cy) ** 2 + (lz - cz) ** 2;
          if (dSq <= rad * rad) {
            // Organic color variation
            const hash = (lx * 7 + ly * 19 + lz * 31) % 4;
            const lCol = hash === 0 ? C_LEAF_BRIGHT : (hash === 1 ? C_LEAF_1 : (hash === 2 ? C_LEAF_2 : C_LEAF_3));
            world.setVoxel(lx, ly, lz, lCol, 'foliage');
          }
        }
      }
    }
  });

  // 7. Garden Details: Rustic Wooden Fence & Gate
  for (let fx = -8; fx <= 6; fx += 2) {
    if (fx === 0) continue; // Entrance gap
    world.setVoxel(fx, 5, 12, C_FENCE);
    world.setVoxel(fx + 1, 5, 12, C_WOOD_LIGHT);
  }

  // 8. Garden Bench and Picnic Afternoon Tea Table
  // Bench (x = -4, z = 5)
  world.setVoxel(-4, 5, 5, C_WOOD_MID);
  world.setVoxel(-3, 5, 5, C_WOOD_MID);
  world.setVoxel(-4, 6, 4, C_WOOD_DARK);
  world.setVoxel(-3, 6, 4, C_WOOD_DARK);

  // Table (x = 4, z = 6)
  world.setVoxel(4, 5, 6, C_WOOD_LIGHT);
  world.setVoxel(5, 5, 6, C_WOOD_LIGHT);
  // Cheese wheel on table
  world.setVoxel(4, 6, 6, 0xffd23f);
  // Fresh loaf of bread
  world.setVoxel(5, 6, 6, 0xb86c2d);
  // Cider / Ale mug
  world.setVoxel(4, 6, 5, 0x8a5530);

  // 9. Flower Garden (Poppies, Daisies, Lavender)
  const flowers = [
    [-6, 5, 5, 0xef233c], [-6, 5, 6, 0xffb703], [-5, 5, 7, 0x7209b7],
    [-7, 5, 8, 0xef233c], [-4, 5, 9, 0xffb703], [-5, 5, 10, 0x4361ee],
    [5, 5, 8, 0xef233c], [6, 5, 7, 0xffb703], [7, 5, 9, 0x7209b7],
    [6, 5, 10, 0xffb703], [3, 5, 10, 0x4361ee], [2, 5, 11, 0xef233c]
  ];
  flowers.forEach(([fx, fy, fz, fcol]) => {
    world.setVoxel(fx, fy, fz, fcol, 'foliage');
  });

  // 10. Miniature Voxel Bilbo / Frodo Baggins (Standing near front path, holding the One Ring!)
  const charX = 2;
  const charZ = 5;
  // Hairy feet
  world.setVoxel(charX, 5, charZ, 0xc4976c);
  world.setVoxel(charX + 1, 5, charZ, 0xc4976c);
  // Beige trousers
  world.setVoxel(charX, 6, charZ, 0xab9370);
  world.setVoxel(charX + 1, 6, charZ, 0xab9370);
  // Yellow waistcoat & Green coat
  world.setVoxel(charX, 7, charZ, 0xd49b28);
  world.setVoxel(charX + 1, 7, charZ, 0x225c2b);
  world.setVoxel(charX - 1, 7, charZ, 0x225c2b); // Coat arm
  world.setVoxel(charX + 2, 7, charZ, 0x225c2b); // Outstretched arm
  // Bilbo's face
  world.setVoxel(charX, 8, charZ, 0xf0be90);
  world.setVoxel(charX + 1, 8, charZ, 0xf0be90);
  // Brown curly hair
  world.setVoxel(charX, 9, charZ, 0x472813);
  world.setVoxel(charX + 1, 9, charZ, 0x472813);
  world.setVoxel(charX - 1, 8, charZ, 0x472813);
  world.setVoxel(charX + 2, 8, charZ, 0x472813);
  // Outstretched Hand holding THE ONE RING (Bright glowing golden emissive voxel!)
  world.setVoxel(charX + 3, 7, charZ + 1, 0xffea00, 'emissive');

  // 11. Interactive Lore Hotspots
  world.addHotspot(0, 7.5, 2.5, {
    tag: 'THE SHIRE',
    title: '골목쟁이네 둥근 초록 문 (The Green Round Door)',
    subtitle: '백엔드 (Bag End)의 상징적인 입구',
    desc: '완벽하게 둥글고 밝은 황동 손잡이가 정중앙에 달린 문입니다. "용무가 없는 자는 사절함(No Admittance Except on Party Business)"이라는 팻말이 걸리기도 했던 호빗들의 정겨운 안식처입니다.',
    quote: '"안락한 의자와 맛있는 차, 그리고 따뜻한 난롯가가 있는 곳."'
  });

  world.addHotspot(-2, 20, -2, {
    tag: 'THE HILL',
    title: '백엔드의 거대한 참나무 (The Great Oak)',
    subtitle: '호빗골 언덕 정상에 우뚝 솟은 고목',
    desc: '백엔드 지붕 언덕 위로 깊게 뿌리를 내린 고목입니다. 푸른 잎이 무성하게 그늘을 드리우며 샤이어 호빗골 전체를 한눈에 굽어볼 수 있는 명소입니다.',
    quote: '"참나무 가지 사이로 샤이어의 푸른 들판과 평화로운 연기가 보인다."'
  });

  world.addHotspot(charX + 3, 7.5, charZ + 1, {
    tag: 'THE RING',
    title: '절대반지 (The One Ring)',
    subtitle: '사우론의 힘이 담긴 지배의 반지',
    desc: '골목쟁이네 빌보가 안개산맥의 골룸에게서 얻어 백엔드로 가져온 순금 반지입니다. 불 속에 던져야만 드러나는 요정어 비문이 숨겨져 있습니다.',
    quote: '"모든 반지를 지배하고, 모든 반지를 발견하며, 모든 반지를 불러모아 암흑 속에 가두리라."'
  });

  world.addHotspot(4, 15, -2.5, {
    tag: 'COMFORT',
    title: '따스한 난로 굴뚝 (Smoking Chimney)',
    subtitle: '하루 7번의 식사가 준비되는 호빗의 주방',
    desc: '아침, 두 번째 아침, 오전 열한 시 간식, 점심, 애프터눈 티, 저녁, 야식까지! 호빗의 삶에서 가장 중요한 음식들이 조리되며 피어오르는 정겨운 연기입니다.',
    quote: '"호빗에게 있어 가장 중요한 일은 배를 든든하게 채우는 것이다."'
  });

  // Build the meshes
  return world.build();
}
