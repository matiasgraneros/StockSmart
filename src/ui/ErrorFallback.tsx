export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="h-dvh flex flex-col items-center pt-24 bg-olivine-50 dark:bg-olivine-950 text-olivine-950 dark:text-olivine-50">
      <h1 className="text-2xl font-medium mb-10">Something went wrong :(</h1>
      <p className="text-base font-medium">
        {error.message ||
          'An unexpected error occurred. Please try again later.'}
      </p>
      <button
        className="text-base font-medium py-2 px-4 bg-olivine-950 dark:bg-olivine-50 text-olivine-50 dark:text-olivine-950 rounded-md mt-10 hover:bg-olivine-900 dark:hover:bg-olivine-100"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}
