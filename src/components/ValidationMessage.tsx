import './ValidationMessage.css';

interface Props {
  message: string;
}

const ValidationMessage = ({ message }: Props) => {
  return <div className="validation">{message}</div>;
};

export default ValidationMessage;
