import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { createMesh } from "@/lib/helpers";
import * as GLBS from "@/assets/glbs";
import { AnimatedModel } from "@/lib/types/AnimatedModel";

export type ModelKey =
  | "anne"
  | "mako"
  | "henry"
  | "captain"
  | "skeleton"
  | "skeleton_headless"
  | "sharky"
  | "palm"
  | "rock"
  | "gold_bag"
  | "pink_gem"
  | "ship"
  | "chicken_leg";

const createAnimatedModelSystem = () => {
  const models: Record<string, AnimatedModel> = {};
  const { Model } = createMesh();

  const loadModels = async () => {
    const entries: [ModelKey, string][] = [
      ["mako", GLBS.Mako],
      ["anne", GLBS.Anne],
      ["captain", GLBS.Pirate_Captain],
      ["henry", GLBS.Henry],
      ["skeleton", GLBS.Skeleton_1],
      ["skeleton_headless", GLBS.Skeleton_2],
      ["sharky", GLBS.Sharky],
      ["palm", GLBS.Palm_1],
      ["rock", GLBS.Rock_1],
      ["gold_bag", GLBS.Gold_Bag],
      ["pink_gem", GLBS.Gem_Pink],
      ["ship", GLBS.Ship],
      ["chicken_leg", GLBS.Chicken_Leg],
    ];

    for (const [key, path] of entries) {
      models[key] = await Model(path);
    }
  };

  const getModel = (key: ModelKey): AnimatedModel => {
    const original = models[key];
    if (!original) throw new Error(`Model "${key}" not loaded`);

    const modelClone = clone(original.model);
    const mixer = new THREE.AnimationMixer(modelClone);

    return {
      model: modelClone,
      animations: original.animations,
      mixer,
      update: (delta: number) => mixer.update(delta),
    };
  };

  return { loadModels, getModel };
};

export let animatedModelSystem: any;
export const initAnimatedModelSystem = async () => {
  animatedModelSystem = createAnimatedModelSystem();
  await animatedModelSystem.loadModels();
};
