import { FormEvent, useState } from 'react';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createItem } from '../../services/itemsService';

export default function CreateCategoryForm({
  closeModal,
  categoryId,
  inventoryId,
}: {
  closeModal: () => void;
  categoryId: string;
  inventoryId: string;
}) {
  const [enteredItemName, setEnteredItemName] = useState('');
  const queryClient = useQueryClient();

  function handleChange(e: FormEvent<HTMLInputElement>) {
    setEnteredItemName(e.currentTarget.value);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => createItem(enteredItemName, +categoryId, +inventoryId),
    onError: (error: Error) => {
      toast.error(error.message);
      setEnteredItemName('');
    },
    onSuccess: (data) => {
      closeModal();
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [`items-inventory-${inventoryId}-category-${categoryId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`inventory-${inventoryId}`],
      });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-40 min-w-96 bg-olivine-50 border border-olivine-300 rounded-md px-5 py-6 shadow-sm text-olivine-950 flex flex-col justify-between lg:px-9 md:w-[450px] dark:bg-olivine-950 dark:text-olivine-50 dark:border-olivine-700"
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold mb-2">
          Enter the name of the item:
        </h3>

        <input
          type="text"
          required
          minLength={1}
          maxLength={30}
          value={enteredItemName}
          onChange={handleChange}
          className="h-9 w-full pl-2 border bg-olivine-50 border-olivine-300 rounded text-sm font-medium shadow-sm dark:bg-olivine-950 dark:border-olivine-700"
        />
      </div>
      <div className="w-full flex justify-end gap-3 mt-8">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton disabled={isPending} text="Create item" />
      </div>
    </form>
  );
}
