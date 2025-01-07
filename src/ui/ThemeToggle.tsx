import { IoSunny } from 'react-icons/io5';
import { MdOutlineDarkMode } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext/useTheme';

export default function ThemeToggle({
  closeDropdown,
}: {
  closeDropdown: () => void;
}) {
  const { theme, toggleTheme } = useTheme();

  function handleTheme() {
    toggleTheme();
    closeDropdown();
  }

  return (
    <button
      onClick={handleTheme}
      className="flex items-center justify-between font-medium text-base w-full hover:bg-olivine-200 text-olivine-950 p-2 rounded-md dark:text-olivine-50 dark:hover:bg-olivine-700"
    >
      <p>Theme</p>
      {theme === 'dark' ? <IoSunny /> : <MdOutlineDarkMode />}
    </button>
  );
}
