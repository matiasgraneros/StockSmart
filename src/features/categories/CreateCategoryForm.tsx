import { FormEvent, useState } from 'react';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../../services/categoriesService';
import toast from 'react-hot-toast';

export default function CreateCategoryForm({
  closeModal,
  inventoryId,
}: {
  closeModal: () => void;
  inventoryId: string;
}) {
  const [enteredCategoryName, setEnteredCategoryName] = useState('');
  const queryClient = useQueryClient();

  function handleChange(e: FormEvent<HTMLInputElement>) {
    setEnteredCategoryName(e.currentTarget.value);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => createCategory(enteredCategoryName, +inventoryId),
    onError: (error: Error) => {
      toast.error(error.message);
      setEnteredCategoryName('');
    },
    onSuccess: (data) => {
      closeModal();
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [`categories-inventory-${inventoryId}`],
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
          Enter the name of the category:
        </h3>

        <input
          type="text"
          required
          minLength={4}
          value={enteredCategoryName}
          onChange={handleChange}
          className="h-9 w-full pl-2 border bg-olivine-50 border-olivine-300 rounded text-sm font-medium shadow-sm dark:bg-olivine-950 dark:border-olivine-700"
        />
      </div>
      <div className="w-full flex justify-end gap-3 mt-8">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton disabled={isPending} text="Create category" />
      </div>
    </form>
  );
}
