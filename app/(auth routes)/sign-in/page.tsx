'use client';
import { ApiError } from '@/types/note';
import css from './SignInPage.module.css';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

import { login, UserRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
export default function SignInPage() {
  const [error, setError] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const signInId = useId();
  const router = useRouter();

  const handleLoginSubmit = async (formData: FormData) => {
    try {
      const userData: UserRequest = {
        email: String(formData.get('email')),
        password: String(formData.get('password')),
      };
      const user = await login(userData);
      if (user) {
        setUser(user);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      const apiError = error as ApiError;

      setError(
        apiError.response?.data?.message ??
          "Oops... some error"
);
    }
  };
  return (
    <main className={css.mainContent}>
      
      <form className={css.form} action={handleLoginSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor={`${signInId}-email`}>Email</label>
          <input
            id={`${signInId}-email`}
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${signInId}-password`}>Password</label>
          <input
            id={`${signInId}-password`}
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>
        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
