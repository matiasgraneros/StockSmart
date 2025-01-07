import { useEffect, useState } from 'react';
import { AppLogo } from '../ui/Icons';
import { BsList, BsXLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function Homepage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  const sideBarClass = isSidebarOpen
    ? 'sidebar h-full z-10 w-44 fixed top-0 right-0 flex flex-col pt-20 bg-olivine-50 md:translate-x-full translate-x-0 transition-transform shadow-sm'
    : 'sidebar h-full z-10 w-44 fixed top-0 right-0 flex flex-col pt-20 bg-olivine-50 translate-x-full transition-transform';

  useEffect(() => {
    if (!isSidebarOpen) return;

    function closeSidebarOnClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target?.classList.contains('sidebar')) {
        setSidebarOpen(false);
      }
    }

    function closeSidebarOnEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('keydown', closeSidebarOnEscape);
    document.addEventListener('click', closeSidebarOnClick, true);

    return () => {
      document.removeEventListener('click', closeSidebarOnClick, true);
      document.removeEventListener('keydown', closeSidebarOnEscape);
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-gradient-to-b from-olivine-50 to-olivine-200 w-full min-h-dvh">
      <header className="p-2 px-3 border-b-solid border-b border-b-olivine-200">
        <div className="flex justify-between items-center max-w-[1200px] mx-auto">
          <AppLogo className="fill-olivine-600 w-64 lg:w-72 drop-shadow-sm" />

          <nav className="gap-3 items-center hidden md:flex">
            <Link
              to="/login"
              className="text-olivine-600 text-base font-semibold py-1 h-11 hover:text-olivine-800 active:text-olivine-900 hover:drop-shadow-md flex items-center"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-olivine-50 text-base font-semibold bg-olivine-600 px-3 rounded-full py-1 h-11 hover:bg-olivine-700 active:bg-olivine-900 hover:drop-shadow-md flex items-center"
            >
              Sign up
            </Link>
          </nav>

          <button
            onClick={toggleSidebar}
            className="md:hidden text-olivine-600 text-2xl font-semibold py-1 h-11 hover:text-olivine-800 active:text-olivine-900 hover:drop-shadow-md z-20"
          >
            {isSidebarOpen ? <BsXLg className="text-xl" /> : <BsList />}
          </button>
        </div>
      </header>

      <div className={sideBarClass}>
        <Link
          tabIndex={isSidebarOpen ? 0 : -1}
          to="/login"
          className="text-olivine-600 text-base font-semibold py-1 h-11 hover:text-olivine-800 active:text-olivine-900 hover:drop-shadow-md text-center"
        >
          Log in
        </Link>
        <Link
          tabIndex={isSidebarOpen ? 0 : -1}
          to="/signup"
          className="text-olivine-600 text-base font-semibold py-1 h-11 hover:text-olivine-800 active:text-olivine-900 hover:drop-shadow-md text-center"
        >
          Sign up
        </Link>
      </div>

      <main className="flex w-full flex-col gap-5 mt-24 items-center px-4">
        <h1 className="text-4xl font-bold text-center text-olivine-950">
          Inventory Management Software
        </h1>
        <h3 className="text-center max-w-lg text-lg font-medium text-olivine-950">
          StockSmart: Your intelligent inventory management solution, empowering
          businesses to track, optimize, and control stock with unparalleled
          precision and ease.
        </h3>
        <Link
          to="/signup"
          className="text-olivine-50 text-lg font-semibold bg-olivine-600 px-3 rounded-full py-1 h-14 w-72 mt-8 hover:bg-olivine-700 active:bg-olivine-900 hover:drop-shadow-md flex items-center justify-center"
        >
          Sign up and get started!
        </Link>
      </main>
    </div>
  );
}
