import { useRouteError, isRouteErrorResponse } from 'react-router';

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.statusText}</h1>
      </div>
    );
  }

  // For unexpected errors (like thrown Error objects)
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{(error as Error)?.message || 'Unknown error occurred'}</p>
    </div>
  );
};

export default ErrorPage;
