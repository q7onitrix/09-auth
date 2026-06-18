'use client';
import { getMe, updateMe } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';
import { useId, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/types/note';
import Image from 'next/image';
import { User } from '@/types/user';

export default  function EditProfilePage() {
  const editProfileId = useId();
  const [error, setError] = useState('');
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();
  if(!user) {
    return null;
  }
  const handleEditSubmit = async (formData: FormData) => {
    try {
      const username = formData.get('username') as string;
      const newUser = await updateMe(username);
      if (newUser) {
      setUser(newUser);
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
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} action={handleEditSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor={`${editProfileId}-username`}>Username:</label>
            <input
              id={`${editProfileId}-username`}
              name="username"
              type="text"
              defaultValue={user.username}
              className={css.input}
            />
          </div>
          <p>{`Email: ${user.email}`}</p>
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
            {error && <p>{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
