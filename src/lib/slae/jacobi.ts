import { IterativeSettings, Matrix, SolveResult, Vector } from './types';
import { cloneVector, isSquareMatrix, maxNorm, multiplyMatrixVector, subtractVectors } from './utils';

export const solveJacobi = (
  A: Matrix,
  B: Vector,
  settings: IterativeSettings
): SolveResult => {
  if (!isSquareMatrix(A) || A.length !== B.length) {
    return { solution: null, success: false, message: 'Matrix must be square and match vector length.' };
  }

  const n = A.length;
  const epsilon = settings.epsilon ?? 1e-6;
  const maxIterations = settings.maxIterations ?? 1000;
  let x: Vector = settings.initialGuess ? cloneVector(settings.initialGuess) : Array(n).fill(0);
  const stepsLog: string[] = [];

  for (let iter = 1; iter <= maxIterations; iter++) {
    const next: Vector = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) sum += A[i][j] * x[j];
      }
      if (Math.abs(A[i][i]) < 1e-12) {
        return { solution: null, success: false, message: 'Zero pivot encountered.' };
      }
      next[i] = (B[i] - sum) / A[i][i];
    }
    const diff = subtractVectors(next, x);
    const norm = maxNorm(diff);
    x = next;
    stepsLog.push(`Iter ${iter}: x = [${x.map((v) => v.toFixed(6)).join(', ')}], Δ = ${norm}`);
    if (norm < epsilon) {
      const residual = subtractVectors(multiplyMatrixVector(A, x), B);
      return {
        solution: x,
        success: true,
        message: 'Jacobi method converged.',
        iterations: iter,
        residual,
        stepsLog
      };
    }
  }

  return {
    solution: cloneVector(x),
    success: false,
    message: 'Jacobi method did not converge within the maximum iterations.',
    iterations: maxIterations,
    residual: subtractVectors(multiplyMatrixVector(A, x), B),
    stepsLog
  };
};
