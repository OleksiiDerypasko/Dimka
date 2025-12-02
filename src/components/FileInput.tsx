import React, { useState } from 'react';
import { parseSlaeFromText } from '../lib/slae/utils';
import { Matrix, Vector } from '../lib/slae/types';
import './FileInput.css';

interface Props {
  onDataParsed: (matrix: Matrix, vector: Vector) => void;
  onSolve: () => void;
  matrix: Matrix;
  vector: Vector;
}

const FileInput = ({ onDataParsed, onSolve, matrix, vector }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const { matrix: parsedMatrix, vector: parsedVector } = parseSlaeFromText(text);
      onDataParsed(parsedMatrix, parsedVector);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="file-input">
      <label className="file-label">
        <input type="file" accept="text/plain" onChange={handleFileChange} />
      </label>
      {error && <div className="error">{error}</div>}

      {matrix.length > 0 && vector.length > 0 && (
        <div className="preview">
          <h3>Preview</h3>
          <div className="matrix-preview">
            <div className="matrix-grid">
              {matrix.map((row, i) => (
                <div key={`row-${i}`} className="matrix-row">
                  {row.map((value, j) => (
                    <span key={`cell-${i}-${j}`}>{value.toFixed(2)}</span>
                  ))}
                </div>
              ))}
            </div>
            <div className="vector-grid">
              {vector.map((value, i) => (
                <span key={`b-${i}`}>{value.toFixed(2)}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <button type="button" onClick={onSolve} disabled={matrix.length === 0}>
        Solve
      </button>
    </div>
  );
};

export default FileInput;
