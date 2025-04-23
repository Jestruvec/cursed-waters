import * as THREE from "three";
import { animationSystem } from "@/lib/helpers";
import { getModel, ModelKey } from "@/assets/models";
import { inRange } from "@/lib/helpers";
import { HALF } from "@/lib/constants/Constants";

export const initMob = (scene: THREE.Scene) => {
  const mobOptions: ModelKey[] = ["skeleton", "skeleton_headless", "sharky"];
  const randomIndex = Math.floor(Math.random() * mobOptions.length);
  const selectedMob = mobOptions[randomIndex];

  const mob = getModel(selectedMob);

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
