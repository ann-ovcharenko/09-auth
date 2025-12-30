"use client";
import { AxiosError } from "axios";
import React, { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api/clientApi";
import { useNoteStore } from "../../lib/store/noteStore";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Work", "Personal", "Ideas", "Health", "Education"];

const NoteForm: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleCancel = () => {
    router.back();
  };

  const mutation = useMutation({
    mutationFn: (values: typeof draft) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.refresh();
      router.back();
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Сталася помилка при створенні нотатки";
      console.error(errorMessage);
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!draft.title.trim() || !draft.content.trim()) {
      return;
    }
    mutation.mutate(draft);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2 className={css.formTitle}>New Note</h2>

      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title || ""}
          onChange={handleChange}
          required
          placeholder="Enter note title..."
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag || tags[0]}
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content || ""}
          onChange={handleChange}
          required
          placeholder="Write your thoughts here..."
        />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
