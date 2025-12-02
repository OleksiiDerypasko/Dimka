import { useMemo, useState } from 'react';
import MethodSelector from './components/MethodSelector';
import MatrixInputForm from './components/MatrixInputForm';
import FileInput from './components/FileInput';
import SolutionResult from './components/SolutionResult';
import ValidationMessage from './components/ValidationMessage';
import IterationsTable from './components/IterationsTable';
import { checkSolution } from './lib/slae/checkSolution';
import { solveCramer } from './lib/slae/cramer';
import { solveGauss } from './lib/slae/gauss';
import { solveGaussSeidel } from './lib/slae/gaussSeidel';
import { solveGaussJordan } from './lib/slae/gaussJordan';
import { solveJacobi } from './lib/slae/jacobi';
import { SolveResult, Matrix, Vector } from './lib/slae/types';
import './styles/app.css';

const METHOD_HINTS: Record<string, string> = {
  cramer: 'Cramer’s method supports only matrices up to 4x4.',
  gauss: 'Gaussian elimination with partial pivoting.',
  gaussSeidel: 'Gauss–Seidel iterative method (requires convergence).',
  gaussJordan: 'Gauss–Jordan elimination for full reduction.',
  jacobi: 'Jacobi iterative method (requires convergence).'
};

function App() {
  const [selectedMethod, setSelectedMethod] = useState('cramer');
  const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual');
  const [matrix, setMatrix] = useState<Matrix>([]);
  const [vector, setVector] = useState<Vector>([]);
  const [n, setN] = useState(3);
  const [epsilon, setEpsilon] = useState(1e-6);
  const [maxIterations, setMaxIterations] = useState(1000);
  const [result, setResult] = useState<SolveResult | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [checkInfo, setCheckInfo] = useState<{ flag: boolean; residual: Vector } | null>(null);

  const canUseIterative = useMemo(
    () => selectedMethod === 'gaussSeidel' || selectedMethod === 'jacobi',
    [selectedMethod]
  );

  const validateData = (): boolean => {
    if (!Number.isInteger(n) || n <= 0) {
      setValidationMessage('Matrix size must be a positive integer.');
      return false;
    }
    if (matrix.length !== n || vector.length !== n) {
      setValidationMessage('Matrix and vector dimensions do not match the specified size.');
      return false;
    }
    for (let i = 0; i < n; i++) {
      if (matrix[i].length !== n) {
        setValidationMessage(`Row ${i + 1} of the matrix does not contain ${n} elements.`);
        return false;
      }
      if (matrix[i].some((v) => Number.isNaN(v)) || Number.isNaN(vector[i])) {
        setValidationMessage('All coefficients must be valid numbers.');
        return false;
      }
    }
    setValidationMessage(null);
    return true;
  };

  const handleSolve = () => {
    if (!validateData()) {
      return;
    }

    let solveResult: SolveResult;
    const settings = {
      epsilon: Number.isFinite(epsilon) ? epsilon : 1e-6,
      maxIterations: Number.isFinite(maxIterations) ? maxIterations : 1000
    };

    switch (selectedMethod) {
      case 'cramer':
        solveResult = solveCramer(matrix, vector);
        break;
      case 'gauss':
        solveResult = solveGauss(matrix, vector);
        break;
      case 'gaussSeidel':
        solveResult = solveGaussSeidel(matrix, vector, settings);
        break;
      case 'gaussJordan':
        solveResult = solveGaussJordan(matrix, vector);
        break;
      case 'jacobi':
        solveResult = solveJacobi(matrix, vector, settings);
        break;
      default:
        solveResult = { success: false, message: 'Unknown method', solution: null };
        break;
    }

    setResult(solveResult);
    setCheckInfo(null);
  };

  const handleCheckSolution = () => {
    if (!result || !result.solution) return;
    const info = checkSolution(matrix, vector, result.solution, epsilon);
    setCheckInfo(info);
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>SLAE Solver</h1>
          <p>Compute solutions to linear systems using multiple numerical methods.</p>
        </div>
        <div className="method-hints">
          <MethodSelector value={selectedMethod} onChange={setSelectedMethod} />
          <p className="hint">{METHOD_HINTS[selectedMethod]}</p>
        </div>
      </header>

      <section className="input-mode">
        <div className="section-header">
          <h2>Data Source</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="manual"
                checked={inputMode === 'manual'}
                onChange={() => setInputMode('manual')}
              />
              Keyboard input
            </label>
            <label>
              <input
                type="radio"
                value="file"
                checked={inputMode === 'file'}
                onChange={() => setInputMode('file')}
              />
              Load from file
            </label>
          </div>
        </div>

        {inputMode === 'manual' ? (
          <MatrixInputForm
            n={n}
            onNChange={setN}
            matrix={matrix}
            vector={vector}
            onMatrixChange={setMatrix}
            onVectorChange={setVector}
            onSolve={handleSolve}
            method={selectedMethod}
          />
        ) : (
          <FileInput
            matrix={matrix}
            vector={vector}
            onDataParsed={(A, B) => {
              setMatrix(A);
              setVector(B);
              setN(A.length);
            }}
            onSolve={handleSolve}
          />
        )}
      </section>

      {canUseIterative && (
        <section className="settings">
          <h2>Iterative settings</h2>
          <div className="settings-grid">
            <label>
              Epsilon
              <input
                type="number"
                step="any"
                value={epsilon}
                onChange={(e) => setEpsilon(Number(e.target.value))}
              />
            </label>
            <label>
              Max iterations
              <input
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
              />
            </label>
          </div>
        </section>
      )}

      {validationMessage && <ValidationMessage message={validationMessage} />}

      {result && (
        <SolutionResult
          result={result}
          onCheck={handleCheckSolution}
          checkInfo={checkInfo}
          epsilon={epsilon}
        >
          {result.stepsLog && result.stepsLog.length > 0 && (
            <IterationsTable steps={result.stepsLog} />
          )}
        </SolutionResult>
      )}

      <section className="info">
        <h2>How to use</h2>
        <ul>
          <li>Choose a method in the header.</li>
          <li>Enter the system via keyboard or upload a text file in the specified format.</li>
          <li>Adjust iterative parameters for Gauss–Seidel or Jacobi if needed.</li>
          <li>Click solve to compute the solution and verify using the check button.</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
