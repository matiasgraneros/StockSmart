import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getItems } from '../services/itemsService';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';
import { MdOutlineDeleteForever } from 'react-icons/md';
import Modal from '../ui/Modal';

import { useAuth } from '../context/useAuth';
import CreateItemForm from '../features/items/CreateItemForm';
import DeleteItem from '../features/items/DeleteItem';

interface Item {
  id: number;
  name: string;
  quantity: number;
  category: {
    name: string;
  };
}

interface ModalState {
  type: 'createItem' | 'deleteItem';
  id?: number;
}

export default function CategoryItems() {
  const { inventoryId, categoryId } = useParams() as {
    inventoryId: string;
    categoryId: string;
  };
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  function closeModal() {
    setActiveModal(null);
  }
  function openCreateItemModal() {
    setActiveModal({ type: 'createItem' });
  }
  function openDeleteItemModal(itemId: number) {
    setActiveModal({ type: 'deleteItem', id: itemId });
  }

  const {
    data: items,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`items-inventory-${inventoryId}-category-${categoryId}`],
    queryFn: () => getItems(inventoryId, categoryId),
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
    <div className="mt-3">
      <div className="flex justify-between items-center">
        <Link to={`/dashboard/inventory/${inventoryId}/categories`}>
          <IoMdArrowRoundBack className="text-olivine-600 text-2xl dark:text-olivine-50" />
        </Link>
        <button
          onClick={openCreateItemModal}
          className="bg-olivine-600 font-semibold flex px-4 py-2 items-center shadow-sm text-olivine-50 rounded-md text-sm hover:bg-olivine-700 dark:bg-olivine-50 dark:text-olivine-950 dark:hover:bg-olivine-100"
        >
          Create item
        </button>
      </div>

      {items.at(0) && (
        <>
          <h2 className="text-lg font-medium text-olivine-950 mb-6 mt-3 dark:text-olivine-50">
            Items from category:{' '}
            <span className="text-olivine-600 font-semibold dark:text-olivine-300">
              {items.at(0).category.name}
            </span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-fixed text-olivine-950 dark:text-olivine-50 min-w-[550px]">
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
                        <button onClick={() => openDeleteItemModal(item.id)}>
                          <MdOutlineDeleteForever className="text-2xl text-red-800 hover:text-red-600" />
                        </button>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeModal && (
        <Modal isOpen={!!activeModal} onClose={closeModal}>
          {activeModal.type === 'createItem' && (
            <CreateItemForm
              closeModal={closeModal}
              categoryId={categoryId}
              inventoryId={inventoryId}
            />
          )}

          {activeModal.type === 'deleteItem' && (
            <DeleteItem
              itemId={activeModal.id as number}
              categoryId={+categoryId}
              inventoryId={+inventoryId}
              closeModal={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
