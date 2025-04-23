import "./style.css";
import * as THREE from "three";
import { setupScene, setupAudio, initMap } from "@/lib/scene";
import { quoteService } from "@/lib/services";
import {
  initCharacter,
  updateCamera,
  updateCharacter,
  chestlife,
} from "@/lib/character";
import {
  CHARACTER_INITIAL_POSITION,
  CHEST_LIFE,
  DAY_DURATION_FACTOR,
} from "@/lib/constants/Constants";
import {
  initEventListeners,
  initAnimationSystem,
  initSoundSystem,
  initMobSystem,
  initLootSystem,
  initRaidSystem,
  animationSystem,
  soundSystem,
  mobSystem,
  lootSystem,
  raidSystem,
  handleResize,
} from "@/lib/helpers";
import { loadModels } from "@/assets/models";
import { getRandomItem } from "@/lib/helpers/randomUtils";
import { getDOMElements } from "@/utils/domElements";

const {
  canvas,
  initScreenEl,
  resultScreenEl,
  gameDetails,
  chestLifeEl,
  restartButton,
  initButton,
  goldCounter,
  quote,
} = getDOMElements();

const { scene, camera, renderer, clock, sun, uniforms, sunLight } =
  setupScene(canvas);

const main = async () => {
  let gameover = false;
  let isDay = true;

  await loadModels();

  const { fetchQuotes } = quoteService();
  const quotes = await fetchQuotes();

  const { gem, mako, waterMaterial } = initMap(scene);
  const { listener } = setupAudio();
  camera.add(listener);

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

  const restartGame = () => {
    const { removeAllMobs } = mobSystem;

    gameover = false;
    character.isDying = false;

    chestlife.value = CHEST_LIFE;
    chestLifeEl.value = chestlife.value;

    const { x, y, z } = CHARACTER_INITIAL_POSITION;
    character.model.position.set(x, y, z);

    removeAllMobs();

    animationSystem.stop(character, "death");
    animationSystem.play(character, "idle");
    soundSystem.stop("gameOver");
    soundSystem.play("jungleNight");
    soundSystem.play("ocean");

    lootSystem.inventary = [];
    goldCounter.innerText = `Gold: ${lootSystem.inventary.length}`;

    raidSystem.raidCount.count = 0;
    raidSystem.updateRaidCounter();
    raidSystem.initRaid();

    resultScreenEl.classList.remove("show");

    renderer.setAnimationLoop(animate);
  };

  const finishGame = () => {
    character.isDying = true;

    animationSystem.stop(character, "idle");
    animationSystem.stop(character, "walk");

    animationSystem.play(character, "death", true, true);
    soundSystem.play("gameOver");

    soundSystem.stop("ocean");
    soundSystem.stop("jungleNight");
    soundSystem.stop("seagul");

    setTimeout(() => {
      document.exitPointerLock();
      const randomQuote = getRandomItem(quotes);
      quote.innerText = `"${randomQuote.q}" - ${randomQuote.a}`;

      resultScreenEl.classList.add("show");

      raidSystem.finishRaid();
      renderer.setAnimationLoop(null);
    }, 2000);
  };

  const animate = () => {
    const delta = clock.getDelta();

    if (gameover) {
      updateCharacter(character, delta, camera);
      renderer.render(scene, camera);
      return;
    }

    mako.update(delta);
    const elapsed = clock.getElapsedTime();
    canvas.requestPointerLock();

    gem.model.rotation.y += 0.01;

    if (waterMaterial.normalMap) {
      waterMaterial.normalMap.offset.x = elapsed * 0.005;
      waterMaterial.normalMap.offset.y = elapsed * 0.005;
    }

    updateSun(elapsed);
    updateCamera(camera, character.model);
    updateCharacter(character, delta, camera);
    mobSystem.updateMobs(delta, chestlife, character, elapsed);
    lootSystem.animateLoot();

    if (chestlife.value <= 0) {
      gameover = true;
      finishGame();
    }

    renderer.render(scene, camera);
  };

  initAnimationSystem();
  initSoundSystem();
  initMobSystem();
  initRaidSystem();
  initLootSystem();
  initEventListeners();

  const character = initCharacter(scene);

  gameDetails.classList.add("show");
  initScreenEl.classList.remove("show");

  animationSystem.play(mako, "idle");

  raidSystem.initRaid();

  restartButton.addEventListener("click", restartGame);

  renderer.setAnimationLoop(animate);
};

initButton.addEventListener("click", () => main());
window.addEventListener("resize", handleResize);
