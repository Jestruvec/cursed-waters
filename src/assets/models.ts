import * as THREE from "three";
import { createMesh } from "@/lib/helpers/meshHelper";
import * as GLBS from "@/assets/glbs";
import { AnimatedModel } from "@/lib/types/AnimatedModel";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export type ModelKey =
  | "anne"
  | "mako"
  | "skeleton"
  | "skeleton_headless"
  | "sharky"
  | "palm"
  | "rock"
  | "gold_bag"
  | "pink_gem"
  | "ship"
  | "chicken_leg";

const models: Record<string, AnimatedModel> = {};
const { Model } = createMesh();

export const loadModels = async () => {
  const entries: [ModelKey, string][] = [
    ["mako", GLBS.Mako],
    ["anne", GLBS.Anne],
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

export const getModel = (key: ModelKey): AnimatedModel => {
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
