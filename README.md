# 💍 The Lord of the Rings - 3D Voxel Diorama
> **반지의 제왕 3D 복셀 디오라마 인터랙티브 웹 애플리케이션**  
> *A high-performance interactive 3D Voxel Diorama celebrating Tolkien's Middle-earth, built with Three.js and Vite.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-f5c862?style=for-the-badge&logo=github&logoColor=black)](https://jeiel85.github.io/lotr-voxel-diorama/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

👉 **라이브 데모 체험하기**: [https://jeiel85.github.io/lotr-voxel-diorama/](https://jeiel85.github.io/lotr-voxel-diorama/)

---

## 🌟 Overview (개요)

J.R.R. 톨킨의 위대한 판타지 명작 **《반지의 제왕(The Lord of the Rings)》** 속 가장 상징적인 세 가지 명장면을 정교한 복셀 아트(Voxel Art)와 3D 인터랙티브 기술로 재현한 프로젝트입니다.

대규모 복셀 블록을 단 몇 번의 드로우 콜로 렌더링하는 `InstancedMesh` 최적화 엔진, 엘프어 절대반지 비문이 새겨진 턴테이블 받침대, 주/야간 조명 및 언리얼 블룸(Unreal Bloom), 절차적 웹 오디오 사운드스케이프를 탑재하여 살아 숨 쉬는 중간계 디오라마를 탐험할 수 있습니다.

---

## 🌿 Iconic Scenes (3대 시그니처 장면)

### 1. 🌿 샤이어 호빗골 (Bag End, The Shire)
- **골목쟁이네 백엔드**: 완벽한 원형의 초록색 문, 정중앙의 황동 손잡이, 온화한 주황빛 창문 격자
- **거대한 참나무 (The Great Oak)**: 언덕 위로 뿌리를 뻗은 고목과 풍성한 나뭇잎 캐노피
- **연기 피어오르는 굴뚝**: 하루 7번의 식사가 조리되는 돌 굴뚝과 하늘로 흩날리는 복셀 연기
- **정원과 티 테이블**: 빵, 치즈 휠, 에일 맥주잔, 만발한 야생화 꽃밭
- **빌보 배긴스와 절대반지**: 초록 코트를 입고 눈부시게 타오르는 황금빛 '절대반지'를 들고 있는 미니어처 빌보

### 2. 🌋 모르도르 & 사우론의 눈 (Mount Doom & Barad-dûr)
- **운명의 산 (Orodruin)**: 가파른 화산 경사면과 절대반지가 만들어지고 파괴된 '삼마스 나우르(Cracks of Doom)' 동굴 절벽
- **흐르는 용암 강**: 산에서부터 흘러내려 웅덩이를 이루는 선명한 고열 발광 마그마
- **바라두르 암흑의 탑**: 흑요석과 현무암으로 치솟은 고딕 버트레스와 첨탑
- **타오르는 사우론의 눈 (The Great Eye of Sauron)**: 두 뿔 모양 첨탑 사이에 불타오르는 세로형 동공과 찬란한 불꽃 (언리얼 블룸 발광 효과)

### 3. 🗿 아르고나스의 거상 (The Pillars of the Kings, Argonath)
- **왕들의 기둥**: 안두인 대하 양쪽 협곡에 솟아오른 거대한 이실두르 & 아나리온 왕의 석상
- **위엄 넘치는 조각**: 곤도르의 왕관, 근엄한 수염과 석조 갑옷, 경고하듯 강을 향해 뻗은 거대한 손바닥과 거대한 전투 도끼
- **대하 안두인**: 협곡 절벽과 전나무 숲 사이로 유유히 흐르는 청록빛 반투명 강물과 물거품
- **원정대의 조각배**: 두 거인의 발치를 조용히 지나가는 로스로리엔 요정의 배와 위를 올려다보는 아라곤과 프로도

---

## ⚡ Features (주요 기능)

- **고성능 Voxel Engine**:
  - `THREE.InstancedMesh` 기반으로 수천 개의 복셀을 60+ FPS로 매끄럽게 렌더링
  - 재질별(Solid, Foliage, Emissive, Metallic, Water) 스마트 배치 및 3~5 드로우 콜 최적화
- **절대반지 텡과르 문양 턴테이블 받침대 (Pedestal)**:
  - 흑요석 기단 테두리를 따라 회전하는 엘프어 절대반지 비문 ("Ash nazg durbatulûk...")과 황금빛 호흡 맥동
- **다이내믹 조명 시스템 (Dynamic Lighting)**:
  - ☀️ **주간(Day)**: 맑고 따스한 중간계의 햇살과 자연스러운 그림자
  - 🌅 **석양(Sunset)**: 붉게 물드는 황금빛 노을과 드라마틱한 음영
  - 🌙 **야간(Night)**: 짙푸른 밤하늘 아래 창문, 랜턴, 사우론의 눈, 용암이 밝게 빛나는 야경
- **언리얼 블룸 & 톤 매핑 (Post-processing)**:
  - UnrealBloomPass와 ACESFilmicToneMapping을 통해 발광 복셀들의 눈부신 광휘 연출
- **복셀 마법 조립 애니메이션 (Assemble / Explode)**:
  - 버튼 하나로 복셀 블록들이 하늘에서 탄성 바운스와 함께 쏟아져 내려와 디오라마를 구축하는 연출
- **Y단면 슬라이스 뷰어 (Y-Slice Inspector)**:
  - 높이 조절 슬라이더로 호빗 홀 실내나 지층 내부 구조를 투시
- **절차적 웹 오디오 사운드스케이프 (Web Audio API)**:
  - 외부 음원 파일 의존 없이 순수 브라우저 신디사이저로 생성되는 테마 사운드
  - 샤이어(팬플룻 선율 & 하프), 모르도르(저음 드론 & 용암 버블), 아르고나스(웅장한 호른 & 강물 소리)
- **3D 인터랙티브 핫스팟 (Lore Hotspots)**:
  - 주요 명소의 황금 핀(✦)을 클릭하면 톨킨 원작 설정과 명대사가 담긴 카드 팝업 표시
- **4K 고화질 스크린샷 캡처 (Photo Mode)**:
  - UI를 자동으로 숨기고 깔끔한 3D 렌더링 화면을 투명 PNG로 즉시 다운로드

---

## 🎮 Controls (조작 방법)

| 조작 | 동작 설명 |
| :--- | :--- |
| **마우스 좌클릭 + 드래그** | 디오라마 360도 자유 회전 |
| **마우스 우클릭 + 드래그** | 카메라 시점 이동 (Pan) |
| **마우스 휠 스크롤** | 줌 인 / 줌 아웃 |
| **상단 씬 탭** | 샤이어 / 모르도르 / 아르고나스 장면 즉각 전환 |
| **우측 패널** | 조명 모드, 턴테이블 자동 회전, 복셀 재조립, 사운드 토글, 단면 슬라이스 |
| **3D 핀 (✦) 클릭** | 반지의 제왕 명소 전설 및 원작 대사 열람 |
| **📸 고화질 스크린샷** | UI 없는 깨끗한 렌더링 이미지 저장 |

---

## 🛠️ Tech Stack (기술 스택)

- **Core**: JavaScript (ES Next), HTML5, CSS3
- **3D Engine**: [Three.js](https://threejs.org/) (WebGL, InstancedMesh, ShaderMaterials, OrbitControls)
- **Post-Processing**: EffectComposer, UnrealBloomPass, OutputPass
- **Audio**: Web Audio API (Synthesized Procedural Soundscapes)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Typography**: Google Fonts (Cinzel, Noto Serif KR)

---

## 🚀 Quick Start (로컬 실행 방법)

```bash
# 1. 저장소 클론
git clone https://github.com/jeiel85/lotr-voxel-diorama.git
cd lotr-voxel-diorama

# 2. 의존성 설치
npm install

# 3. 로컬 개발 서버 실행
npm run dev
# 브라우저에서 http://localhost:5173/ 접속

# 4. 프로덕션 빌드
npm run build
```

---

## 📜 License

This project is created for educational and non-commercial portfolio purposes inspired by the works of J.R.R. Tolkien.
