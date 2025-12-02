import './IterationsTable.css';

interface Props {
  steps: string[];
}

const IterationsTable = ({ steps }: Props) => {
  return (
    <div className="iterations">
      <h3>Iteration log</h3>
      <ul>
        {steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default IterationsTable;
