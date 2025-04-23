import * as THREE from "three";
import { getModel } from "@/assets/models";
import { CHARACTER_INITIAL_POSITION } from "@/lib/constants/Constants";
import { animationSystem } from "@/lib/helpers";

export const initCharacter = (scene: THREE.Scene) => {
  const character = getModel("anne");
  const { x, y, z } = CHARACTER_INITIAL_POSITION;
  character.model.position.set(x, y, z);

  animationSystem.play(character, "idle");

  scene.add(character.model);

  return character;
};
