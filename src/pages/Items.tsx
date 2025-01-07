import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getItems } from '../services/itemsService';
import { useAuth } from '../context/useAuth';
import ErrorMessage from '../ui/ErrorMessage';
import DeleteItem from '../features/items/DeleteItem';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';

interface Item {
  id: number;
  name: string;
  quantity: number;
  category: {
    name: string;
  };
}

export default function Items() {
  const { inventoryId } = useParams() as { inventoryId: string };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  function closeModal() {
    setItemId(null);
    setModalIsOpen(false);
  }

  function openModal(id: number) {
    setItemId(id);
    setModalIsOpen(true);
  }

  const {
    data: items,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`items-inventory-${inventoryId}`],
    queryFn: () => getItems(inventoryId),
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
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      <div className="flex w-full justify-between items-center mb-5 mt-4 text-olivine-950 dark:text-olivine-50">
        <h2 className="text-xl font-semibold">All items</h2>
      </div>

      <table className="w-full text-sm text-left table-fixed mt-6 text-olivine-950 dark:text-olivine-50">
        <thead className="border-b border-olivine-200 dark:border-olivine-700">
          <tr className="h-10">
            <th className="pl-5 w-[30%]">Item name</th>
            <th className="w-[30%]">Category</th>
            <th className="w-[30%]">Quantity</th>
            <th className="w-[10%]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-olivine-200 dark:divide-olivine-700">
          {items.map((item: Item) => (
            <tr
              key={item.id}
              className=" hover:bg-olivine-200 h-10 dark:hover:bg-olivine-900"
            >
              <td className="pl-5 truncate">{item.name}</td>
              <td>{item.category.name}</td>
              <td>{item.quantity}</td>
              <td className="text-right">
                <p className="flex justify-end pr-4">
                  <button onClick={() => openModal(item.id)}>
                    <MdOutlineDeleteForever className="text-2xl text-red-800 hover:text-red-600" />
                  </button>
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalIsOpen && (
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <DeleteItem
            itemId={itemId as number}
            inventoryId={+inventoryId}
            closeModal={closeModal}
          />
        </Modal>
      )}
    </>
  );
}
