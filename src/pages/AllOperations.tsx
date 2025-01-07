import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getAllOperations } from '../services/operationsService';
import { transformDate } from '../utils/functions';
import { useAuth } from '../context/useAuth';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';
import Pagination from '../ui/Pagination';

interface Operation {
  id: number;
  type: string;
  quantity: number;
  createdAt: Date;
  user: {
    email: string;
  };
  item: {
    name: string;
  };
}

export default function AllOperations() {
  const { inventoryId } = useParams() as {
    inventoryId: string;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const {
    data: operations,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`all-operations-inventory-${inventoryId}`, currentPage],
    queryFn: () => getAllOperations(inventoryId, currentPage),
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
  }, [error, navigate, logout]);

  if (isLoading) return <Loader />;

  if (error instanceof Error && error.message === 'Failed to fetch') {
    return <ErrorMessage />;
  }

  if (error instanceof Error) {
    return (
      <p className="text-olivine-950 dark:text-olivine-50">
        Error: {error.message}
      </p>
    );
  }

  return (
    <>
      <h3 className="text-olivine-950 text-sm font-medium dark:text-olivine-50">
        Total operations:{' '}
        <span className="text-olivine-500 text-base font-medium dark:text-olivine-300">
          {operations.pagination.totalOperations}
        </span>
      </h3>

      {operations.pagination.totalOperations === 0 || (
        <>
          <div className="table-container overflow-x-auto">
            <table className="w-full mt-3 text-sm text-left min-w-[700px] text-olivine-950 dark:text-olivine-50">
              <thead className="border-b border-olivine-200 dark:border-olivine-700">
                <tr className="h-10">
                  <th className="w-[10%] pl-5">Type</th>
                  <th className="w-[20%] mr-2">User</th>
                  <th className="w-[20%]">Created at</th>
                  <th className="w-[20%]">Item</th>
                  <th className="w-[10%] text-right pr-5">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olivine-200 dark:divide-olivine-700">
                {operations.data.map((operation: Operation) => (
                  <tr
                    className="h-10 hover:bg-olivine-200 dark:hover:bg-olivine-900"
                    key={operation.id}
                  >
                    <td className="pl-5">{operation.type}</td>
                    <td>{operation.user.email}</td>
                    <td>{transformDate(operation.createdAt)}</td>
                    <td>{operation.item.name}</td>
                    <td className="text-right pr-5">{operation.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={operations.pagination.currentPage}
            totalPages={operations.pagination.totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
