"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createNote } from "@/lib/api/clientApi";
import css from "./CreateNote.module.css";

interface ApiError {
  message: string;
}

const TAGS = ["Work", "Personal", "Ideas", "Health", "Education"];

export default function CreateNotePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },

    onError: (err: AxiosError<ApiError>) => {
      setError(err.response?.data?.message || "Помилка при створенні нотатки");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };

    mutation.mutate(data);
  };

  return (
    <main className={css.container}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.title}>New Note</h1>

        <div className={css.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={css.input}
            placeholder="Назва вашої нотатки"
          />
        </div>

        <div className={css.field}>
          <label htmlFor="tag">Tag</label>
          <select id="tag" name="tag" className={css.select} required>
            <option value="" disabled selected>
              Виберіть категорію
            </option>
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className={css.field}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            required
            className={css.textarea}
            rows={6}
            placeholder="Про що ви думаєте?"
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Create Note"}
          </button>
          <button
            type="button"
            className={css.cancelBtn}
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
