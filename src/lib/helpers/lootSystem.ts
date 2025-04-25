import * as THREE from "three";
import { AnimatedModel } from "../types/AnimatedModel";
import { LOOT_PICK_RADIUS, LOOT_EXPIRES_TIME } from "@/lib/constants/Constants";
import {
  soundSystem,
  animatedModelSystem,
  characterSystem,
} from "@/lib/helpers";
import { setupScene } from "@/lib/scene";
import { getDOMElements } from "@/utils/domElements";

interface LootItem {
  id: string;
  model: AnimatedModel;
  expiresAt: number;
  type: "gold" | "chicken_leg";
}

const createLootSystem = () => {
  const { character } = characterSystem;
  const { getModel } = animatedModelSystem;
  const { goldCounterDOM, characterLifeDOM } = getDOMElements();
  const { scene } = setupScene();
  const lootItems: LootItem[] = [];
  const inventary: LootItem[] = [];

  const dropLoot = (position: THREE.Vector3) => {
    if (Math.random() < 0.3) {
      const loot = getModel("gold_bag");
      loot.model.position.copy(position);
      scene.add(loot.model);

      const lifespan = LOOT_EXPIRES_TIME;
      const expiresAt = Date.now() + lifespan;

      lootItems.push({
        id: crypto.randomUUID(),
        model: loot,
        expiresAt,
        type: "gold",
      });
    }

    if (Math.random() < 0.1) {
      const loot = getModel("chicken_leg");
      loot.model.position.copy(position);
      loot.model.position.y = 0.25;
      scene.add(loot.model);

      const lifespan = LOOT_EXPIRES_TIME;
      const expiresAt = Date.now() + lifespan;

      lootItems.push({
        id: crypto.randomUUID(),
        model: loot,
        expiresAt,
        type: "chicken_leg",
      });
    }
  };

  const getLoot = () => {
    for (let i = lootItems.length - 1; i >= 0; i--) {
      const loot = lootItems[i];
      const distance = character.model.position.distanceTo(
        loot.model.model.position
      );

      if (distance < LOOT_PICK_RADIUS) {
        scene.remove(loot.model.model);
        lootItems.splice(i, 1);

        if (loot.type === "gold") {
          inventary.push(loot);
          soundSystem.play("coin");
          goldCounterDOM.innerText = `Gold: ${inventary.length}`;
        }

        if (
          loot.type === "chicken_leg" &&
          character.healthPoints !== undefined
        ) {
          character.healthPoints = Math.min(10, character.healthPoints + 1);
          characterLifeDOM.value = character.healthPoints;
          soundSystem.play("eat");
        }
      }
    }
  };

  const animateLoot = () => {
    const now = Date.now();

    for (let i = lootItems.length - 1; i >= 0; i--) {
      const loot = lootItems[i];

      if (loot.expiresAt <= now) {
        scene.remove(loot.model.model);
        lootItems.splice(i, 1);
      }
    }
  };

  const restartSystem = () => {
    lootSystem.inventary = [];
    goldCounterDOM.innerText = `Gold: ${lootSystem.inventary.length}`;
  };

  return {
    dropLoot,
    getLoot,
    animateLoot,
    lootItems,
    inventary,
    restartSystem,
  };
};

export let lootSystem: ReturnType<typeof createLootSystem>;

export const initLootSystem = () => {
  lootSystem = createLootSystem();
};
