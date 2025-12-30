"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { login, type AuthRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignIn.module.css";

export default function SignInPage() {
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
      const user = await login(authData);

      setAuth(user, true);

      router.push("/profile");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Невірний логін або пароль";

      setError(errorMessage);
      console.error("Login error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

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
            autoComplete="current-password"
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log in"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
