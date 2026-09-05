/**
 * The Gates of Argonath (아르고나스의 거상) Voxel Scene Builder
 * Colossal stone king statues of Isildur & Anárion guarding the River Anduin
 */
export function buildArgonathScene(world) {
  world.clear();

  // Color Palette Constants
  const C_BEDROCK = 0x2e3038;
  const C_CLIFF_DARK = 0x424652;
  const C_CLIFF_MID = 0x585d6b;
  const C_CLIFF_LIGHT = 0x73798a;
  const C_STATUE_STONE = 0x666b7a;
  const C_STATUE_SHADOW = 0x4a4f5c;
  const C_STATUE_HIGHLIGHT = 0x828899;
  const C_CROWN_GOLD = 0x9c8a52; // Weathered golden granite
  const C_WATER_DEEP = 0x1f7375;
  const C_WATER_SHALLOW = 0x2ca89b;
  const C_WATER_FOAM = 0xebf7f6;
  const C_BOAT_WOOD = 0xba8c59;
  const C_BOAT_LIGHT = 0xd9ab77;
  const C_PINE_WOOD = 0x3d2919;
  const C_PINE_LEAVES = 0x24422e;

  const radius = 17;

  // 1. Base Strata
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const distSq = x * x + z * z;
      if (distSq <= radius * radius) {
        world.setVoxel(x, 1, z, C_BEDROCK);
      }
    }
  }

  // 2. River Anduin Channel (Running through center z: -17 to 17, x: -5 to 5)
  for (let x = -5; x <= 5; x++) {
    for (let z = -radius; z <= radius; z++) {
      if (x * x + z * z <= radius * radius) {
        world.setVoxel(x, 2, z, C_BEDROCK);

        const isCenter = Math.abs(x) <= 2;
        const waterCol = isCenter ? C_WATER_DEEP : C_WATER_SHALLOW;
        world.setVoxel(x, 3, z, waterCol, 'water');

        // Occasional water foam ripples
        if ((x * 11 + z * 23) % 7 === 0) {
          world.setVoxel(x, 3, z, C_WATER_FOAM, 'water');
        }
      }
    }
  }

  // 3. Canyon Cliffs flanking the River
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      if (x * x + z * z > radius * radius) continue;
      if (Math.abs(x) <= 5) continue; // Skip river bed

      // Slope upwards away from river
      const distFromRiver = Math.abs(x) - 5;
      const cliffHeight = Math.min(22, 4 + Math.round(distFromRiver * 1.8 + Math.sin(z * 0.5) * 2));

      for (let y = 2; y <= cliffHeight; y++) {
        const hash = (x * 13 + z * 29 + y * 7) % 3;
        const col = hash === 0 ? C_CLIFF_DARK : (hash === 1 ? C_CLIFF_MID : C_CLIFF_LIGHT);
        world.setVoxel(x, y, z, col);
      }

      // Sparse alpine pine trees on top of cliff edges
      if (distFromRiver >= 5 && (x * 17 + z * 19) % 21 === 0 && cliffHeight <= 20) {
        buildPineTree(world, x, cliffHeight + 1, z, C_PINE_WOOD, C_PINE_LEAVES);
      }
    }
  }

  // 4. Helper to build a Colossal King Statue (Isildur / Anárion)
  function buildKingStatue(isLeft) {
    const cx = isLeft ? -9 : 9;
    const cz = -2;
    const facingSign = isLeft ? 1 : -1; // Towards center/downstream

    // Massive Plinth Base on river bank (y: 3 to 6)
    for (let bx = cx - 3; bx <= cx + 3; bx++) {
      for (let bz = cz - 3; bz <= cz + 3; bz++) {
        for (let by = 3; by <= 6; by++) {
          world.setVoxel(bx, by, bz, C_STATUE_SHADOW);
        }
      }
    }

    // Robed lower body / throne plinth (y: 7 to 13)
    for (let ry = 7; ry <= 13; ry++) {
      for (let rx = cx - 2; rx <= cx + 2; rx++) {
        for (let rz = cz - 2; rz <= cz + 2; rz++) {
          const isOuter = rx === cx - 2 || rx === cx + 2 || rz === cz - 2 || rz === cz + 2;
          world.setVoxel(rx, ry, rz, isOuter ? C_STATUE_STONE : C_STATUE_SHADOW);
        }
      }
    }

    // Regal Torso and Stone Armor / Cuirass (y: 14 to 20)
    for (let ty = 14; ty <= 20; ty++) {
      for (let tx = cx - 2; tx <= cx + 2; tx++) {
        for (let tz = cz - 1; tz <= cz + 2; tz++) {
          world.setVoxel(tx, ty, tz, C_STATUE_STONE);
        }
      }
      // Stone mantle / cloak draping down the back
      for (let tx = cx - 2; tx <= cx + 2; tx++) {
        world.setVoxel(tx, ty, cz - 2, C_STATUE_SHADOW);
      }
    }

    // Left Statue (Isildur):
    // Left hand holds a massive stone axe/sceptre down by his side (x = cx - 2)
    // Right arm is thrust FORWARD high in a commanding warning gesture towards the river!
    if (isLeft) {
      // Weapon (Axe / Sceptre) in left hand
      for (let wy = 8; wy <= 22; wy++) {
        world.setVoxel(cx - 3, wy, cz, C_STATUE_HIGHLIGHT);
      }
      // Axe blade head at top
      world.setVoxel(cx - 4, 21, cz, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx - 4, 22, cz, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx - 4, 23, cz, C_STATUE_HIGHLIGHT);

      // Raised Right Arm stretching out over the river in a warning stop sign
      world.setVoxel(cx + 3, 19, cz + 1, C_STATUE_STONE);
      world.setVoxel(cx + 4, 19, cz + 2, C_STATUE_STONE);
      world.setVoxel(cx + 5, 20, cz + 3, C_STATUE_HIGHLIGHT);
      // Open hand palm facing downstream
      world.setVoxel(cx + 5, 20, cz + 4, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx + 5, 21, cz + 4, C_STATUE_HIGHLIGHT);
    } else {
      // Right Statue (Anárion):
      // Left arm thrust forward commanding halt!
      world.setVoxel(cx - 3, 19, cz + 1, C_STATUE_STONE);
      world.setVoxel(cx - 4, 19, cz + 2, C_STATUE_STONE);
      world.setVoxel(cx - 5, 20, cz + 3, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx - 5, 20, cz + 4, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx - 5, 21, cz + 4, C_STATUE_HIGHLIGHT);

      // Weapon in right hand
      for (let wy = 8; wy <= 22; wy++) {
        world.setVoxel(cx + 3, wy, cz, C_STATUE_HIGHLIGHT);
      }
      world.setVoxel(cx + 4, 21, cz, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx + 4, 22, cz, C_STATUE_HIGHLIGHT);
      world.setVoxel(cx + 4, 23, cz, C_STATUE_HIGHLIGHT);
    }

    // Stern Head & Face (y: 21 to 24)
    for (let hy = 21; hy <= 24; hy++) {
      for (let hx = cx - 1; hx <= cx + 1; hx++) {
        for (let hz = cz; hz <= cz + 2; hz++) {
          world.setVoxel(hx, hy, hz, C_STATUE_STONE);
        }
      }
    }
    // Stone beard
    world.setVoxel(cx, 21, cz + 3, C_STATUE_SHADOW);
    world.setVoxel(cx - 1, 21, cz + 3, C_STATUE_SHADOW);
    world.setVoxel(cx + 1, 21, cz + 3, C_STATUE_SHADOW);

    // Stone Helm & High Crown of Gondor (y: 25 to 28)
    for (let cy = 25; cy <= 27; cy++) {
      for (let hx = cx - 1; hx <= cx + 1; hx++) {
        for (let hz = cz; hz <= cz + 2; hz++) {
          world.setVoxel(hx, cy, hz, C_CROWN_GOLD);
        }
      }
    }
    // Crown peak spire
    world.setVoxel(cx, 28, cz + 1, C_CROWN_GOLD);
    world.setVoxel(cx, 29, cz + 1, C_CROWN_GOLD);
  }

  // Build both colossal monarch statues!
  buildKingStatue(true);  // Isildur (Left)
  buildKingStatue(false); // Anárion (Right)

  // 5. The Fellowship's Small Elven Boat (On the river at z = 7, drifting downstream)
  const boatZ = 7;
  // Hull
  for (let bz = boatZ - 3; bz <= boatZ + 3; bz++) {
    world.setVoxel(0, 3, bz, C_BOAT_WOOD);
    world.setVoxel(-1, 4, bz, C_BOAT_WOOD);
    world.setVoxel(1, 4, bz, C_BOAT_WOOD);
  }
  // Pointed prow & stern
  world.setVoxel(0, 4, boatZ - 4, C_BOAT_LIGHT);
  world.setVoxel(0, 5, boatZ - 4, C_BOAT_LIGHT);
  world.setVoxel(0, 4, boatZ + 4, C_BOAT_LIGHT);
  world.setVoxel(0, 5, boatZ + 4, C_BOAT_LIGHT);

  // Tiny voxel Aragorn / Frodo in boat
  // Aragorn at stern (dark ranger coat)
  world.setVoxel(0, 4, boatZ - 1, 0x334433);
  world.setVoxel(0, 5, boatZ - 1, 0x222a22);
  world.setVoxel(0, 6, boatZ - 1, 0x4a3728); // Hair
  // Frodo at center looking up
  world.setVoxel(0, 4, boatZ + 1, 0x755938);
  world.setVoxel(0, 5, boatZ + 1, 0x364d36); // Cloak of Lórien

  // 6. Interactive Lore Hotspots
  world.addHotspot(-4, 20.5, 2, {
    tag: 'THE ARGONATH',
    title: '이실두르의 거상 (Statue of Isildur)',
    subtitle: '누메노르의 후예, 곤도르의 위대한 왕',
    desc: '안두인 강 서쪽 절벽에 세워진 거대한 석상입니다. 엘렌딜의 아들이자 사우론의 손가락을 자르고 절대반지를 차지했던 전설적인 왕 이실두르의 모습을 영원한 돌로 새겨 놓았습니다.',
    quote: '"두 거인의 발치에 이르렀을 때, 원정대는 그 압도적인 위엄 앞에 숨을 들이켰다."'
  });

  world.addHotspot(4, 20.5, 2, {
    tag: 'THE ARGONATH',
    title: '아나리온의 거상 (Statue of Anárion)',
    subtitle: '왕들의 기둥 (The Pillars of the Kings)',
    desc: '강 동쪽 절벽에 세워진 아나리온 왕의 석상입니다. 왼손을 거대하게 앞으로 뻗어 곤도르 왕국의 국경을 침범하려는 모든 악의 무리들에게 멈추라는 준엄한 경고를 보내고 있습니다.',
    quote: '"두 왕의 엄숙한 얼굴은 북쪽을 향해 끝없는 영겁의 세월 동안 경계의 눈길을 보내고 있었다."'
  });

  world.addHotspot(0, 4.5, 7, {
    tag: 'FELLOWSHIP',
    title: '반지원정대의 나룻배 (The Fellowship Boats)',
    subtitle: '로스로리엔을 떠나 남쪽으로 향하는 여정',
    desc: '갈라드리엘 여왕이 하사한 가볍고 튼튼한 요정의 배를 타고 안두인 대하를 내려오는 프로도와 아라곤 일행입니다. 거대한 두 왕의 발치를 지나며 아라곤은 자신의 혈통과 운명을 직면합니다.',
    quote: '"두려워 마라! 나는 엘렌딜의 아들 이실두르의 후손, 아라곤이다."'
  });

  world.addHotspot(0, 3.5, -6, {
    tag: 'MIDDLE-EARTH',
    title: '대하 안두인 (The Great River Anduin)',
    subtitle: '중간계에서 가장 길고 유서 깊은 강',
    desc: '안개산맥의 북쪽에서 발원하여 남쪽 벨레가에르 대해까지 1,400마일에 걸쳐 흐르는 중간계의 대동맥입니다. 엘프와 인간의 수많은 역사와 문명이 이 강을 따라 꽃피웠습니다.',
    quote: '"은빛으로 굽이쳐 흐르는 위대한 강, 모든 비밀을 품고 바다로 향한다."'
  });

  return world.build();
}

// Pine Tree Builder helper
function buildPineTree(world, tx, ty, tz, woodCol, leafCol) {
  // Trunk
  for (let y = ty; y <= ty + 4; y++) {
    world.setVoxel(tx, y, tz, woodCol);
  }
  // Layered conical pine foliage
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      if (Math.abs(dx) + Math.abs(dz) <= 3) {
        world.setVoxel(tx + dx, ty + 2, tz + dz, leafCol, 'foliage');
      }
    }
  }
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      world.setVoxel(tx + dx, ty + 3, tz + dz, leafCol, 'foliage');
      world.setVoxel(tx + dx, ty + 4, tz + dz, leafCol, 'foliage');
    }
  }
  world.setVoxel(tx, ty + 5, tz, leafCol, 'foliage');
}
