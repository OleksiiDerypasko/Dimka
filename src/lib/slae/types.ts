export type Matrix = number[][]; // n x n
export type Vector = number[]; // length n
export type SolutionVector = number[];

export type IterativeSettings = {
  epsilon: number;
  maxIterations: number;
  initialGuess?: Vector;
};

export type SolveResult = {
  solution: SolutionVector | null;
  success: boolean;
  message: string;
  iterations?: number;
  residual?: Vector;
  stepsLog?: string[];
};
