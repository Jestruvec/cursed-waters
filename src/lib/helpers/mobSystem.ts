import * as THREE from "three";
import { AnimatedModel } from "@/lib/types/AnimatedModel";
import { animationSystem, inRange, soundSystem } from "@/lib/helpers";
import { getDOMElements } from "@/utils/domElements";
import { lootSystem } from "@/lib/helpers";
import { setupScene } from "@/lib/scene";
import {
  ATTACK_COOLDOWN,
  ATTACK_RANGE,
  MOB_SPEED,
  CHEST_HIT_RANGE,
  HALF,
} from "@/lib/constants/Constants";
import { getModel, ModelKey } from "@/assets/models";

const createMobSystem = () => {
  const { chestLifeEl, canvas } = getDOMElements();
  const { scene } = setupScene(canvas);
  let lastAttackTime = 0;
  const mobs: AnimatedModel[] = [];
  const tmpDirection = new THREE.Vector3();
  const tmpCharacterPos = new THREE.Vector3();
  const targetPoint = new THREE.Vector3(0, 0, 0);

  const moveMobTowards = (
    mob: AnimatedModel,
    target: THREE.Vector3,
    delta: number
  ) => {
    tmpDirection.copy(target).sub(mob.model.position);
    tmpDirection.y = 0;
    tmpDirection.normalize();
    mob.model.position.addScaledVector(tmpDirection, MOB_SPEED * delta);
  };

  const rotateMobTowards = (mob: AnimatedModel, target: THREE.Vector3) => {
    tmpDirection.copy(target).sub(mob.model.position);
    const angle = Math.atan2(tmpDirection.x, tmpDirection.z);
    mob.model.rotation.y = angle;
  };

  const attackMob = (character: AnimatedModel, now: number) => {
    if (character.isDying) return;
    animationSystem.play(character, "sword", false, true, true);
    soundSystem.play("sword");
    lastAttackTime = now;
  };

  const killMob = (mob: AnimatedModel, mobs: AnimatedModel[]) => {
    if (mob.isDying) return;

    mob.isDying = true;

    animationSystem.stop(mob, "walk");
    animationSystem.play(mob, "death", true, true);
    lootSystem.dropLoot(mob.model.position);

    setTimeout(() => {
      scene.remove(mob.model);
      mobs.splice(mobs.indexOf(mob), 1);
    }, 2000);
  };

  const updateMobs = (
    delta: number,
    chestLife: { value: number },
    character: AnimatedModel,
    now: number
  ) => {
    tmpCharacterPos.copy(character.model.position);

    for (let i = mobs.length - 1; i >= 0; i--) {
      const mob = mobs[i];

      if (mob.isDying) {
        mob.update(delta);
        continue;
      }

      moveMobTowards(mob, targetPoint, delta);
      rotateMobTowards(mob, targetPoint);

      const distanceToCharacter =
        mob.model.position.distanceTo(tmpCharacterPos);
      const distanceToChest = mob.model.position.distanceTo(targetPoint);

      if (
        distanceToCharacter < ATTACK_RANGE &&
        now - lastAttackTime > ATTACK_COOLDOWN
      ) {
        attackMob(character, now);
        killMob(mob, mobs);
        continue;
      }

      if (distanceToChest < CHEST_HIT_RANGE) {
        chestLife.value = Math.max(0, chestLife.value - 1);
        chestLifeEl.value = chestLife.value;

        soundSystem.play("hit");

        scene.remove(mob.model);
        mobs.splice(i, 1);
        continue;
      }

      mob.update(delta);
    }
  };

  const initMob = (difficulty: number) => {
    const mobOptions: ModelKey[] = ["skeleton", "skeleton_headless", "sharky"];
    const randomIndex = Math.floor(Math.random() * mobOptions.length);
    const selectedMob = mobOptions[randomIndex];

    const mob = { ...getModel(selectedMob), difficulty };

    // Intentar hasta encontrar una posición en el agua
    let x: number, z: number, distanceFromCenter: number;

    do {
      x = inRange(-HALF, HALF);
      z = inRange(-HALF, HALF);
      distanceFromCenter = Math.sqrt(x * x + z * z);
    } while (distanceFromCenter <= HALF * 0.5); // si es <=, está en tierra

    mob.model.position.set(x, 0, z);
    mob.model.rotation.y = Math.PI;

    animationSystem.play(mob, "walk");

    scene.add(mob.model);

    return mob;
  };

  const removeAllMobs = () => {
    for (let i = mobs.length - 1; i >= 0; i--) {
      const skeleton = mobs[i];
      scene.remove(skeleton.model);
      mobs.splice(i, 1);
    }
  };

  return { updateMobs, initMob, mobs, removeAllMobs };
};

export let mobSystem: ReturnType<typeof createMobSystem>;
export const initMobSystem = () => {
  mobSystem = createMobSystem();
};
