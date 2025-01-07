import { useQuery } from '@tanstack/react-query';
import { getInventories } from '../services/inventoriesServices';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth';
import { useEffect, useState } from 'react';
import { transformDate } from '../utils/functions';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import CreateInventoryForm from '../features/inventories/CreateInventoryForm';
import { FaPlus } from 'react-icons/fa';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';

type Inventory = {
  name: string;
  id: number;
  createdAt: Date;
};

export default function Inventories() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const {
    data: inventories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['inventories'],
    queryFn: getInventories,
    retry: false,
  });

  useEffect(() => {
    if (
      error instanceof Error &&
      (error.message === 'Token not provided' ||
        error.message === 'Invalid token')
    ) {
      logout();
      toast('Please log in to continue');
      navigate('/login', { replace: true });
    }
  }, [error, logout, navigate]);

  if (isLoading) return <Loader />;

  if (error instanceof Error && error.message === 'Failed to fetch') {
    return <ErrorMessage />;
  }

  if (error instanceof Error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h1 className="text-olivine-950 text-2xl font-bold dark:text-olivine-50">
          Inventories
        </h1>
        {userRole === 'ADMIN' && (
          <button
            onClick={openModal}
            className="bg-olivine-600 shadow-sm py-3 px-4 pl-3 text-olivine-50 flex items-center justify-center rounded-md text-base  hover:bg-olivine-700 dark:bg-olivine-50 dark:text-olivine-950 dark:hover:bg-olivine-100"
          >
            <FaPlus className="text-base inline" />
            <p className="pl-2 text-sm font-medium">Create new inventory</p>
          </button>
        )}
      </div>

      {inventories.length === 0 && (
        <h2 className="text-sm font-medium text-olivine-950 dark:text-olivine-50 mt-12 text-center">
          {userRole === 'ADMIN'
            ? 'You have no inventories yet.'
            : 'You are not registered in any inventory yet.'}
        </h2>
      )}

      <ul className="gap-2 mt-4 mb-24 flex flex-col">
        {inventories.map((inventory: Inventory) => (
          <li key={inventory.name}>
            <Link
              to={
                userRole === 'ADMIN'
                  ? `/dashboard/inventory/${inventory.id}`
                  : `/dashboard/operations/create/${inventory.id}`
              }
              className="bg-olivine-100 shadow-sm h-20 py-2 px-2 text-olivine-950 flex flex-col items-start justify-around sm:flex-row sm:items-center sm:justify-between rounded-md text-base w-full border border-olivine-200 lg:px-6 hover:bg-olivine-200 hover:border-olivine-300 dark:bg-olivine-900 dark:text-olivine-50 dark:hover:bg-olivine-700 dark:border-olivine-700 dark:hover:border-olivine-500"
            >
              <p className="font-medium truncate text-base">{inventory.name}</p>
              <p>
                <span className="font-medium text-sm">Created at:</span>{' '}
                <span className="text-sm">
                  {transformDate(inventory.createdAt)}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {modalIsOpen && (
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <CreateInventoryForm closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}
