import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/useAuth';
import { getCategories } from '../services/categoriesService';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';
import Modal from '../ui/Modal';
import CreateCategoryForm from '../features/categories/CreateCategoryForm';
import DeleteCategory from '../features/categories/DeleteCategory';

interface Category {
  id: number;
  name: string;
  _count: {
    items: number;
  };
}

interface ModalState {
  type: 'createCategory' | 'deleteCategory';
  id?: number;
}

export default function Categories() {
  const { inventoryId } = useParams() as { inventoryId: string };
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  function openCreateCategoryModal() {
    setActiveModal({ type: 'createCategory' });
  }

  function openDeleteCategoryModal(categoryId: number) {
    setActiveModal({ type: 'deleteCategory', id: categoryId });
  }

  function closeModal() {
    setActiveModal(null);
  }

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`categories-inventory-${inventoryId}`],
    queryFn: () => getCategories(inventoryId),
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
      <div className="flex w-full justify-between items-center mb-5 mt-3 text-olivine-950 dark:text-olivine-50">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button
          onClick={openCreateCategoryModal}
          className="bg-olivine-600 font-semibold flex px-4 py-2 items-center shadow-sm text-olivine-50 rounded-md text-sm hover:bg-olivine-700 dark:bg-olivine-50 dark:text-olivine-950 dark:hover:bg-olivine-100"
        >
          Create category
        </button>
      </div>

      <ul className="divide-y divide-olivine-200 dark:divide-olivine-700 text-sm text-olivine-950 dark:text-olivine-50 ">
        {categories.map((category: Category) => (
          <li
            key={category.id}
            className="flex h-10 justify-between items-center px-4 hover:bg-olivine-200 dark:hover:bg-olivine-900"
          >
            <p className="font-semibold truncate">{category.name}</p>
            <div className="flex items-center gap-3">
              <Link
                to={`/dashboard/inventory/${inventoryId}/categories/${category.id}/items`}
                className="flex flex-grow gap-1 text-sm font-semibold text-olivine-700 hover:text-olivine-950 dark:text-olivine-200 dark:hover:text-olivine-50"
              >
                Items
              </Link>
              <span className="flex justify-end">
                <button onClick={() => openDeleteCategoryModal(category.id)}>
                  <MdOutlineDeleteForever className="text-2xl text-red-800 hover:text-red-600" />
                </button>
              </span>
            </div>
          </li>
        ))}
      </ul>

      {activeModal && (
        <Modal isOpen={!!activeModal} onClose={closeModal}>
          {activeModal.type === 'createCategory' && (
            <CreateCategoryForm
              closeModal={closeModal}
              inventoryId={inventoryId}
            />
          )}

          {activeModal.type === 'deleteCategory' && (
            <DeleteCategory
              categoryId={activeModal.id as number}
              inventoryId={Number(inventoryId)}
              closeModal={closeModal}
            />
          )}
        </Modal>
      )}
    </>
  );
}
