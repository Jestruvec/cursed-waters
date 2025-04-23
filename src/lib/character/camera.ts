import * as THREE from "three";
import { mouseDeltaX } from "@/lib/helpers";

let horizontalAngle = 0;

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 3;

export const updateCamera = (
  camera: THREE.Camera,
  character: THREE.Object3D
) => {
  const sensitivity = 0.01;

  // Actualiza solo el ángulo horizontal
  horizontalAngle -= mouseDeltaX * sensitivity;

  // Calcula la posición de la cámara
  const cameraX =
    character.position.x + Math.sin(horizontalAngle) * CAMERA_DISTANCE;
  const cameraY = character.position.y + CAMERA_HEIGHT; // Altura fija
  const cameraZ =
    character.position.z + Math.cos(horizontalAngle) * CAMERA_DISTANCE;

  camera.position.set(cameraX, cameraY, cameraZ);

  // Punto de mira (a la misma altura que la cámara)
  camera.lookAt(character.position.x, 0, character.position.z);
};
