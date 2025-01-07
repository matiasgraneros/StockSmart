import { useMutation, useQueryClient } from '@tanstack/react-query';
import CancelButton from '../../ui/CancelButton';
import ConfirmButton from '../../ui/ConfirmButton';
import { modifyUserInventoryRelation } from '../../services/inventoriesServices';
import toast from 'react-hot-toast';

export default function RemoveUser({
  userEmail,
  inventoryId,
  closeModal,
}: {
  userEmail: string;
  inventoryId: number;
  closeModal: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      modifyUserInventoryRelation(userEmail, inventoryId, 'disconnect'),
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [`users-inventory-${inventoryId}`],
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
    <div className="min-h-40 max-w-[480px] bg-olivine-50 border border-olivine-300 rounded-md px-5 mx-1 py-6 shadow-sm text-olivine-950 flex flex-col justify-between dark:bg-olivine-950 dark:border-olivine-700 dark:text-olivine-50">
      <h1 className="text-lg font-semibold mb-7">
        Are you sure you want to remove the user {userEmail}?
      </h1>
      <div className="flex w-full justify-end gap-2">
        <CancelButton cancelFunction={closeModal} />
        <ConfirmButton
          text="Remove user"
          color="red"
          confirmFunction={() => mutation.mutate()}
        />
      </div>
    </div>
  );
}
