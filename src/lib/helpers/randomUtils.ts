import { AnimatedModel } from "../types/AnimatedModel";

export const outsideCenter = (min: number, max: number): number => {
  const value =
    (Math.random() < 0.5 ? -1 : 1) * (min + Math.random() * (max - min));
  return value;
};

export const inRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

export const randomizeModel = (model: AnimatedModel, x: number, z: number) => {
  model.model.position.set(x + 0.5 - Math.random(), 0, z + 0.5 - Math.random());
  model.model.rotation.y = Math.random() * Math.PI * 2;
  const scale = 0.8 + Math.random() * 0.4;
  model.model.scale.set(scale, scale, scale);
};

export const getRandomItem = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
