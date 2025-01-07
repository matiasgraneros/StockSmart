import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { createInventory } from '../../services/inventoriesServices';
import toast from 'react-hot-toast';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';

export default function CreateInventoryForm({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [enteredInventoryName, setEnteredInventoryName] = useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createInventory(enteredInventoryName),
    onError: (error: Error) => {
      toast.error(error.message);
      setEnteredInventoryName('');
    },
    onSuccess: (data) => {
      closeModal();
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate();
  }

  function handleInventoryNameChange(e: FormEvent<HTMLInputElement>) {
    setEnteredInventoryName(e.currentTarget.value);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-40 min-w-96 bg-olivine-50 border border-olivine-300 rounded-md px-5 py-6 shadow-sm text-olivine-950 flex flex-col justify-between lg:px-9 md:w-[450px] dark:bg-olivine-950 dark:border-olivine-700 dark:text-olivine-50"
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold mb-2">
          Enter the name of the inventory:
        </h3>
        <input
          type="text"
          id="inventory-name"
          minLength={5}
          value={enteredInventoryName}
          onChange={handleInventoryNameChange}
          className="h-9 w-full pl-2 bg-olivine-50 border border-olivine-200 rounded text-sm font-medium dark:bg-olivine-950 dark:border-olivine-700"
        />
      </div>
      <div className="w-full flex justify-end gap-3 mt-8">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton disabled={isPending} text="Create" />
      </div>
    </form>
  );
}
