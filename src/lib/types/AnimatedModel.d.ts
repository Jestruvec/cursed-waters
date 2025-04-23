export interface AnimatedModel {
  model: THREE.Group;
  animations: THREE.AnimationClip[];
  mixer: THREE.AnimationMixer;
  update: (delta: number) => void;
  isDying?: boolean;
  difficulty?: number;
}
