import { mobSystem } from "./";
import { getDOMElements } from "@/utils/domElements";
import {
  RAID_COOLDOWN,
  RAID_DURATION,
  RAID_DURATION_INCREMENT_FACTOR,
  MOB_RESPAWN_DELAY_FACTOR,
  MOB_RESPAWN_DELAY,
  MIN_MOB_RESPAWN_DELAY,
} from "@/lib/constants/Constants";

const createRaidSystem = () => {
  const { raidCounterDOM } = getDOMElements();
  const { mobs, initMob } = mobSystem;
  let interval: any;
  let timeout: any;
  let delayBetweenMobs = MOB_RESPAWN_DELAY;
  const raidCount = { count: 0 };
  let isRunning = false;

  const initRaid = () => {
    if (isRunning) return;
    isRunning = true;

    raidCount.count++;
    updateRaidCounter();

    delayBetweenMobs = Math.max(
      MIN_MOB_RESPAWN_DELAY,
      MOB_RESPAWN_DELAY - raidCount.count * MOB_RESPAWN_DELAY_FACTOR
    );

    interval = setInterval(() => {
      const skeleton = initMob(raidCount.count);
      mobs.push(skeleton);
    }, delayBetweenMobs);

    const duration =
      RAID_DURATION + raidCount.count * RAID_DURATION_INCREMENT_FACTOR;

    timeout = setTimeout(() => {
      initNextRaid();
    }, duration);
  };

  const initNextRaid = () => {
    finishRaid();
    setTimeout(() => {
      initRaid();
    }, RAID_COOLDOWN);
  };

  const finishRaid = () => {
    if (!isRunning) return;

    clearInterval(interval);
    clearTimeout(timeout);
    console.log(`Raid #${raidCount} finalizada`);
    isRunning = false;
  };

  const updateRaidCounter = () => {
    console.log("Actualizando raid:", raidCount.count);
    raidCounterDOM.textContent = `Raid #: ${raidCount.count}`;
  };

  const restartSystem = () => {
    raidSystem.raidCount.count = 0;
    raidSystem.updateRaidCounter();
    raidSystem.initRaid();
  };

  return { initRaid, finishRaid, raidCount, updateRaidCounter, restartSystem };
};

export let raidSystem: ReturnType<typeof createRaidSystem>;
export const initRaidSystem = () => {
  raidSystem = createRaidSystem();
};
