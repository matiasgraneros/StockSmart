export default function ConfirmButton({
  confirmFunction,
  disabled,
  text,
  color,
}: {
  confirmFunction?: () => void;
  disabled?: boolean;
  text: string;
  color?: 'red';
}) {
  let classes =
    'px-4 py-2 border text-sm font-medium rounded-md outline-offset-4 disabled:bg-gray-400 dark:disabled:bg-gray-400 disabled:border-gray-400 dark:disabled:border-gray-400 ';

  if (color === 'red') {
    classes +=
      'bg-red-800 border-red-800 hover:bg-red-600 hover:border-red-600 text-red-50';
  } else {
    classes +=
      'bg-olivine-950 border-olivine-950 hover:bg-olivine-800 hover:border-olivine-800 text-olivine-50 dark:bg-olivine-50 dark:text-olivine-950 dark:border-olivine-50 dark:hover:bg-olivine-100 dark:hover:border-olivine-100';
  }

  return (
    <button onClick={confirmFunction} disabled={disabled} className={classes}>
      {text}
    </button>
  );
}
