import * as THREE from "three";
import * as sounds from "@/assets/sounds";

export const setupAudio = () => {
  const listener = new THREE.AudioListener();

  const jungleNightSound = new THREE.Audio(listener);
  const swordSound = new THREE.Audio(listener);
  const deathSound = new THREE.Audio(listener);
  const hitSound = new THREE.Audio(listener);
  const coinSound = new THREE.Audio(listener);
  const eatSound = new THREE.Audio(listener);
  const oceanSound = new THREE.Audio(listener);
  const gameOverSound = new THREE.Audio(listener);
  const seagulSound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();

  // Sonido de la jungla
  audioLoader.load(sounds.jungle_night, (buffer) => {
    jungleNightSound.setBuffer(buffer);
    jungleNightSound.setLoop(true);
    jungleNightSound.setVolume(0.5);
  });

  // Sonido del mar
  audioLoader.load(sounds.ocean, (buffer) => {
    oceanSound.setBuffer(buffer);
    oceanSound.setLoop(true);
    oceanSound.setVolume(0.5);
    oceanSound.play();
  });

  // Sonido de game over
  audioLoader.load(sounds.game_over, (buffer) => {
    gameOverSound.setBuffer(buffer);
    gameOverSound.setLoop(true);
  });

  // Sonido de gaviotas
  audioLoader.load(sounds.seagull, (buffer) => {
    seagulSound.setBuffer(buffer);
    seagulSound.setLoop(true);
    seagulSound.setVolume(0.5);
  });

  // Sonido de espada
  audioLoader.load(sounds.sword, (buffer) => {
    swordSound.setBuffer(buffer);
    swordSound.setLoop(false);
    swordSound.setVolume(0.5);
  });

  // Sonido de muerte
  audioLoader.load(sounds.death, (buffer) => {
    deathSound.setBuffer(buffer);
    deathSound.setLoop(false);
    deathSound.setVolume(0.5);
  });

  // Sonido de hit a la gema
  audioLoader.load(sounds.hit, (buffer) => {
    hitSound.setBuffer(buffer);
    hitSound.setLoop(false);
    hitSound.setVolume(0.5);
  });

  // Sonido de lootear oro
  audioLoader.load(sounds.coins, (buffer) => {
    coinSound.setBuffer(buffer);
    coinSound.setLoop(false);
    coinSound.setVolume(0.5);
  });

  // Sonido de lootear pierna de pollo
  audioLoader.load(sounds.eat, (buffer) => {
    eatSound.setBuffer(buffer);
    eatSound.setLoop(false);
    eatSound.setVolume(0.5);
  });

  const audioContext = THREE.AudioContext.getContext();

  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("AudioContext resumed successfully.");
    });
  }

  return {
    jungleNightSound,
    gameOverSound,
    oceanSound,
    swordSound,
    deathSound,
    hitSound,
    eatSound,
    coinSound,
    seagulSound,
    listener,
  };
};
