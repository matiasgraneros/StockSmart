import { FormEvent, useState } from 'react';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { modifyUserInventoryRelation } from '../../services/inventoriesServices';
import toast from 'react-hot-toast';

export default function AddUserToInventoryForm({
  closeModal,
  inventoryId,
}: {
  closeModal: () => void;
  inventoryId: number;
}) {
  const [enteredUserEmail, setEnteredUserEmail] = useState('');
  const queryClient = useQueryClient();

  function handleUserEmailChange(e: FormEvent<HTMLInputElement>) {
    setEnteredUserEmail(e.currentTarget.value);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      modifyUserInventoryRelation(enteredUserEmail, inventoryId, 'connect'),
    onError: (error: Error) => {
      toast.error(error.message);
      setEnteredUserEmail('');
    },
    onSuccess: (data) => {
      closeModal();
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [`users-inventory-${inventoryId}`],
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
      className="min-h-40 bg-olivine-50 border border-olivine-300 rounded-md px-5 py-6 shadow-sm text-olivine-950 flex flex-col justify-between lg:px-9 dark:bg-olivine-950 dark:border-olivine-700 dark:text-olivine-50"
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">
          Enter the user's email address
        </h3>

        <p className="text-sm mb-5">
          The user must already be registered in StockSmart.
        </p>
        <input
          type="email"
          required
          value={enteredUserEmail}
          onChange={handleUserEmailChange}
          className="h-9 w-full pl-2 bg-olivine-50 border border-olivine-300 rounded text-sm font-medium dark:bg-olivine-950 dark:border-olivine-700"
        />
      </div>
      <div className="w-full flex justify-end gap-3 mt-8">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton disabled={isPending} text="Add user" />
      </div>
    </form>
  );
}
