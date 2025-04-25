import { setupAudio } from "@/lib/scene/setupAudio";

type Sound =
  | "ocean"
  | "jungleNight"
  | "death"
  | "sword"
  | "hit"
  | "coin"
  | "eat"
  | "gameOver"
  | "seagul";

const createSoundSystem = () => {
  const { listener } = setupAudio();

  const {
    oceanSound,
    jungleNightSound,
    deathSound,
    swordSound,
    hitSound,
    coinSound,
    gameOverSound,
    seagulSound,
    eatSound,
  } = setupAudio();

  const getSound = (soundName: Sound) => {
    switch (soundName) {
      case "jungleNight":
        return jungleNightSound;
      case "ocean":
        return oceanSound;
      case "seagul":
        return seagulSound;
      case "gameOver":
        return gameOverSound;
      case "death":
        return deathSound;
      case "sword":
        return swordSound;
      case "hit":
        return hitSound;
      case "coin":
        return coinSound;
      case "eat":
        return eatSound;
      default:
        break;
    }
  };

  const play = (soundName: Sound) => {
    const sound = getSound(soundName);

    if (sound) {
      sound.stop().play();
    } else {
      console.log("Error al reproducir el sonido: ", soundName);
    }
  };

  const stop = (soundName: Sound) => {
    const sound = getSound(soundName);

    if (sound) {
      sound.stop();
    } else {
      console.log("Error al detener el sonido: ", soundName);
    }
  };

  const restartSystem = () => {
    soundSystem.stop("gameOver");
    soundSystem.play("jungleNight");
    soundSystem.play("ocean");
  };

  const gameOver = () => {
    soundSystem.play("gameOver");
    soundSystem.stop("ocean");
    soundSystem.stop("jungleNight");
    soundSystem.stop("seagul");
  };

  return { play, stop, listener, restartSystem, gameOver };
};

export let soundSystem: ReturnType<typeof createSoundSystem>;
export const initSoundSystem = () => {
  soundSystem = createSoundSystem();
};
