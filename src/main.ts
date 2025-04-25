import "./style.css";
import { setupScene } from "@/lib/scene";
import { quotes } from "@/utils/quotes";
import {
  initEventListeners,
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
  handleResize,
} from "@/lib/helpers";
import { getRandomItem } from "@/lib/helpers/randomUtils";
import { getDOMElements } from "@/utils/domElements";

const {
  canvasDOM,
  initScreenDOM,
  resultScreenDOM,
  gameDetailsDOM,
  restartButtonDOM,
  initButtonDOM,
  quoteDOM,
} = getDOMElements();

const main = async () => {
  const { scene, camera, renderer, clock } = setupScene();
  initButtonDOM.disabled = true;
  initButtonDOM.innerText = "Loading...";
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

    setTimeout(() => {
      document.exitPointerLock();
      const randomQuote = getRandomItem(quotes);
      quoteDOM.innerText = `"${randomQuote.q}" - ${randomQuote.a}`;

      resultScreenDOM.classList.add("show");

      raidSystem.finishRaid();
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
    dayAndNightSystem.updateSun(elapsed);
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
