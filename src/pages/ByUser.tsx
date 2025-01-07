import { useQuery } from '@tanstack/react-query';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import toast from 'react-hot-toast';

import { getOperationsByUser } from '../services/operationsService';
import { transformDate } from '../utils/functions';
import { getUsers } from '../services/usersService';
import { useAuth } from '../context/useAuth';
import ErrorMessage from '../ui/ErrorMessage';
import Pagination from '../ui/Pagination';
import Loader from '../ui/Loader';

interface User {
  email: string;
  id: number;
}

interface Operation {
  id: number;
  type: string;
  quantity: number;
  createdAt: Date;
  item: {
    name: string;
  };
}

export default function ByUser() {
  const { inventoryId } = useParams() as {
    inventoryId: string;
  };
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const { data: users } = useQuery({
    queryKey: [`users-inventory-${inventoryId}`],
    queryFn: () => getUsers(inventoryId),
    retry: false,
  });

  const {
    data: operations,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`operations-user-${userId}`, currentPage],
    queryFn: () =>
      getOperationsByUser(inventoryId, userId as number, currentPage),
    enabled: !!userId,
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userEmail = formData.get('userEmail') as string;

    const user = users.filter((user: User) => user.email === userEmail);

    if (!user.at(0)) {
      toast.error('The user does not exist!');
      return;
    }

    setUserId(user.at(0).id);
    setUserEmail(user.at(0).email);
  }

  function goBack() {
    setUserEmail(null);
    setUserId(null);
  }

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

  return (
    <>
      {!userId && (
        <form onSubmit={handleSubmit} className="mb-3">
          <label
            htmlFor="userEmail"
            className="text-sm font-medium text-olivine-950 dark:text-olivine-50 block"
          >
            Enter the user email:
          </label>

          <div className="flex w-full max-w-[410px] mt-1 gap-1">
            <input
              type="email"
              required
              placeholder="email@example.com"
              autoFocus
              list="users-list"
              id="userEmail"
              name="userEmail"
              className="flex-grow bg-transparent border rounded-md text-olivine-950 dark:text-olivine-50 text-sm pl-2 h-9 border-olivine-200 dark:border-olivine-700"
            />

            <button className="bg-olivine-600 text-olivine-50 dark:bg-olivine-50 dark:text-olivine-950 h-9 w-20 flex justify-center items-center rounded-md hover:bg-olivine-700 dark:hover:bg-olivine-100">
              <FaMagnifyingGlass className="text-xl" />
            </button>
          </div>
          <datalist id="users-list">
            {users &&
              users.map((user: User) => {
                return <option key={user.id} value={user.email}></option>;
              })}
          </datalist>
        </form>
      )}

      {isLoading && <Loader />}
      {error instanceof Error && <ErrorMessage />}
      {operations && (
        <>
          <button onClick={goBack}>
            <IoMdArrowRoundBack className="text-olivine-600 text-2xl dark:text-olivine-50 hover:text-olivine-700 dark:hover:text-olivine-100" />
          </button>
          <h3 className="text-olivine-950 text-sm dark:text-olivine-50">
            Total operations of <span className="font-medium">{userEmail}</span>
            :{' '}
            <span className="text-olivine-500 text-base font-medium dark:text-olivine-300">
              {operations.pagination.totalOperations}
            </span>
          </h3>

          {operations.pagination.totalOperations > 0 && (
            <>
              <div className="table-container overflow-x-auto">
                <table className="w-full mt-3 text-sm text-left min-w-[550px] text-olivine-950 dark:text-olivine-50">
                  <thead className="border-b border-olivine-200 dark:border-olivine-700">
                    <tr className="h-10">
                      <th className="w-1/5 pl-5">Type</th>
                      <th className="w-[35%]">Created at</th>
                      <th className="w-[35%]">Item</th>
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
                        <td>{transformDate(operation.createdAt)}</td>
                        <td>{operation.item.name}</td>
                        <td className="text-right pr-5">
                          {operation.quantity}
                        </td>
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
      )}
    </>
  );
}
