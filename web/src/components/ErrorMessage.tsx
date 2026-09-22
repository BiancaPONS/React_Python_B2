interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="status-message status-error" role="alert">
      {message}
    </p>
  );
}

export default ErrorMessage;