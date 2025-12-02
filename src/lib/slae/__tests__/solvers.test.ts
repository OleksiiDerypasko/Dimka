import { describe, expect, it } from 'vitest';
import { solveCramer } from '../cramer';
import { solveGauss } from '../gauss';
import { solveGaussJordan } from '../gaussJordan';
import { solveGaussSeidel } from '../gaussSeidel';
import { solveJacobi } from '../jacobi';
import { checkSolution } from '../checkSolution';
import { parseSlaeFromText } from '../utils';

describe('direct methods', () => {
  const A = [
    [2, 1],
    [5, 7]
  ];
  const B = [11, 13];
  const expected = [64 / 9, -29 / 9];

  it('solves with Cramer', () => {
    const result = solveCramer(A, B);
    expect(result.success).toBe(true);
    expect(result.solution).toBeDefined();
    result.solution && result.solution.forEach((v, idx) => expect(v).toBeCloseTo(expected[idx], 6));
  });

  it('blocks oversized Cramer systems', () => {
    const bigA = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (__, j) => (i === j ? 1 : 0)));
    const bigB = [1, 1, 1, 1, 1];
    const result = solveCramer(bigA, bigB);
    expect(result.success).toBe(false);
  });

  it('solves with Gauss and Gauss-Jordan', () => {
    const gauss = solveGauss(A, B);
    const jordan = solveGaussJordan(A, B);
    expect(gauss.success).toBe(true);
    expect(jordan.success).toBe(true);
    expect(gauss.solution && gauss.solution[0]).toBeCloseTo(expected[0], 6);
    expect(jordan.solution && jordan.solution[1]).toBeCloseTo(expected[1], 6);
  });
});

describe('iterative methods', () => {
  const A = [
    [4, 1],
    [2, 3]
  ];
  const B = [1, 2];

  it('Gauss-Seidel converges on a diagonally dominant system', () => {
    const result = solveGaussSeidel(A, B, { epsilon: 1e-6, maxIterations: 50 });
    expect(result.success).toBe(true);
    expect(result.solution?.[0]).toBeCloseTo(0.1, 3);
  });

  it('Jacobi converges on a diagonally dominant system', () => {
    const result = solveJacobi(A, B, { epsilon: 1e-6, maxIterations: 50 });
    expect(result.success).toBe(true);
    expect(result.solution?.[1]).toBeCloseTo(0.6, 3);
  });

  it('reports lack of convergence when iterations are limited', () => {
    const result = solveGaussSeidel(A, B, { epsilon: 1e-6, maxIterations: 2 });
    expect(result.success).toBe(false);
  });
});

describe('solution check and parsing', () => {
  it('validates solutions using residual', () => {
    const A = [
      [1, 0],
      [0, 1]
    ];
    const B = [3, -1];
    const X = [3, -1];
    const { flag, residual } = checkSolution(A, B, X, 1e-6);
    expect(flag).toBe(true);
    expect(residual).toEqual([0, 0]);
  });

  it('parses SLAE text files', () => {
    const sample = `2\n1 0 3\n0 1 -1`;
    const { matrix, vector } = parseSlaeFromText(sample);
    expect(matrix).toEqual([
      [1, 0],
      [0, 1]
    ]);
    expect(vector).toEqual([3, -1]);
  });
});
