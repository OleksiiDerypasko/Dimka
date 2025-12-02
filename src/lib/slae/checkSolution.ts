import { Matrix, Vector } from './types';
import { maxNorm, multiplyMatrixVector, subtractVectors } from './utils';

export const checkSolution = (
  A: Matrix,
  B: Vector,
  X: Vector,
  epsilon: number = 1e-6
): { flag: boolean; residual: Vector } => {
  const residual = subtractVectors(multiplyMatrixVector(A, X), B);
  const flag = maxNorm(residual) <= epsilon;
  return { flag, residual };
};
