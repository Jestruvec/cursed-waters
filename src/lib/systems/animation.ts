import * as THREE from "three";
import { AnimatedModel } from "@/lib/types/AnimatedModel";

const createAnimationSystem = () => {
  const getAction = (model: AnimatedModel, clipName: string) => {
    const clip = model.animations.find((clip) =>
      clip.name.toLowerCase().includes(clipName.toLowerCase())
    );

    if (!clip) {
      console.warn(`Clip "${clipName}" not found in model.`);
      return null;
    }

    const action = model.mixer.clipAction(clip);

    return action;
  };

  const play = (
    model: AnimatedModel,
    clipName: string,
    clamp: boolean = false,
    once: boolean = false,
    reset: boolean = false
  ) => {
    const action = getAction(model, clipName);

    if (action) {
      action.clampWhenFinished = clamp;

      if (once) {
        action.setLoop(THREE.LoopOnce, 1);
      }

      if (reset) {
        action.reset();
      }

      action.play();
    }
  };

  const stop = (model: AnimatedModel, clipName: string) => {
    const action = getAction(model, clipName);
    if (action) {
      action.stop();
    }
  };

  const stopAll = (model: AnimatedModel) => {
    model.mixer.stopAllAction();
  };

  return { play, stop, stopAll };
};

export let animationSystem: ReturnType<typeof createAnimationSystem>;
export const initAnimationSystem = () => {
  animationSystem = createAnimationSystem();
};
