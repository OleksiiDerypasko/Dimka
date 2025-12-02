import { Matrix, Vector } from './types';

export const cloneMatrix = (matrix: Matrix): Matrix => matrix.map((row) => [...row]);
export const cloneVector = (vector: Vector): Vector => [...vector];

export const isSquareMatrix = (matrix: Matrix) =>
  Array.isArray(matrix) && matrix.length > 0 && matrix.every((row) => row.length === matrix.length);

export const multiplyMatrixVector = (A: Matrix, x: Vector): Vector =>
  A.map((row) => row.reduce((sum, val, idx) => sum + val * x[idx], 0));

export const subtractVectors = (a: Vector, b: Vector): Vector => a.map((v, i) => v - b[i]);

export const maxNorm = (v: Vector): number => Math.max(...v.map((value) => Math.abs(value)));

export const swapRows = (matrix: Matrix, i: number, j: number) => {
  const temp = matrix[i];
  matrix[i] = matrix[j];
  matrix[j] = temp;
};

export const determinant = (matrix: Matrix): number => {
  if (!isSquareMatrix(matrix)) return NaN;
  const n = matrix.length;
  const m = cloneMatrix(matrix);
  let det = 1;

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(m[r][i]) > Math.abs(m[pivot][i])) {
        pivot = r;
      }
    }
    if (Math.abs(m[pivot][i]) < 1e-12) return 0;
    if (pivot !== i) {
      swapRows(m, pivot, i);
      det *= -1;
    }
    det *= m[i][i];
    const pivotVal = m[i][i];
    for (let r = i + 1; r < n; r++) {
      const factor = m[r][i] / pivotVal;
      for (let c = i; c < n; c++) {
        m[r][c] -= factor * m[i][c];
      }
    }
  }
  return det;
};

export const parseSlaeFromText = (text: string): { matrix: Matrix; vector: Vector } => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error('File is empty.');
  }

  const n = parseInt(lines[0], 10);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error('First line must contain a positive integer size n.');
  }
  if (lines.length - 1 < n) {
    throw new Error(`Expected ${n} rows with coefficients, found ${lines.length - 1}.`);
  }

  const matrix: Matrix = [];
  const vector: Vector = [];

  for (let i = 0; i < n; i++) {
    const parts = lines[i + 1].split(/\s+/).filter((p) => p.length > 0);
    if (parts.length !== n + 1) {
      throw new Error(`Line ${i + 2}: expected ${n + 1} numbers, got ${parts.length}.`);
    }
    const numbers = parts.map((p) => Number(p));
    if (numbers.some((num) => Number.isNaN(num))) {
      throw new Error(`Line ${i + 2}: contains non-numeric values.`);
    }
    matrix.push(numbers.slice(0, n));
    vector.push(numbers[n]);
  }

  return { matrix, vector };
};
