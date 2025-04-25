import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { getDOMElements } from "@/utils/domElements";

let instance: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  sun: THREE.Vector3;
  sunLight: THREE.DirectionalLight;
  uniforms: any;
} | null = null;

export const setupScene = () => {
  if (instance) {
    return instance;
  }

  const { canvasDOM } = getDOMElements();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xaaaaaa, 10, 20);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasDOM });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const clock = new THREE.Clock();

  // Sky
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  // Parámetros del cielo
  const sun = new THREE.Vector3();
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = 10;
  uniforms["rayleigh"].value = 2;
  uniforms["mieCoefficient"].value = 0.005;
  uniforms["mieDirectionalG"].value = 0.8;

  // Posición inicial del sol
  const phi = THREE.MathUtils.degToRad(90 - 10);
  const theta = THREE.MathUtils.degToRad(180);
  sun.setFromSphericalCoords(1, phi, theta);
  uniforms["sunPosition"].value.copy(sun);

  // Luz solar sincronizada con el cielo

  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.copy(sun).multiplyScalar(100);
  sunLight.castShadow = true;

  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 200;
  sunLight.shadow.camera.left = -50;
  sunLight.shadow.camera.right = 50;
  sunLight.shadow.camera.top = 50;
  sunLight.shadow.camera.bottom = -50;

  //luz ambiental
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

  scene.add(ambientLight, sunLight);

  instance = {
    scene,
    camera,
    renderer,
    clock,
    sun,
    sunLight,
    uniforms,
  };

  return instance;
};
