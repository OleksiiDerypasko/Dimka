import { Matrix, SolveResult, Vector } from './types';
import { determinant, isSquareMatrix, multiplyMatrixVector, subtractVectors } from './utils';

export const solveCramer = (A: Matrix, B: Vector): SolveResult => {
  if (!isSquareMatrix(A)) {
    return { solution: null, success: false, message: 'Matrix must be square.' };
  }

  const n = A.length;
  if (n !== B.length) {
    return { solution: null, success: false, message: 'Vector size must match matrix size.' };
  }

  if (n > 4) {
    return { solution: null, success: false, message: 'Cramer method supports n ≤ 4.' };
  }

  const detA = determinant(A);
  if (Math.abs(detA) < 1e-12) {
    return { solution: null, success: false, message: 'Matrix is singular (determinant is zero).' };
  }

  const solution: Vector = [];
  for (let col = 0; col < n; col++) {
    const replaced: Matrix = A.map((row, rowIdx) => row.map((val, colIdx) => (colIdx === col ? B[rowIdx] : val)));
    const detAi = determinant(replaced);
    solution.push(detAi / detA);
  }

  const residual = subtractVectors(multiplyMatrixVector(A, solution), B);
  return {
    solution,
    success: true,
    message: 'Solved using Cramer’s rule.',
    residual
  };
};
