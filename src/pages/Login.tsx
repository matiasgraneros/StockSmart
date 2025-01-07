import { Link, useNavigate } from 'react-router-dom';
import { AppLogo } from '../ui/Icons';
import { FormEvent, useEffect, useState } from 'react';
import { login } from '../services/authService';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const { login: loginContext, userEmail } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      navigate('/dashboard');
    }
  }, [navigate, userEmail]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => login(enteredEmail, enteredPassword),
    onError: (error: Error) => {
      toast.error(error.message);
      setEnteredEmail('');
      setEnteredPassword('');
    },
    onSuccess: (data) => {
      loginContext(data.data.userEmail, data.data.userRole);
      toast.success(data.message || 'Successful login');
      navigate('/dashboard');
    },
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate();
  }

  function handleEmailChange(event: FormEvent<HTMLInputElement>) {
    setEnteredEmail(event.currentTarget.value);
  }

  function handlePasswordChange(event: FormEvent<HTMLInputElement>) {
    setEnteredPassword(event.currentTarget.value);
  }

  return (
    <div className="min-h-dvh bg-olivine-100 dark:bg-olivine-950">
      <header className="flex justify-center pt-8">
        <Link to="/">
          <AppLogo className="fill-olivine-600 w-64 drop-shadow-sm dark:fill-olivine-50" />
        </Link>
      </header>
      <main className="w-5/6 min-w-96 max-w-[550px] bg-olivine-50 h-96 mx-auto rounded-lg mt-20 md:mt-32 shadow-sm pt-6 border border-olivine-200 px-6 dark:bg-olivine-950 dark:border-olivine-700">
        <h3 className="font-semibold text-olivine-950 text-center text-2xl dark:text-olivine-50">
          Log In
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col mt-10 gap-5">
          <div className="flex flex-col gap-2 text-sm">
            <label
              htmlFor="email"
              className="font-medium text-olivine-950 dark:text-olivine-50"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded-md text-olivine-950 dark:bg-olivine-950 dark:border-olivine-700 dark:text-olivine-50"
              required
              onChange={handleEmailChange}
              value={enteredEmail}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm mt-2">
            <label
              htmlFor="password"
              className="font-medium text-olivine-950 dark:text-olivine-50"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded-md text-olivine-950 dark:bg-olivine-950 dark:border-olivine-700 dark:text-olivine-50"
              required
              minLength={6}
              maxLength={40}
              onChange={handlePasswordChange}
              value={enteredPassword}
            />
          </div>

          <button
            disabled={isPending}
            className="text-olivine-50 text-base font-semibold bg-olivine-600 px-3 rounded-md py-1 h-11 hover:bg-olivine-700 active:bg-olivine-900 hover:drop-shadow-md mt-8 dark:bg-olivine-50 dark:hover:bg-olivine-100 dark:text-olivine-950 disabled:bg-gray-400 dark:disabled:bg-gray-400 disabled:border-gray-400 dark:disabled:border-gray-400"
          >
            Log In
          </button>
        </form>
      </main>
    </div>
  );
}
