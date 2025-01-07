import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLogo } from '../ui/Icons';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../services/authService';
import toast from 'react-hot-toast';

export default function Signup() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredRole, setEnteredRole] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: () => signup(enteredEmail, enteredPassword, enteredRole),
    onError: (error: Error) => {
      toast.error(error.message);
      setEnteredEmail('');
      setEnteredPassword('');
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
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

  function handleRoleChange(event: FormEvent<HTMLSelectElement>) {
    setEnteredRole(event.currentTarget.value as 'ADMIN' | 'EMPLOYEE');
  }

  return (
    <div className="min-h-dvh bg-olivine-100">
      <header className="flex justify-center pt-8">
        <Link to="/">
          <AppLogo className="fill-olivine-600 w-64 drop-shadow-sm" />
        </Link>
      </header>
      <main className="w-5/6 max-w-[550px]  bg-olivine-50 h-[460px] mx-auto rounded-lg mt-24 shadow-sm pt-6 border border-olivine-200 px-6">
        <h3 className="font-semibold text-olivine-950 text-center text-2xl">
          Sign Up
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-10 gap-5"
          action=""
        >
          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="email" className="font-medium text-olivine-950">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded-md"
              required
              onChange={handleEmailChange}
              value={enteredEmail}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="password" className="font-medium text-olivine-950">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded-md"
              required
              minLength={6}
              maxLength={40}
              onChange={handlePasswordChange}
              value={enteredPassword}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="role" className="font-medium text-olivine-950">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="h-9 pl-2 bg-olivine-50 border border-olivine-200 rounded-md"
              onChange={handleRoleChange}
              value={enteredRole}
            >
              <option className="focus:bg-red-400" value="ADMIN">
                Admin
              </option>
              <option className="focus:bg-red-400" value="EMPLOYEE">
                Employee
              </option>
            </select>
          </div>

          <button
            disabled={isPending}
            className="text-olivine-50 text-base font-semibold bg-olivine-600 px-3 rounded-md py-1 h-11 hover:bg-olivine-700 active:bg-olivine-900 hover:drop-shadow-md mt-8 disabled:bg-gray-400"
          >
            Sign Up
          </button>
        </form>
      </main>
    </div>
  );
}
