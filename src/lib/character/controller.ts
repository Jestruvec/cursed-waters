import * as THREE from "three";
import { AnimatedModel } from "../types/AnimatedModel";
import { animationSystem, keysPressed } from "@/lib/helpers";
import { lootSystem } from "@/lib/helpers/lootSystem";
import { CHARACTER_SPEED } from "@/lib/constants/Constants";

const direction = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

export const updateCharacter = (
  character: AnimatedModel,
  delta: number,
  camera: THREE.Camera
) => {
  direction.set(0, 0, 0);
  forward.set(0, 0, 0);
  right.set(0, 0, 0);

  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  right.crossVectors(forward, up).normalize();

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

    lootSystem.getLoot(character);
  }

  character.update(delta);
};
