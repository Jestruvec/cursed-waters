const CAMERA_SETTINGS = {
  fov: 50,
  near: 0.1,
  far: 1000,
  aspect: window.innerWidth / window.innerHeight,
  position: { x: 0, y: 15, z: 20 },
  lookAt: { x: 0, y: 5, z: 0 },
};
const MAP_SIZE = 100;
const HALF = MAP_SIZE / 2;
const CHARACTER_INITIAL_POSITION = { x: 0, y: 0, z: 3 };
const TILE_SIZE = 1;
const SAND_COLOR = 0xdeb887;
const WATER_COLOR = 0x1e90ff;
const CHEST_LIFE = 10;
const ATTACK_RANGE = 1;
const CHEST_HIT_RANGE = 0.5;
const ATTACK_COOLDOWN = 0.6;
const MOB_SPEED = 1;
const LOOT_PICK_RADIUS = 0.5;
const LOOT_EXPIRES_TIME = 10000;
const ROCK_SPAWN_PROB = 0.025;
const PALM_SPAWN_PROB = 0.15;
const RAID_DURATION = 30000;
const RAID_COOLDOWN = 10000;
const RAID_DURATION_INCREMENT_FACTOR = 20000;
const MOB_RESPAWN_DELAY = 2000;
const MIN_MOB_RESPAWN_DELAY = 500;
const MOB_RESPAWN_DELAY_FACTOR = 200;
const DAY_DURATION_FACTOR = 0.05;
const CHARACTER_SPEED = 5;
const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 3;
const CHARACTER_LIFE = 10;

export {
  CHARACTER_LIFE,
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  CHARACTER_SPEED,
  DAY_DURATION_FACTOR,
  MIN_MOB_RESPAWN_DELAY,
  MOB_RESPAWN_DELAY,
  MOB_RESPAWN_DELAY_FACTOR,
  RAID_DURATION_INCREMENT_FACTOR,
  RAID_COOLDOWN,
  RAID_DURATION,
  ROCK_SPAWN_PROB,
  PALM_SPAWN_PROB,
  MOB_SPEED,
  CHEST_LIFE,
  CHARACTER_INITIAL_POSITION,
  CAMERA_SETTINGS,
  TILE_SIZE,
  SAND_COLOR,
  WATER_COLOR,
  ATTACK_COOLDOWN,
  ATTACK_RANGE,
  CHEST_HIT_RANGE,
  HALF,
  MAP_SIZE,
  LOOT_PICK_RADIUS,
  LOOT_EXPIRES_TIME,
};
