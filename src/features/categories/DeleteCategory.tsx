import { useMutation, useQueryClient } from '@tanstack/react-query';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';
import { deleteCategory } from '../../services/categoriesService';
import toast from 'react-hot-toast';

export default function DeleteCategory({
  categoryId,
  inventoryId,
  closeModal,
}: {
  categoryId: number;
  inventoryId: number;
  closeModal: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteCategory(categoryId),
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [`categories-inventory-${inventoryId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`inventory-${inventoryId}`],
      });
    },
    onSettled: () => {
      closeModal();
    },
  });

  return (
    <div className="min-h-40 max-w-[480px] bg-olivine-50 border border-olivine-300 rounded-md px-5 mx-1 py-6 shadow-sm text-olivine-950 flex flex-col justify-between dark:bg-olivine-950 dark:text-olivine-50 dark:border-olivine-700">
      <h1 className="text-lg font-semibold mb-7">
        Are you sure you want to delete the category?
      </h1>
      <div className="flex w-full justify-end gap-2">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton
          text="Delete category"
          color="red"
          confirmFunction={() => mutation.mutate()}
        />
      </div>
    </div>
  );
}
