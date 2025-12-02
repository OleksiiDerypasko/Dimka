import { Matrix, SolveResult, Vector } from './types';
import { cloneMatrix, isSquareMatrix, subtractVectors, multiplyMatrixVector, swapRows } from './utils';

export const solveGaussJordan = (A: Matrix, B: Vector): SolveResult => {
  if (!isSquareMatrix(A) || A.length !== B.length) {
    return { solution: null, success: false, message: 'Matrix must be square and match vector length.' };
  }

  const n = A.length;
  const aug: Matrix = cloneMatrix(A).map((row, i) => [...row, B[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > Math.abs(aug[pivot][col])) {
        pivot = r;
      }
    }
    if (Math.abs(aug[pivot][col]) < 1e-12) {
      return { solution: null, success: false, message: 'Matrix is singular; cannot pivot.' };
    }
    if (pivot !== col) {
      swapRows(aug, pivot, col);
    }

    const pivotVal = aug[col][col];
    for (let j = col; j <= n; j++) {
      aug[col][j] /= pivotVal;
    }

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r][col];
      for (let j = col; j <= n; j++) {
        aug[r][j] -= factor * aug[col][j];
      }
    }
  }

  const solution: Vector = aug.map((row) => row[n]);
  const residual = subtractVectors(multiplyMatrixVector(A, solution), B);
  return { solution, success: true, message: 'Solved using Gauss–Jordan elimination.', residual };
};
