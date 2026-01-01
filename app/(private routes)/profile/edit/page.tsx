"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AxiosError } from "axios";
import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfile.module.css";

interface ApiError {
  message: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const updatedUser = await updateMe({ username });

      setAuth(updatedUser, true);

      router.push("/profile");
      router.refresh();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message || "Не вдалося оновити профіль"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <div className={css.avatarContainer}>
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={80}
            height={80}
            className={css.avatarImage}
            priority
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={css.input}
            required
            placeholder="Введіть нове ім'я"
          />
        </div>

        <div className={css.formGroup}>
          <label>Email (неможливо змінити)</label>
          <input
            type="email"
            value={user?.email || ""}
            className={`${css.input} ${css.disabledInput}`}
            disabled
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={
              isLoading || username === user?.username || !username.trim()
            }
          >
            {isLoading ? "Збереження..." : "Save Changes"}
          </button>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
