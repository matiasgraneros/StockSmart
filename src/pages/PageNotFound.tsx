import { Link } from 'react-router-dom';
import { AppLogo } from '../ui/Icons';

export default function PageNotFound() {
  return (
    <div className="bg-olivine-100 min-h-dvh flex flex-col items-center pt-10 dark:bg-olivine-950">
      <Link to="/">
        <AppLogo className="fill-olivine-600 w-64 lg:w-72 drop-shadow-sm dark:fill-olivine-50" />
      </Link>
      <h1 className="text-olivine-950 text-xl font-medium pt-40 dark:text-olivine-50">
        Page not found :(
      </h1>
    </div>
  );
}
