import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/useAuth';
import { createOperation } from '../services/operationsService';
import { getItems } from '../services/itemsService';
import { getInventories } from '../services/inventoriesServices';

interface Item {
  name: string;
  id: number;
}

interface Inventory {
  name: string;
  id: number;
}

type OperationData = {
  operationType: 'ADD' | 'REMOVE';
  quantity: number;
  inventoryId: number;
  itemId: number;
};

export default function CreateOperation() {
  const { inventoryId } = useParams() as {
    inventoryId: string;
    categoryId: string;
  };

  const queryClient = useQueryClient();
  const { userRole } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const { data: inventories } = useQuery({
    queryKey: ['inventories'],
    queryFn: getInventories,
    retry: false,
  });
  const inventoryName = inventories
    ?.filter((inventory: Inventory) => inventory.id === +inventoryId)
    .at(0)?.name;

  const { data: items } = useQuery({
    queryKey: [`items-inventory-${inventoryId}`],
    queryFn: () => getItems(inventoryId),
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: OperationData) =>
      createOperation(
        data.operationType,
        data.quantity,
        data.inventoryId,
        data.itemId
      ),
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      if (formRef.current) {
        formRef.current.reset();
      }
      queryClient.invalidateQueries({
        queryKey: [`items-inventory-${inventoryId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`all-operations-inventory-${inventoryId}`, 1],
      });
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const operationType = formData.get('operation-type') as 'ADD' | 'REMOVE';
    const itemName = formData.get('item') as string;
    const quantity = formData.get('quantity') as string;

    const itemId = items
      .filter((item: Item) => item.name === itemName)
      .at(0)?.id;

    if (!itemId) {
      toast.error('The item does not exist');
      return;
    }
    if (Number(quantity) < 1) {
      toast.error('Invalid quantity');
      return;
    }

    const operationData: OperationData = {
      operationType,
      quantity: Number(quantity),
      inventoryId: Number(inventoryId),
      itemId,
    };

    mutate(operationData);
  }

  return (
    <>
      {userRole === 'ADMIN' ? (
        <Link
          to={`/dashboard/inventory/${inventoryId}/operations/history/all`}
          className="mt-2 flex gap-1 items-center w-fit text-olivine-600 text-sm font-medium dark:text-olivine-50 hover:text-olivine-700 dark:hover:text-olivine-100"
        >
          <IoMdArrowRoundBack className="text-lg" />
          Operations history
        </Link>
      ) : (
        <h2 className="text-xl mt-2 text-olivine-950 dark:text-olivine-50">
          Inventory:{' '}
          <span className="font-semibold text-olivine-500 dark:text-olivine-300">
            {inventoryName}
          </span>
        </h2>
      )}
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="w-full max-w-[600px] mx-auto mt-20 border rounded-md text-sm px-5 py-6 border-olivine-200 text-olivine-950 dark:text-olivine-50 dark:border-olivine-700"
      >
        <h2 className="text-2xl font-semibold mb-7">Create Operation</h2>
        <div className="flex flex-col mb-5 gap-2">
          <label htmlFor="operation-type" className="font-medium">
            Operation type
          </label>
          <select
            name="operation-type"
            id="operation-type"
            required
            className="rounded-md h-10 pl-3 bg-transparent border border-olivine-200 dark:border-olivine-700 dark:text-olivine-50 [&>option]:text-olivine-950"
          >
            <option value="ADD">Add</option>
            <option value="REMOVE">Remove</option>
          </select>
        </div>
        <div className="flex flex-col mb-5 gap-2">
          <label htmlFor="item" className="font-medium">
            Item
          </label>
          <input
            id="item"
            name="item"
            list="items-list"
            type="text"
            required
            className="rounded-md h-10 pl-3 bg-transparent border border-olivine-200 dark:border-olivine-700"
          />

          <datalist id="items-list">
            {items &&
              items.map((item: Item) => (
                <option key={item.id} value={item.name}></option>
              ))}
          </datalist>
        </div>
        <div className="flex flex-col mb-5 gap-2">
          <label htmlFor="quantity" className="font-medium">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            className="rounded-md h-10 pl-3 bg-transparent border border-olivine-200 dark:border-olivine-700"
          />
        </div>

        <button
          disabled={isPending}
          className="w-full h-10 rounded-md mt-6 font-medium shadow-sm bg-olivine-600 text-olivine-50 hover:bg-olivine-700 dark:bg-olivine-50 dark:text-olivine-950 dark:hover:bg-olivine-100 disabled:bg-gray-400 dark:disabled:bg-gray-400"
        >
          {isPending ? 'Creating...' : 'Create operation'}
        </button>
      </form>
    </>
  );
}
