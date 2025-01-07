import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deleteItem } from '../../services/itemsService';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';

export default function DeleteItem({
  itemId,
  categoryId,
  inventoryId,
  closeModal,
}: {
  itemId: number;
  categoryId?: number;
  inventoryId: number;
  closeModal: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteItem(itemId),
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [`inventory-${inventoryId}`],
      });

      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: [`items-inventory-${inventoryId}-category-${categoryId}`],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [`items-inventory-${inventoryId}`],
        });
      }
    },
    onSettled: () => {
      closeModal();
    },
  });

  return (
    <div className="min-h-40 max-w-[480px] bg-olivine-50 border border-olivine-300 rounded-md px-5 mx-1 py-6 shadow-sm text-olivine-950 flex flex-col justify-between dark:bg-olivine-950 dark:text-olivine-50 dark:border-olivine-700">
      <h1 className="text-lg font-semibold mb-7">
        Are you sure you want to delete this item?
      </h1>
      <div className="flex w-full justify-end gap-2">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton
          text="Delete item"
          color="red"
          confirmFunction={() => mutation.mutate()}
        />
      </div>
    </div>
  );
}
