import * as THREE from "three";
import { setupScene } from "@/lib/scene";
import { soundSystem } from "@/lib/systems";
import { DAY_DURATION_FACTOR } from "@/lib/constants/constants";

const createDayAndNightSystem = () => {
  let isDay = true;
  const { sun, uniforms, sunLight } = setupScene();

  const updateSun = (time: number) => {
    const phi = THREE.MathUtils.degToRad(
      90 - 45 * Math.sin(time * DAY_DURATION_FACTOR)
    );
    const theta = THREE.MathUtils.degToRad(180);

    sun.setFromSphericalCoords(1, phi, theta);
    uniforms["sunPosition"].value.copy(sun);
    sunLight.position.copy(sun).multiplyScalar(100);

    // día o noche segun la elevacion del sol
    const currentlyDay = sun.y > 0.1; // umbral

    if (currentlyDay !== isDay) {
      isDay = currentlyDay;

      if (isDay) {
        soundSystem.stop("jungleNight");
        soundSystem.play("seagul");
      } else {
        soundSystem.stop("seagul");
        soundSystem.play("jungleNight");
      }
    }
  };

  return { updateSun };
};

export let dayAndNightSystem: ReturnType<typeof createDayAndNightSystem>;
export const initDayAndNightSystem = () => {
  dayAndNightSystem = createDayAndNightSystem();
};
