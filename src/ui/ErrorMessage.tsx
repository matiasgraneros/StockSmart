export default function ErrorMessage() {
  return (
    <div className="mt-10 flex flex-col items-center">
      <p className="text-lg font-medium text-olivine-950 dark:text-olivine-50">
        It seems there's an issue with our connection.
      </p>
      <p className="text-lg font-medium text-olivine-950 dark:text-olivine-50">
        Please try again in a few minutes.
      </p>
    </div>
  );
}
