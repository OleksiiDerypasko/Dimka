import { Matrix, SolveResult, Vector } from './types';
import { cloneMatrix, cloneVector, isSquareMatrix, multiplyMatrixVector, subtractVectors, swapRows } from './utils';

export const solveGauss = (A: Matrix, B: Vector): SolveResult => {
  if (!isSquareMatrix(A) || A.length !== B.length) {
    return { solution: null, success: false, message: 'Matrix must be square and match vector length.' };
  }

  const n = A.length;
  const m = cloneMatrix(A);
  const b = cloneVector(B);

  // Forward elimination with partial pivoting
  for (let k = 0; k < n - 1; k++) {
    let pivotRow = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(m[i][k]) > Math.abs(m[pivotRow][k])) {
        pivotRow = i;
      }
    }
    if (Math.abs(m[pivotRow][k]) < 1e-12) {
      return { solution: null, success: false, message: 'Matrix is singular or nearly singular.' };
    }
    if (pivotRow !== k) {
      swapRows(m, k, pivotRow);
      const tmp = b[k];
      b[k] = b[pivotRow];
      b[pivotRow] = tmp;
    }

    for (let i = k + 1; i < n; i++) {
      const factor = m[i][k] / m[k][k];
      m[i][k] = 0;
      for (let j = k + 1; j < n; j++) {
        m[i][j] -= factor * m[k][j];
      }
      b[i] -= factor * b[k];
    }
  }

  // Back substitution
  const x: Vector = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += m[i][j] * x[j];
    }
    if (Math.abs(m[i][i]) < 1e-12) {
      return { solution: null, success: false, message: 'Matrix is singular.' };
    }
    x[i] = (b[i] - sum) / m[i][i];
  }

  const residual = subtractVectors(multiplyMatrixVector(A, x), B);
  return { solution: x, success: true, message: 'Solved using Gaussian elimination.', residual };
};
