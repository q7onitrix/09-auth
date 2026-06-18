"use client";
import { useId, useState } from "react";
import css from "./SignUpPage.module.css";
import { useRouter } from "next/navigation";
import { register, UserRequest } from "@/lib/api/clientApi";
import { ApiError } from "@/types/note";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const signUpId = useId();
  const router = useRouter();
  const handleRegisterSubmit = async (formData: FormData) => {
    try {
      const userData: UserRequest = {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      };
      const user = await register(userData);
      if (user) {
        setUser(user);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      const apiError = error as ApiError;

      setError(apiError.response?.data?.message ?? "Oops... some error");
    }
  };
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleRegisterSubmit}>
        <div className={css.formGroup}>
          <label htmlFor={`${signUpId}-email`}>Email</label>
          <input
            id={`${signUpId}-email`}
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor={`${signUpId}-password`}>Password</label>
          <input
            id={`${signUpId}-password`}
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>
        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
