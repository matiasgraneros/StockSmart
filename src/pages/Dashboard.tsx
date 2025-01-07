import { FaRegCircleUser } from 'react-icons/fa6';
import { AppLogo } from '../ui/Icons';
import { useAuth } from '../context/useAuth';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../services/authService';
import toast from 'react-hot-toast';
import CancelButton from '../ui/CancelButton';
import ConfirmButton from '../ui/ConfirmButton';
import ThemeToggle from '../ui/ThemeToggle';
import { MdLogout } from 'react-icons/md';

export default function Dashboard() {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userEmail, logout: logoutContext } = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleDropDown(event: React.MouseEvent) {
    event.stopPropagation();
    setDropdownIsOpen((isOpen) => !isOpen);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function handleLogoutButton() {
    setModalIsOpen(true);
    setDropdownIsOpen(false);
  }

  const mutation = useMutation({
    mutationFn: logout,
    onError: (error: Error) => {
      if (
        error.message === 'Invalid token' ||
        error.message === 'Token not provided'
      ) {
        queryClient.clear();
        logoutContext();
        navigate('/', { replace: true });
      } else {
        toast.error(error.message);
      }
    },
    onSuccess: (data) => {
      queryClient.clear();
      logoutContext();
      toast.success(data.message);
      navigate('/login', { replace: true });
    },
  });

  function handleLogout() {
    mutation.mutate();
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownIsOpen(false);
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownIsOpen(false);
      }
    }

    if (dropdownIsOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [dropdownIsOpen]);

  return (
    <div className="w-full min-h-dvh transition-colors bg-olivine-50 dark:bg-olivine-950">
      <header className="py-2 px-4 flex justify-center border-b-solid border-b border-b-olivine-200 dark:border-b-olivine-700">
        <div className="flex w-full max-w-[1200px] justify-between">
          <Link to="/dashboard">
            <AppLogo className="fill-olivine-600 w-60 drop-shadow-sm lg:w-72 dark:fill-olivine-50" />
          </Link>
          <div className="flex items-center relative">
            <button
              onClick={handleDropDown}
              className="flex gap-2 items-center"
            >
              <p className="text-sm hidden text-olivine-950 sm:block dark:text-olivine-50">
                {userEmail}
              </p>
              <FaRegCircleUser className="text-olivine-600 text-3xl dark:text-olivine-50" />
            </button>

            {dropdownIsOpen && (
              <div
                ref={dropdownRef}
                className="bg-olivine-50 w-56 absolute right-0 top-12 border border-olivine-200 shadow-md rounded-md flex flex-col z-10 dark:bg-olivine-900 dark:border-olivine-700"
              >
                <p className="text-sm w-full truncate border-b border-olivine-200 py-2 pl-4 sm:hidden text-olivine-950 dark:text-olivine-50 dark:border-olivine-700">
                  {userEmail}
                </p>
                <div className="p-2">
                  <ThemeToggle closeDropdown={() => setDropdownIsOpen(false)} />
                  <button
                    onClick={handleLogoutButton}
                    className="flex items-center justify-between font-medium text-base w-full hover:bg-olivine-200 text-olivine-950 p-2 rounded-md dark:text-olivine-50 dark:hover:bg-olivine-700"
                  >
                    <p>Log out</p>
                    <MdLogout />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </main>
      {modalIsOpen && (
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <div className="min-h-40 bg-olivine-50 border border-olivine-300 rounded-md px-5 py-6 shadow-sm text-olivine-950 flex flex-col justify-between dark:bg-olivine-950 dark:border-olivine-700 dark:text-olivine-50">
            <h1 className="text-lg font-semibold">
              Are you sure you want to log out?
            </h1>
            <div className="flex w-full justify-end gap-2">
              <CancelButton cancelFunction={closeModal} />
              <ConfirmButton text="Log out" confirmFunction={handleLogout} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
