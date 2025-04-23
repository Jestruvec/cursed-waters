/// <reference types="vite/client" />

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.gltf" {
  const src: string;
  export default src;
}

declare module "three/examples/jsm/utils/SkeletonUtils" {
  import * as THREE from "three";
  export function clone(source: THREE.Object3D): THREE.Object3D;
}
