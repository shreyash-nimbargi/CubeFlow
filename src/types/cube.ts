export type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';

export interface CubeFace {
  colors: CubeColor[][];
}

export interface CubeState {
  front: CubeFace;
  back: CubeFace;
  left: CubeFace;
  right: CubeFace;
  top: CubeFace;
  bottom: CubeFace;
}

export interface SolutionStep {
  move: string;
  description: string;
}