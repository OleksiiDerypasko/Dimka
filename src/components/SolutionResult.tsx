import { ReactNode } from 'react';
import { SolveResult, Vector } from '../lib/slae/types';
import './SolutionResult.css';

interface Props {
  result: SolveResult;
  onCheck: () => void;
  checkInfo: { flag: boolean; residual: Vector } | null;
  epsilon: number;
  children?: ReactNode;
}

const SolutionResult = ({ result, onCheck, checkInfo, epsilon, children }: Props) => {
  return (
    <section className="solution">
      <div className="solution-header">
        <h2>Result</h2>
        <span className={result.success ? 'status success' : 'status error'}>
          {result.success ? 'Success' : 'Failed'}
        </span>
      </div>
      <p className="message">{result.message}</p>

      {result.solution && (
        <div className="solution-vector">
          <h3>Solution vector</h3>
          <ul>
            {result.solution.map((value, idx) => (
              <li key={idx}>
                x{idx + 1} = {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {typeof result.iterations === 'number' && (
        <p className="meta">Iterations: {result.iterations}</p>
      )}
      {result.residual && (
        <p className="meta">Residual: [{result.residual.join(', ')}]</p>
      )}

      <div className="actions">
        <button type="button" onClick={onCheck} disabled={!result.solution}>
          Check solution (ε = {epsilon})
        </button>
      </div>

      {checkInfo && (
        <div className="check-result">
          <p>Check flag: {checkInfo.flag ? 'true' : 'false'}</p>
          <p>Residual: [{checkInfo.residual.join(', ')}]</p>
        </div>
      )}

      {children}
    </section>
  );
};

export default SolutionResult;
