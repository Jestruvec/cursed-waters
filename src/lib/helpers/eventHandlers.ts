import { setupScene } from "@/lib/scene/";
import { getDOMElements } from "@/utils/domElements";

const keysPressed = new Set<string>();
const { camera, renderer } = setupScene();
export let mouseDeltaX = 0;
export let mouseDeltaY = 0;
let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;

let isTouching = false;
let lastTouchX = 0;
let lastTouchY = 0;
let joystickTouchStartX = 0;
let joystickTouchStartY = 0;
const keysToSimulate = new Set<string>();

const { canvasDOM, joystickDOM } = getDOMElements();

export const handleClick = () => {
  canvasDOM.requestPointerLock();
};

export const handleMouseMove = (e: MouseEvent) => {
  if (document.pointerLockElement === renderer.domElement) {
    mouseDeltaX = e.movementX;
    mouseDeltaY = e.movementY;

    if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      mouseDeltaX = 0;
      mouseDeltaY = 0;
    }, 50);
  }
};

export const handleKeydown = (e: KeyboardEvent) => {
  keysPressed.add(e.key.toLowerCase());
};

export const handleKeyup = (e: KeyboardEvent) => {
  keysPressed.delete(e.key.toLowerCase());
};

export const handleResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

export const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isTouching = true;
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }
};

export const handleTouchMove = (e: TouchEvent) => {
  if (isTouching && e.touches.length === 1) {
    const touch = e.touches[0];

    mouseDeltaX = touch.clientX - lastTouchX;
    mouseDeltaY = touch.clientY - lastTouchY;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;

    if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      mouseDeltaX = 0;
      mouseDeltaY = 0;
    }, 50);
  }
};

export const handleTouchEnd = () => {
  isTouching = false;
};

export const handleJoystickTouchStar = (e: TouchEvent) => {
  const touch = e.touches[0];
  joystickTouchStartX = touch.clientX;
  joystickTouchStartY = touch.clientY;
};

export const handleJoystickTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  const dx = touch.clientX - joystickTouchStartX;
  const dy = touch.clientY - joystickTouchStartY;
  updateJoystick(dx, dy);
};

export const handleJoystickTouchEnd = () => {
  resetJoystick();
};

const getDirectionFromAngle = (angle: number) => {
  const direction = new Set<string>();

  if (angle >= 45 && angle < 135) direction.add("s"); // down
  else if (angle >= 135 && angle < 225) direction.add("a"); // left
  else if (angle >= 225 && angle < 315) direction.add("w"); // up
  else direction.add("d"); // right

  return direction;
};

const updateJoystick = (dx: number, dy: number) => {
  // const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = 40;

  const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 180;

  const clampedDx = Math.min(maxDistance, Math.max(-maxDistance, dx));
  const clampedDy = Math.min(maxDistance, Math.max(-maxDistance, dy));

  joystickDOM.style.left = `${40 + clampedDx}px`;
  joystickDOM.style.top = `${40 + clampedDy}px`;

  keysToSimulate.clear();
  for (const dir of getDirectionFromAngle(angle)) {
    keysToSimulate.add(dir);
  }
};

const resetJoystick = () => {
  joystickDOM.style.left = `40px`;
  joystickDOM.style.top = `40px`;
  keysToSimulate.clear();
};

export const getEffectiveKeys = () => {
  return new Set([...keysPressed, ...keysToSimulate]);
};
