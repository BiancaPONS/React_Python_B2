interface EmptyMessageProps {
  message: string;
}

function EmptyMessage({ message }: EmptyMessageProps) {
  return (
    <p className="status-message status-empty">
      {message}
    </p>
  );
}

export default EmptyMessage;