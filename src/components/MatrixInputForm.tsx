import { useEffect, useMemo, useState } from 'react';
import { Matrix, Vector } from '../lib/slae/types';
import './MatrixInputForm.css';

interface Props {
  n: number;
  onNChange: (n: number) => void;
  matrix: Matrix;
  vector: Vector;
  onMatrixChange: (matrix: Matrix) => void;
  onVectorChange: (vector: Vector) => void;
  onSolve: () => void;
  method: string;
}

const MAX_N = 10;

const MatrixInputForm = ({
  n,
  onNChange,
  matrix,
  vector,
  onMatrixChange,
  onVectorChange,
  onSolve,
  method
}: Props) => {
  const [localN, setLocalN] = useState(n);

  useEffect(() => {
    setLocalN(n);
  }, [n]);

  const isCramerLimited = useMemo(() => method === 'cramer' && localN > 4, [method, localN]);

  const generateGrid = () => {
    const size = Math.min(Math.max(1, Math.floor(localN)), MAX_N);
    onNChange(size);
    const newMatrix: Matrix = Array.from({ length: size }, () => Array(size).fill(0));
    const newVector: Vector = Array(size).fill(0);
    onMatrixChange(newMatrix);
    onVectorChange(newVector);
  };

  const handleMatrixInput = (i: number, j: number, value: number) => {
    const next = matrix.map((row, rowIdx) =>
      rowIdx === i ? row.map((cell, colIdx) => (colIdx === j ? value : cell)) : row
    );
    onMatrixChange(next);
  };

  const handleVectorInput = (i: number, value: number) => {
    const next = vector.map((cell, idx) => (idx === i ? value : cell));
    onVectorChange(next);
  };

  return (
    <div className="matrix-input">
      <div className="matrix-input__controls">
        <label>
          Matrix size (n)
          <input
            type="number"
            value={localN}
            min={1}
            max={MAX_N}
            onChange={(e) => setLocalN(Number(e.target.value))}
          />
        </label>
        <button type="button" onClick={generateGrid}>
          Generate matrix
        </button>
        {method === 'cramer' && <span className="info-text">Cramer: n ≤ 4</span>}
      </div>

      {matrix.length > 0 && (
        <div className="matrix-input__grid">
          <div className="matrix-grid">
            {matrix.map((row, i) => (
              <div key={`row-${i}`} className="matrix-row">
                {row.map((value, j) => (
                  <input
                    key={`cell-${i}-${j}`}
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => handleMatrixInput(i, j, Number(e.target.value))}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="vector-grid">
            {vector.map((value, i) => (
              <input
                key={`b-${i}`}
                type="number"
                step="any"
                value={value}
                onChange={(e) => handleVectorInput(i, Number(e.target.value))}
              />
            ))}
          </div>
        </div>
      )}

      <div className="matrix-input__actions">
        <button type="button" onClick={onSolve} disabled={isCramerLimited}>
          Solve
        </button>
        {isCramerLimited && <span className="error">Cramer’s method supports n ≤ 4.</span>}
      </div>
    </div>
  );
};

export default MatrixInputForm;
