export const getDOMElements = () => ({
  canvasDOM: document.querySelector("canvas") as HTMLCanvasElement,
  initScreenDOM: document.querySelector("#initial-screen") as HTMLDivElement,
  resultScreenDOM: document.querySelector("#result-screen") as HTMLDivElement,
  characterLifeDOM: document.getElementById(
    "character-life-progress"
  ) as HTMLProgressElement,
  restartButtonDOM: document.getElementById(
    "restart-button"
  ) as HTMLButtonElement,
  initButtonDOM: document.getElementById("init-button") as HTMLButtonElement,
  raidCounterDOM: document.getElementById("raid-counter") as HTMLSpanElement,
  goldCounterDOM: document.getElementById("gold-counter") as HTMLSpanElement,
  quoteDOM: document.getElementById("quote") as HTMLElement,
  survivedRaidsDOM: document.getElementById(
    "survived-raids"
  ) as HTMLSpanElement,
  collectedGoldDOM: document.getElementById(
    "collected-gold"
  ) as HTMLSpanElement,
  gameDetailsDOM: document.getElementById("game-details") as HTMLDivElement,
  joystickDOM: document.getElementById("joystick") as HTMLDivElement,
  joystickContainerDOM: document.getElementById(
    "joystick-container"
  ) as HTMLDivElement,
});
