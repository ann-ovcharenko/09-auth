"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { register, type AuthRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUp.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const authData: AuthRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const user = await register(authData);

      setAuth(user, true);

      router.push("/profile");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Помилка при реєстрації";
      setError(message);
      console.error("Registration error:", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            autoComplete="email"
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </main>
  );
}
