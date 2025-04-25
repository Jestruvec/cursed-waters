import * as THREE from "three";
import { setupScene } from "@/lib/scene/setupScene";
import {
  animatedModelSystem,
  animationSystem,
  randomizeModel,
} from "@/lib/helpers";
import {
  sandDiffuseTexture,
  sandDisplacementTexture,
  sandNormalTexture,
  sandRoughnessTexture,
  waterNormalTexture,
} from "@/assets/textures";
import {
  TILE_SIZE,
  SAND_COLOR,
  WATER_COLOR,
  MAP_SIZE,
  ROCK_SPAWN_PROB,
  PALM_SPAWN_PROB,
} from "@/lib/constants/Constants";

const createMapSystem = () => {
  const { scene } = setupScene();
  const { getModel } = animatedModelSystem;

  const ship = getModel("ship");
  const mako = getModel("mako");
  const gem = getModel("pink_gem");

  const sandMaterial = new THREE.MeshStandardMaterial({
    color: SAND_COLOR,
    map: new THREE.TextureLoader().load(sandDiffuseTexture),
    normalMap: new THREE.TextureLoader().load(sandNormalTexture),
    roughnessMap: new THREE.TextureLoader().load(sandRoughnessTexture),
    displacementMap: new THREE.TextureLoader().load(sandDisplacementTexture),
    displacementScale: 0.1,
    displacementBias: -0.05,
  });
  const waterTextureLoader = new THREE.TextureLoader();
  const waterNormalMap = waterTextureLoader.load(waterNormalTexture);
  waterNormalMap.wrapS = waterNormalMap.wrapT = THREE.RepeatWrapping;

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: WATER_COLOR,
    normalMap: waterNormalMap,
  });

  const generatedTiles = new Set<string>();

  const createTerrainTiles = (size: number) => {
    const tileGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, 0.25);
    const sand = new THREE.InstancedMesh(
      tileGeometry,
      sandMaterial,
      size * size
    );
    sand.receiveShadow = true;

    return { sand };
  };

  const populateTerrain = (
    sand: THREE.InstancedMesh,
    size: number,
    scene: THREE.Scene
  ) => {
    const half = size / 2;
    let sandIndex = 0;

    generatedTiles.clear();

    for (let x = -half; x < half; x++) {
      for (let z = -half; z < half; z++) {
        const key = `${x},${z}`;
        if (generatedTiles.has(key)) continue;

        const distance = Math.sqrt(x * x + z * z);
        const islandRadius = half * 0.5;
        const transitionWidth = 5;

        const isInsideIsland = distance <= islandRadius;

        if (isInsideIsland) {
          const matrix = new THREE.Matrix4()
            .makeTranslation(x, -0.125, z)
            .multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

          sand.setMatrixAt(sandIndex++, matrix);

          // Palmeras y rocas fuera de zona de transición
          if (distance < islandRadius - transitionWidth) {
            // Palmeras
            const palmChance = PALM_SPAWN_PROB * (distance / islandRadius);
            if (distance > 5 && Math.random() < palmChance) {
              const palm = getModel("palm");
              randomizeModel(palm, x, z);
              scene.add(palm.model);
            }

            // Rocas
            if (distance > 5 && Math.random() < ROCK_SPAWN_PROB) {
              const rock = getModel("rock");
              randomizeModel(rock, x, z);
              scene.add(rock.model);
            }
          }
        }

        generatedTiles.add(key);
      }
    }

    sand.count = sandIndex;
  };

  const updateSystem = (delta: number, elapsed: number) => {
    if (waterMaterial.normalMap) {
      waterMaterial.normalMap.offset.x = elapsed * 0.005;
      waterMaterial.normalMap.offset.y = elapsed * 0.005;
    }
    gem.model.rotation.y += 0.01;
    mako.update(delta);
  };

  const restartSystem = () => {
    ship.model.position.set(0, 0, 35);

    mako.model.rotation.y = Math.PI;
    mako.model.position.set(5, 2, 35);
    mako.model.scale.set(1.5, 1.5, 1.5);
    animationSystem.play(mako, "idle");

    gem.model.scale.set(3, 3, 3);
    gem.model.position.y = 2;

    if (generatedTiles.size) return;

    const { sand } = createTerrainTiles(MAP_SIZE);
    populateTerrain(sand, MAP_SIZE, scene);

    const waterPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(MAP_SIZE * TILE_SIZE, MAP_SIZE * TILE_SIZE, 1, 1),
      waterMaterial
    );
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -0.125;
    waterPlane.receiveShadow = true;
    waterPlane.material.transparent = true;
    waterPlane.material.opacity = 0.8;

    scene.add(sand, waterPlane, ship.model, gem.model, mako.model);
  };

  return { restartSystem, updateSystem };
};

export let mapSystem: ReturnType<typeof createMapSystem>;
export const initMapSystem = () => {
  mapSystem = createMapSystem();
};
