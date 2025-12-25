"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote } from "../../lib/api";
import { useNoteStore } from "../../lib/store/noteStore";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  noteId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NoteForm: React.FC<NoteFormProps> = ({ noteId, onSuccess, onCancel }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const mutation = useMutation({
    mutationFn: (values: typeof draft) =>
      noteId ? updateNote(noteId, values) : createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (noteId) queryClient.invalidateQueries({ queryKey: ["note", noteId] });

      clearDraft();
      
      if (onSuccess) onSuccess();
      else handleClose();
    },
    onError: (error) => {
      alert(`Помилка: ${(error as Error).message}`);
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
    mutation.mutate(draft);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Saving..."
            : noteId
            ? "Update note"
            : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;