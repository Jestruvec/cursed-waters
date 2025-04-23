export const getDOMElements = () => ({
  canvas: document.querySelector("canvas") as HTMLCanvasElement,
  initScreenEl: document.querySelector("#initial-screen") as HTMLDivElement,
  resultScreenEl: document.querySelector("#result-screen") as HTMLDivElement,
  chestLifeEl: document.getElementById(
    "chestlife-progress"
  ) as HTMLProgressElement,
  restartButton: document.getElementById("restart-button") as HTMLButtonElement,
  initButton: document.getElementById("init-button") as HTMLButtonElement,
  raidCounter: document.getElementById("raid-counter") as HTMLSpanElement,
  goldCounter: document.getElementById("gold-counter") as HTMLSpanElement,
  quote: document.getElementById("quote") as HTMLElement,
  survivedRaids: document.getElementById("survived-raids") as HTMLSpanElement,
  collectedGold: document.getElementById("collected-gold") as HTMLSpanElement,
  gameDetails: document.getElementById("game-details") as HTMLDivElement,
});
