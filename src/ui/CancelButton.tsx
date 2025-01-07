export default function CancelButton({
  cancelFunction,
}: {
  cancelFunction: () => void;
}) {
  return (
    <button
      className="px-4 py-2 border border-olivine-300 text-olivine-950 hover:bg-olivine-200 text-sm font-medium rounded-md outline-offset-4 dark:border-olivine-700 dark:text-olivine-50 dark:hover:bg-olivine-900"
      onClick={cancelFunction}
      type="button"
    >
      Cancel
    </button>
  );
}
