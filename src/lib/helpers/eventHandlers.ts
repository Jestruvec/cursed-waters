import { setupScene } from "@/lib/scene/";
import { getDOMElements } from "@/utils/domElements";

export const keysPressed = new Set<string>();
const { camera, renderer } = setupScene();
export let mouseDeltaX = 0;
export let mouseDeltaY = 0;
let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;

let isTouching = false;
let lastTouchX = 0;
let lastTouchY = 0;

const { canvasDOM } = getDOMElements();

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
