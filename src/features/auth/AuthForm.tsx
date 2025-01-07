import { Link } from 'react-router-dom';
import { AppLogo } from '../../ui/Icons';

interface Props {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: Props) {
  const text = mode === 'login' ? 'Log In' : 'Sign Up';

  return (
    <div className="min-h-dvh bg-olivine-100">
      <header className="flex justify-center pt-8">
        <Link to="/">
          <AppLogo className="fill-olivine-600 w-64 drop-shadow-lg" />
        </Link>
      </header>
      <main className="w-5/6 max-w-[550px]  bg-olivine-50 h-96 mx-auto rounded-lg mt-24 shadow-sm pt-6 border border-olivine-200 px-6">
        <h3 className="font-semibold text-olivine-950 text-center text-2xl">
          {text}
        </h3>
        <form className="flex flex-col mt-10 gap-5" action="">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-olivine-950">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="password" className="text-olivine-950">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded"
              required
            />
          </div>

          <button
            className="text-olivine-50 text-base font-semibold bg-olivine-600 px-3 rounded-full py-1 h-11 hover:bg-olivine-800 active:bg-olivine-900 hover:drop-shadow-md mt-8"
            type="button"
          >
            {text}
          </button>
        </form>
      </main>
    </div>
  );
}
