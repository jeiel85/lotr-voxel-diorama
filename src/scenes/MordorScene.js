/**
 * Barad-dûr, Mount Doom & Eye of Sauron (모르도르와 사우론의 눈) Voxel Scene Builder
 */
export function buildMordorScene(world) {
  world.clear();

  // Color Palette Constants
  const C_OBSIDIAN = 0x0f1117;
  const C_CHARRED_ROCK = 0x1c1f26;
  const C_BASALT = 0x2b2f3a;
  const C_DARK_SPIRE = 0x141720;
  const C_SPIRE_TRIM = 0x3d4352;
  const C_LAVA_CORE = 0xfff066;  // Emissive bright yellow
  const C_LAVA_FLOW = 0xff5500;  // Emissive bright orange
  const C_LAVA_CRUST = 0xbd1e0d; // Emissive dark magma
  const C_ASH = 0x5a5d66;
  const C_SMOKE_DARK = 0x22242b;
  const C_EYE_PUPIL = 0x050508;
  const C_EYE_YELLOW = 0xffe600;
  const C_EYE_ORANGE = 0xff5a00;
  const C_EYE_RED = 0xcc1100;

  const radius = 17;

  // 1. Jagged Volcanic Base
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const distSq = x * x + z * z;
      if (distSq <= radius * radius) {
        world.setVoxel(x, 1, z, C_OBSIDIAN);
        world.setVoxel(x, 2, z, C_CHARRED_ROCK);
      }
    }
  }

  // 2. Craggy Volcanic Terrain & Lava Channels
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const distSq = x * x + z * z;
      if (distSq > radius * radius) continue;

      // Base terrain noise
      const cragHeight = 2 + Math.floor((Math.sin(x * 0.4) + Math.cos(z * 0.4) + 2) * 1.2);

      for (let y = 3; y <= cragHeight; y++) {
        const hash = (x * 17 + z * 31 + y * 7) % 3;
        const rockCol = hash === 0 ? C_CHARRED_ROCK : (hash === 1 ? C_BASALT : C_OBSIDIAN);
        world.setVoxel(x, y, z, rockCol);
      }
    }
  }

  // 3. Winding Rivers of Glowing Lava
  // Lava flows from Mount Doom (left) carving across to the right pool
  const lavaPath = [
    [-11, 8, -4], [-10, 7, -3], [-9, 6, -3], [-8, 6, -2],
    [-7, 5, -1], [-6, 5, 0], [-5, 4, 1], [-4, 4, 2],
    [-3, 4, 3], [-2, 3, 4], [-1, 3, 5], [0, 3, 6],
    [1, 3, 7], [2, 3, 8], [3, 3, 9], [4, 3, 9],
    // Fork towards Barad-dûr moat
    [-3, 4, 1], [-2, 4, 0], [-1, 4, -1], [0, 4, -2],
    [1, 4, -3], [2, 4, -3], [3, 4, -2], [4, 3, -1],
    [5, 3, 0], [6, 3, 1], [7, 3, 2]
  ];

  lavaPath.forEach(([lx, ly, lz]) => {
    world.setVoxel(lx, ly, lz, C_LAVA_CORE, 'emissive');
    world.setVoxel(lx + 1, ly, lz, C_LAVA_FLOW, 'emissive');
    world.setVoxel(lx, ly, lz + 1, C_LAVA_FLOW, 'emissive');
    world.setVoxel(lx - 1, ly, lz, C_LAVA_CRUST, 'emissive');
    world.setVoxel(lx, ly, lz - 1, C_LAVA_CRUST, 'emissive');
  });

  // Lava pool at the center front
  for (let px = 1; px <= 6; px++) {
    for (let pz = 6; pz <= 11; pz++) {
      if (px * px + pz * pz <= 17 * 17) {
        const isCore = px >= 2 && px <= 4 && pz >= 7 && pz <= 9;
        const col = isCore ? C_LAVA_CORE : C_LAVA_FLOW;
        world.setVoxel(px, 3, pz, col, 'emissive');
      }
    }
  }

  // 4. Mount Doom (Orodruin) Volcanic Cone (Centered around x: -8, z: -3)
  for (let my = 3; my <= 18; my++) {
    const coneRadius = Math.max(1, Math.round(8 - (my - 3) * 0.48));
    for (let mx = -8 - coneRadius; mx <= -8 + coneRadius; mx++) {
      for (let mz = -3 - coneRadius; mz <= -3 + coneRadius; mz++) {
        const dSq = (mx - (-8)) ** 2 + (mz - (-3)) ** 2;
        if (dSq <= coneRadius * coneRadius) {
          // Hollow crater on top (y >= 16)
          if (my >= 16 && dSq < (coneRadius - 1.2) ** 2) {
            if (my === 16) {
              world.setVoxel(mx, my, mz, C_LAVA_CORE, 'emissive');
            }
          } else {
            world.setVoxel(mx, my, mz, C_BASALT);
          }
        }
      }
    }
  }

  // Cracks of Doom (Sammath Naur) Cavern Entrance & Cliff Walkway
  // Ledge jutting out at y = 11, x = -4, z = 0
  for (let lx = -6; lx <= -3; lx++) {
    for (let lz = -1; lz <= 2; lz++) {
      world.setVoxel(lx, 11, lz, C_CHARRED_ROCK);
    }
  }
  // Cavern opening with glowing fiery interior
  world.setVoxel(-6, 12, 0, C_LAVA_FLOW, 'emissive');
  world.setVoxel(-6, 12, 1, C_LAVA_CORE, 'emissive');
  world.setVoxel(-6, 13, 0, C_CHARRED_ROCK);
  world.setVoxel(-6, 13, 1, C_CHARRED_ROCK);

  // Billowing black volcanic smoke from Mount Doom
  const smokePuffs = [
    [-8, 19, -3], [-8, 20, -3], [-7, 21, -2], [-7, 22, -2],
    [-6, 23, -1], [-5, 24, 0], [-4, 25, 0], [-3, 26, 1],
    [-2, 27, 2], [-1, 28, 2]
  ];
  smokePuffs.forEach(([sx, sy, sz]) => {
    world.setVoxel(sx, sy, sz, C_SMOKE_DARK);
    world.setVoxel(sx + 1, sy, sz, C_ASH);
  });

  // 5. The Dark Tower of Barad-dûr (Centered at x = 7, z = -3)
  // Massive fortress foundation
  for (let y = 3; y <= 8; y++) {
    for (let bx = 3; bx <= 11; bx++) {
      for (let bz = -7; bz <= 1; bz++) {
        world.setVoxel(bx, y, bz, C_DARK_SPIRE);
      }
    }
  }

  // Gothic buttresses (angular support pillars)
  for (let y = 3; y <= 14; y++) {
    world.setVoxel(2, y, -3, C_SPIRE_TRIM);
    world.setVoxel(12, y, -3, C_SPIRE_TRIM);
    world.setVoxel(7, y, -8, C_SPIRE_TRIM);
    world.setVoxel(7, y, 2, C_SPIRE_TRIM);
  }

  // Main ascending tower shaft (y: 9 to 24)
  for (let ty = 9; ty <= 24; ty++) {
    const width = ty > 18 ? 2 : (ty > 14 ? 3 : 3);
    for (let tx = 7 - width; tx <= 7 + width; tx++) {
      for (let tz = -3 - width; tz <= -3 + width; tz++) {
        const isEdge = tx === 7 - width || tx === 7 + width || tz === -3 - width || tz === -3 + width;
        world.setVoxel(tx, ty, tz, isEdge ? C_SPIRE_TRIM : C_DARK_SPIRE);
      }
    }
  }

  // Upper pinnacle platform (y: 25-26)
  for (let px = 5; px <= 9; px++) {
    for (let pz = -5; pz <= -1; pz++) {
      world.setVoxel(px, 25, pz, C_DARK_SPIRE);
      world.setVoxel(px, 26, pz, C_SPIRE_TRIM);
    }
  }

  // Two massive curved crescent Horn Spires between which the Eye burns
  // Left horn (x: 4 to 5, ascending and curving inward)
  world.setVoxel(4, 27, -3, C_DARK_SPIRE);
  world.setVoxel(4, 28, -3, C_DARK_SPIRE);
  world.setVoxel(4, 29, -3, C_DARK_SPIRE);
  world.setVoxel(4, 30, -3, C_SPIRE_TRIM);
  world.setVoxel(5, 31, -3, C_SPIRE_TRIM);
  world.setVoxel(5, 32, -3, C_SPIRE_TRIM);
  world.setVoxel(6, 33, -3, C_SPIRE_TRIM); // Curved tip

  // Right horn (x: 9 to 10)
  world.setVoxel(10, 27, -3, C_DARK_SPIRE);
  world.setVoxel(10, 28, -3, C_DARK_SPIRE);
  world.setVoxel(10, 29, -3, C_DARK_SPIRE);
  world.setVoxel(10, 30, -3, C_SPIRE_TRIM);
  world.setVoxel(9, 31, -3, C_SPIRE_TRIM);
  world.setVoxel(9, 32, -3, C_SPIRE_TRIM);
  world.setVoxel(8, 33, -3, C_SPIRE_TRIM); // Curved tip

  // 6. THE GREAT EYE OF SAURON (Suspended at x = 7, y: 28-32, z = -3)
  // Vertical fiery slit pupil surrounded by blinding yellow/orange/crimson flame voxels!
  // Center pupil
  world.setVoxel(7, 29, -3, C_EYE_PUPIL);
  world.setVoxel(7, 30, -3, C_EYE_PUPIL);
  world.setVoxel(7, 31, -3, C_EYE_PUPIL);

  // Core brilliant yellow iris
  world.setVoxel(7, 29, -2, C_EYE_YELLOW, 'emissive');
  world.setVoxel(7, 30, -2, C_EYE_YELLOW, 'emissive');
  world.setVoxel(7, 31, -2, C_EYE_YELLOW, 'emissive');
  world.setVoxel(7, 29, -4, C_EYE_YELLOW, 'emissive');
  world.setVoxel(7, 30, -4, C_EYE_YELLOW, 'emissive');
  world.setVoxel(7, 31, -4, C_EYE_YELLOW, 'emissive');

  // Outer flaming corona (Intense emissive orange/red)
  const eyeCorona = [
    [6, 29, -3], [8, 29, -3],
    [6, 30, -3], [8, 30, -3],
    [6, 31, -3], [8, 31, -3],
    [7, 28, -3], [7, 32, -3],
    // Front flame projection
    [6, 30, -2], [8, 30, -2],
    [7, 28, -2], [7, 32, -2]
  ];
  eyeCorona.forEach(([ex, ey, ez], idx) => {
    const col = idx % 2 === 0 ? C_EYE_ORANGE : C_EYE_RED;
    world.setVoxel(ex, ey, ez, col, 'emissive');
  });

  // 7. Interactive Lore Hotspots
  world.addHotspot(7, 30.5, -2, {
    tag: 'BARAD-DÛR',
    title: '타오르는 사우론의 눈 (The Great Eye of Sauron)',
    subtitle: '암흑의 군주의 불면의 감시',
    desc: '바라두르 탑 꼭대기 두 개의 뿔 모양 첨탑 사이에 타오르는 거대한 불꽃의 눈입니다. 형태가 없는 사우론의 악의와 의지가 형상화된 것으로, 중간계 전역을 응시하며 절대반지를 찾고 있습니다.',
    quote: '"바라두르의 창문 없는 높은 첨탑 꼭대기에서, 잠들지 않는 불타는 붉은 눈이 번뜩이고 있었다."'
  });

  world.addHotspot(7, 16, -3, {
    tag: 'FORTRESS',
    title: '바라두르 암흑의 탑 (The Dark Tower of Barad-dûr)',
    subtitle: '사우론의 거대한 요새',
    desc: '절대반지의 힘으로 세워진 모르도르의 거대한 요새탑입니다. 아다만트 석재와 흑요석으로 지어졌으며, 반지가 파괴되기 전까지는 그 어떤 무기로도 무너뜨릴 수 없는 난공불락의 상징입니다.',
    quote: '"철과 돌로 지어진 공포의 탑, 절망의 왕관을 쓴 모르도르의 심장."'
  });

  world.addHotspot(-4, 12, 1, {
    tag: 'MOUNT DOOM',
    title: '운명의 산 & 삼마스 나우르 (Cracks of Doom)',
    subtitle: '절대반지가 만들어지고 파괴된 곳',
    desc: '오로드루인(Orodruin) 산의 화구 깊숙한 곳에 위치한 삼마스 나우르(운명의 균열)의 입구 절벽입니다. 제2시대에 사우론이 절대반지를 제련했던 곳이자, 프로도와 골룸의 마지막 사투가 벌어진 장소입니다.',
    quote: '"절대반지는 오직 그것이 벼려진 운명의 산 불길 속에서만 파괴될 수 있다."'
  });

  world.addHotspot(2, 3.5, 8, {
    tag: 'MORDOR',
    title: '모르도르의 끓는 용암 강 (Molten Magma Pools)',
    subtitle: '오로드루인의 화산 분출로 뒤덮인 대지',
    desc: '화산재와 유황 연기로 가득 찬 모르도르의 평원을 가로지르는 불타는 용암의 강입니다. 생명체가 살아갈 수 없는 척박한 암흑의 땅을 상징합니다.',
    quote: '"그림자가 드리운 땅, 어둠이 모든 것을 집어삼키는 모르도르."'
  });

  return world.build();
}
