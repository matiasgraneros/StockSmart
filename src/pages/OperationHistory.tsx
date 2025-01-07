import { Link, NavLink, Outlet, useParams } from 'react-router-dom';

export default function OperationHistory() {
  const { inventoryId } = useParams() as {
    inventoryId: string;
    categoryId: string;
  };

  return (
    <>
      <div className="flex w-full justify-between items-center mb-5 mt-3 text-olivine-950 dark:text-olivine-50">
        <h2 className="text-xl font-semibold">Operation history</h2>
        <Link
          to={`/dashboard/operations/create/${inventoryId}`}
          className="bg-olivine-600 font-semibold flex px-4 py-2 items-center shadow-sm text-olivine-50 rounded-md text-sm hover:bg-olivine-700 dark:bg-olivine-50 dark:text-olivine-950 dark:hover:bg-olivine-100"
        >
          Create operation
        </Link>
      </div>

      <div className="mb-5">
        <menu className="text-olivine-50 text-sm font-medium flex border-b border-olivine-200 dark:border-olivine-700 w-fit">
          <NavLink
            to={`/dashboard/inventory/${inventoryId}/operations/history/all?page=1`}
            className="filter border-b-4 px-2 py-1 border-transparent text-olivine-950 dark:text-olivine-50"
          >
            All Operations
          </NavLink>
          <NavLink
            to={`/dashboard/inventory/${inventoryId}/operations/history/user?page=1`}
            className="filter border-b-4 px-2 py-1 border-transparent text-olivine-950 dark:text-olivine-50"
          >
            By User
          </NavLink>
          <NavLink
            to={`/dashboard/inventory/${inventoryId}/operations/history/category?page=1`}
            className="filter border-b-4 px-2 py-1 border-transparent text-olivine-950 dark:text-olivine-50"
          >
            By Category
          </NavLink>
          <NavLink
            to={`/dashboard/inventory/${inventoryId}/operations/history/item?page=1`}
            className="filter border-b-4 px-2 py-1 border-transparent text-olivine-950 dark:text-olivine-50"
          >
            By Item
          </NavLink>
        </menu>
      </div>

      <Outlet />
    </>
  );
}
