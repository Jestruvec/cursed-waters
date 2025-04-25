export interface AnimatedModel {
  model: THREE.Group;
  animations: THREE.AnimationClip[];
  mixer: THREE.AnimationMixer;
  update: (delta: number) => void;
  healthPoints?: number;
  isDying?: boolean;
  difficulty?: number;
}
