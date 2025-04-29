import * as THREE from "three";
import { setupScene } from "@/lib/scene/setupScene";
import { getDOMElements } from "@/utils/domElements";
import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  CHARACTER_SPEED,
  CHARACTER_LIFE,
  CHARACTER_INITIAL_POSITION,
} from "@/lib/constants/gameSettings";
import { getRandomItem, getEffectiveKeys, mouseDeltaX } from "@/lib/helpers";
import {
  animationSystem,
  lootSystem,
  animatedModelSystem,
  ModelKey,
} from "@/lib/systems";

const createCharacterSystem = () => {
  const { scene, camera } = setupScene();
  const { characterLifeDOM } = getDOMElements();

  let horizontalAngle = 0;
  const direction = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  const characterOptions: ModelKey[] = ["anne", "henry", "captain"];
  const selectedCharacter = getRandomItem(characterOptions);
  const character = animatedModelSystem.getModel(selectedCharacter);

  const restartSystem = () => {
    character.isDying = false;
    character.healthPoints = CHARACTER_LIFE;
    const { x, y, z } = CHARACTER_INITIAL_POSITION;
    character.model.position.set(x, y, z);

    animationSystem.stop(character, "death");
    animationSystem.play(character, "idle");

    characterLifeDOM.value = character.healthPoints;
  };

  const updateCamera = () => {
    const { position } = character.model;
    const sensitivity = 0.01;

    horizontalAngle -= mouseDeltaX * sensitivity;

    const cameraX = position.x + Math.sin(horizontalAngle) * CAMERA_DISTANCE;
    const cameraY = position.y + CAMERA_HEIGHT; // Altura fija
    const cameraZ = position.z + Math.cos(horizontalAngle) * CAMERA_DISTANCE;

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(position.x, 0, position.z);
  };

  const updatePosition = (delta: number) => {
    direction.set(0, 0, 0);
    forward.set(0, 0, 0);
    right.set(0, 0, 0);

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, up).normalize();

    const keysPressed = getEffectiveKeys();

    if (keysPressed.has("w") || keysPressed.has("arrowup"))
      direction.add(forward);
    if (keysPressed.has("s") || keysPressed.has("arrowdown"))
      direction.sub(forward);
    if (keysPressed.has("a") || keysPressed.has("arrowleft"))
      direction.sub(right);
    if (keysPressed.has("d") || keysPressed.has("arrowright"))
      direction.add(right);

    direction.normalize();

    if (!character.isDying) {
      character.model.position.addScaledVector(
        direction,
        delta * CHARACTER_SPEED
      );

      const isMoving = direction.lengthSq() > 0;

      if (isMoving) {
        const targetRotation = Math.atan2(direction.x, direction.z);
        character.model.rotation.y +=
          (targetRotation - character.model.rotation.y) * 0.1;

        animationSystem.play(character, "walk");
      } else {
        animationSystem.stop(character, "walk");
      }

      lootSystem.getLoot();
    }

    character.update(delta);
  };

  const updateCharacter = (delta: number) => {
    updateCamera();
    updatePosition(delta);
  };

  const gameOver = () => {
    character.isDying = true;
    animationSystem.stop(character, "idle");
    animationSystem.stop(character, "walk");
    animationSystem.play(character, "death", true, true);
  };

  scene.add(character.model);

  return { updateCharacter, character, restartSystem, gameOver };
};

export let characterSystem: ReturnType<typeof createCharacterSystem>;
export const initCharacterSystem = () => {
  characterSystem = createCharacterSystem();
};
