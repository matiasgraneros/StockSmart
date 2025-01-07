import { useEffect, useRef } from 'react';

export default function Details({
  detailsIsOpen,
  setDetailsIsOpen,
  users,
  categories,
  items,
  operations,
  createdAt,
}: {
  detailsIsOpen: boolean;
  setDetailsIsOpen: (b: boolean) => void;
  users: number;
  categories: number;
  items: number;
  operations: number;
  createdAt: string;
}) {
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        detailsRef.current &&
        event.target instanceof Node &&
        !detailsRef.current.contains(event.target)
      ) {
        setDetailsIsOpen(false);
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDetailsIsOpen(false);
      }
    }

    if (detailsIsOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [detailsIsOpen, setDetailsIsOpen]);

  return (
    <div
      ref={detailsRef}
      className="text-olivine-950 font-medium bg-olivine-50 absolute right-0 top-9 border border-olivine-200 shadow-md rounded-md p-3 dark:text-olivine-50 dark:bg-olivine-900 dark:border-olivine-700"
    >
      <p className="py-1">
        Users:{' '}
        <span className="text-olivine-500 dark:text-olivine-300">{users}</span>
      </p>
      <p className="py-1">
        Categories:{' '}
        <span className="text-olivine-500 dark:text-olivine-300">
          {categories}
        </span>
      </p>
      <p className="py-1">
        Items:{' '}
        <span className="text-olivine-500 dark:text-olivine-300">{items}</span>
      </p>
      <p className="py-1">
        Operations:{' '}
        <span className="text-olivine-500 dark:text-olivine-300">
          {operations}
        </span>
      </p>
      <p className="py-1">
        Created at:{' '}
        <span className="text-olivine-500 dark:text-olivine-300">
          {createdAt}
        </span>
      </p>
    </div>
  );
}
