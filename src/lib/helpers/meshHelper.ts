import * as THREE from "three";
import { RoundedBoxGeometry, GLTF, GLTFLoader } from "three-stdlib";

export const createMesh = () => {
  const loader = new GLTFLoader();
  const defaultMaterial = new THREE.MeshLambertMaterial({
    color: "white",
    flatShading: true,
  });

  const Model = async (
    modelPath: string
  ): Promise<{
    model: THREE.Group;
    animations: THREE.AnimationClip[];
    mixer: THREE.AnimationMixer;
    update: (delta: number) => void;
  }> => {
    return new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        (gltf: GLTF) => {
          const model = gltf.scene as THREE.Group;
          const animations = gltf.animations;
          const mixer = new THREE.AnimationMixer(model);

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          resolve({
            model,
            animations,
            mixer,
            update: (delta: number) => {
              if (mixer) {
                mixer.update(delta);
              }
            },
          });
        },
        undefined,
        (error: ErrorEvent) => {
          console.error("Error al cargar el modelo:", error.message);
          reject(error);
        }
      );
    });
  };

  const Box = (
    x: number,
    y: number,
    z: number,
    material: any = defaultMaterial
  ) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), material);
    box.receiveShadow = true;

    return box;
  };

  const RoundedBox = (
    x: number,
    y: number,
    z: number,
    segments: number,
    radius: number,
    material: THREE.MeshLambertMaterial
  ) => {
    const geometry = new RoundedBoxGeometry(x, y, z, segments, radius);
    return new THREE.Mesh(geometry, material);
  };

  const Cilinder = (
    radioTop: number,
    radioBottom: number,
    height: number,
    radialSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(radioTop, radioBottom, height, radialSegments),
      material
    );
  };

  const Sphere = (
    radius: number,
    widthSegments: number,
    heightSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, widthSegments, heightSegments),
      material
    );
  };

  const Plane = (
    x: number,
    z: number,
    material: THREE.MeshLambertMaterial = defaultMaterial
  ) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(x, z), material);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
  };

  const Torus = (
    radius: number,
    tube: number,
    radialSegments: number,
    tubularSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments),
      material
    );
  };

  const Ring = (
    innerRadius: number,
    outerRadius: number,
    thetaSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments),
      material
    );
  };

  return {
    Model,
    Box,
    RoundedBox,
    Cilinder,
    Sphere,
    Plane,
    Torus,
    Ring,
  };
};
