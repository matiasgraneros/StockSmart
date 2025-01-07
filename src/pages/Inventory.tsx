import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdOutlineContentPasteSearch } from 'react-icons/md';
import toast from 'react-hot-toast';

import { transformDate } from '../utils/functions';
import { getInventory } from '../services/inventoriesServices';
import { useAuth } from '../context/useAuth';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';
import Details from '../features/inventory/Details';

type Inventory = {
  name: string;
  id: number;
  createdAt: Date;
  _count: {
    categories: number;
    items: number;
    operations: number;
    users: number;
  };
};

export default function Inventory() {
  const { inventoryId } = useParams() as { inventoryId: string };
  const [detailsIsOpen, setDetailsIsOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleDetails(e: React.MouseEvent) {
    e.stopPropagation();
    setDetailsIsOpen((detailsIsOpen) => !detailsIsOpen);
  }

  const {
    data: inventory,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`inventory-${inventoryId}`],
    queryFn: () => getInventory(inventoryId),
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
      navigate('/login');
    }
  }, [error, navigate, logout]);

  if (isLoading) return <Loader />;

  if (error instanceof Error && error.message === 'Failed to fetch') {
    return <ErrorMessage />;
  }

  if (error instanceof Error) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      <div className="flex justify-between items-end border-b border-olivine-200 pb-1 mb-5 relative dark:border-olivine-700">
        <h1 className="text-olivine-950 font-semibold text-2xl truncate dark:text-olivine-50">
          {inventory.name}
        </h1>
        <button
          onClick={handleDetails}
          className="font-medium flex gap-1 items-center text-olivine-600 hover:text-olivine-950 dark:text-olivine-200 dark:hover:text-olivine-50"
        >
          <p>Details</p>
          <MdOutlineContentPasteSearch className="text-xl" />
        </button>

        {detailsIsOpen && (
          <Details
            detailsIsOpen={detailsIsOpen}
            setDetailsIsOpen={setDetailsIsOpen}
            users={inventory._count.users}
            categories={inventory._count.categories}
            items={inventory._count.items}
            operations={inventory._count.operations}
            createdAt={transformDate(inventory.createdAt)}
          />
        )}
      </div>

      <div className="flex justify-center">
        <div className="flex font-medium bg-olivine-200 w-fit p-1 rounded-md mb-5 dark:bg-olivine-700">
          <NavLink
            to={`/dashboard/inventory/${inventory.id}/users`}
            className="tab px-2 py-1 rounded-md sm:px-5 lg:px-10 text-olivine-600 hover:text-olivine-950 dark:text-olivine-200 dark:hover:text-olivine-50"
          >
            Users
          </NavLink>
          <NavLink
            to={`/dashboard/inventory/${inventory.id}/categories`}
            className="tab px-2 py-1 rounded-md sm:px-5 lg:px-10 text-olivine-600 hover:text-olivine-950 dark:text-olivine-200 dark:hover:text-olivine-50"
            /* end */
          >
            Categories
          </NavLink>
          <NavLink
            to={`/dashboard/inventory/${inventory.id}/operations/history`}
            className="tab px-2 py-1 rounded-md sm:px-5 lg:px-10 text-olivine-600 hover:text-olivine-950 dark:text-olivine-200 dark:hover:text-olivine-50"
          >
            Operations
          </NavLink>
          <NavLink
            to={`/dashboard/inventory/${inventory.id}/items`}
            className="tab px-2 py-1 rounded-md sm:px-5 lg:px-10 text-olivine-600 hover:text-olivine-950 dark:text-olivine-200 dark:hover:text-olivine-50"
          >
            All items
          </NavLink>
        </div>
      </div>

      <div>
        <Outlet />
      </div>
    </>
  );
}
