import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function Pagination({
  currentPage,
  totalPages,
  handlePageChange,
}: {
  currentPage: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
}) {
  return (
    <div className="mt-5 mb-10 mx-auto flex items-center justify-center text-sm font-medium text-olivine-950 dark:text-olivine-50">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-3 py-1 rounded-md outline-offset-4 flex items-center gap-1 hover:bg-olivine-200 dark:hover:bg-olivine-900 disabled:hover:bg-transparent disabled:opacity-70"
      >
        <IoIosArrowBack />
        <p>Previous</p>
      </button>
      <p className="mx-2 w-24  flex justify-center">
        {currentPage} of {totalPages}
      </p>
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-3 py-1 rounded-md outline-offset-4 flex items-center gap-1 hover:bg-olivine-200 dark:hover:bg-olivine-900 disabled:hover:bg-transparent disabled:opacity-70"
      >
        <p>Next</p>
        <IoIosArrowForward />
      </button>
    </div>
  );
}
