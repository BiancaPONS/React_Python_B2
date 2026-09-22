interface LoadingMessageProps {
  message?: string;
}

function LoadingMessage({
  message = "Chargement...",
}: LoadingMessageProps) {
  return (
    <p className="status-message status-loading" role="status">
      {message}
    </p>
  );
}

export default LoadingMessage;