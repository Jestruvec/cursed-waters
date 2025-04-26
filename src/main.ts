import "./style.css";
import { getDOMElements } from "@/utils/domElements";
import { setupScene } from "@/lib/scene";
import { initEventListeners, handleResize, quoteHelper } from "@/lib/helpers";
import {
  initAnimationSystem,
  initSoundSystem,
  initMobSystem,
  initLootSystem,
  initRaidSystem,
  initDayAndNightSystem,
  initCharacterSystem,
  initAnimatedModelSystem,
  initMapSystem,
  mapSystem,
  characterSystem,
  dayAndNightSystem,
  soundSystem,
  mobSystem,
  lootSystem,
  raidSystem,
} from "@/lib/systems";

const {
  canvasDOM,
  initScreenDOM,
  resultScreenDOM,
  gameDetailsDOM,
  restartButtonDOM,
  initButtonDOM,
} = getDOMElements();

const main = async () => {
  initButtonDOM.disabled = true;
  initButtonDOM.innerText = "Loading...";

  const { scene, camera, renderer, clock } = setupScene();
  let gameover = false;

  const restartGame = () => {
    gameover = false;

    mapSystem.restartSystem();
    mobSystem.restartSystem();
    characterSystem.restartSystem();
    soundSystem.restartSystem();
    lootSystem.restartSystem();
    raidSystem.restartSystem();

    resultScreenDOM.classList.remove("show");
    renderer.setAnimationLoop(animate);
  };

  const gameOver = () => {
    characterSystem.gameOver();
    soundSystem.gameOver();
    raidSystem.finishRaid();

    setTimeout(() => {
      document.exitPointerLock();
      quoteHelper.setQuote();
      resultScreenDOM.classList.add("show");
      renderer.setAnimationLoop(null);
    }, 2000);
  };

  const animate = () => {
    const delta = clock.getDelta();

    const { updateCharacter, character } = characterSystem;

    if (gameover) {
      updateCharacter(delta);
      renderer.render(scene, camera);
      return;
    }

    const elapsed = clock.getElapsedTime();
    canvasDOM.requestPointerLock();

    mapSystem.updateSystem(delta, elapsed);
    dayAndNightSystem.updateSystem(elapsed);
    characterSystem.updateCharacter(delta);
    mobSystem.updateMobs(delta, character, elapsed);
    lootSystem.animateLoot();

    const gameOverConditions =
      !character.healthPoints || character.healthPoints <= 0;
    if (gameOverConditions) {
      gameover = true;
      gameOver();
    }

    renderer.render(scene, camera);
  };

  await initAnimatedModelSystem();
  initAnimationSystem();
  initSoundSystem();
  initMapSystem();
  initDayAndNightSystem();
  initCharacterSystem();
  initMobSystem();
  initRaidSystem();
  initLootSystem();
  initEventListeners();

  restartGame();

  initScreenDOM.classList.remove("show");
  gameDetailsDOM.classList.add("show");

  restartButtonDOM.addEventListener("click", restartGame);
};

initButtonDOM.addEventListener("click", () => main());
window.addEventListener("resize", handleResize);
