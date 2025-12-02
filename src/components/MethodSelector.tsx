import './MethodSelector.css';

const OPTIONS = [
  { value: 'cramer', label: 'Cramer' },
  { value: 'gauss', label: 'Gaussian elimination' },
  { value: 'gaussSeidel', label: 'Gauss–Seidel' },
  { value: 'gaussJordan', label: 'Gauss–Jordan' },
  { value: 'jacobi', label: 'Jacobi' }
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const MethodSelector = ({ value, onChange }: Props) => {
  return (
    <div className="method-selector">
      <label htmlFor="method">Method</label>
      <select id="method" value={value} onChange={(e) => onChange(e.target.value)}>
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MethodSelector;
