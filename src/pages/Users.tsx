import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineDeleteForever } from 'react-icons/md';
import toast from 'react-hot-toast';

import { getUsers } from '../services/usersService';
import { useAuth } from '../context/useAuth';
import RemoveUser from '../features/inventory/RemoveUser';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import AddUserToInventoryForm from '../features/inventory/AddUserToInventoryForm';
import ErrorMessage from '../ui/ErrorMessage';

interface User {
  email: string;
  role: string;
}

interface ModalState {
  type: 'addUser' | 'removeUser';
  email?: string;
}

export default function Users() {
  const { inventoryId } = useParams() as { inventoryId: string };
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);
  const navigate = useNavigate();
  const { logout, userEmail } = useAuth();

  function openAddUserModal() {
    setActiveModal({ type: 'addUser' });
  }
  function openRemoveUserModal(email: string) {
    setActiveModal({ type: 'removeUser', email });
  }
  function closeModal() {
    setActiveModal(null);
  }

  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`users-inventory-${inventoryId}`],
    queryFn: () => getUsers(inventoryId),
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
    <>
      <div className="flex w-full justify-between items-center mb-5 mt-3 text-olivine-950 dark:text-olivine-50">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={openAddUserModal}
          className="bg-olivine-600 font-semibold flex px-4 py-2 items-center shadow-sm text-olivine-50 rounded-md text-sm hover:bg-olivine-700 dark:bg-olivine-50 dark:text-olivine-950 dark:hover:bg-olivine-100"
        >
          <p>Add user</p>
        </button>
      </div>

      <table className="w-full text-left table-fixed text-sm text-olivine-950 dark:text-olivine-50">
        <thead className="border-b border-olivine-200 dark:border-olivine-700">
          <tr className="h-10">
            <th className="pl-5 w-1/2">User email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-olivine-200 dark:divide-olivine-700">
          {users.map((user: User) => (
            <tr
              key={user.email}
              className=" hover:bg-olivine-200 h-10 dark:hover:bg-olivine-900"
            >
              <td className="pl-5 truncate">{user.email}</td>
              <td>{user.role}</td>

              {
                <td className="text-right">
                  {userEmail === user.email ? null : (
                    <p className="flex justify-end pr-4">
                      <button onClick={() => openRemoveUserModal(user.email)}>
                        <MdOutlineDeleteForever className="text-2xl text-red-800 hover:text-red-600" />
                      </button>
                    </p>
                  )}
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>

      {activeModal && (
        <Modal isOpen={!!activeModal} onClose={closeModal}>
          {activeModal.type === 'addUser' && (
            <AddUserToInventoryForm
              inventoryId={Number(inventoryId)}
              closeModal={closeModal}
            />
          )}

          {activeModal.type === 'removeUser' && (
            <RemoveUser
              userEmail={activeModal.email as string}
              inventoryId={Number(inventoryId)}
              closeModal={closeModal}
            />
          )}
        </Modal>
      )}
    </>
  );
}
