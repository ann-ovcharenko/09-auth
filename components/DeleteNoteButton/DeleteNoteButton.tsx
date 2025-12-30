"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteNote } from "@/lib/api/clientApi";
import css from "./DeleteNoteButton.module.css";

interface DeleteNoteButtonProps {
  noteId: string;
}

const DeleteNoteButton: React.FC<DeleteNoteButtonProps> = ({ noteId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
      router.refresh();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || (error as Error).message;
      console.error("Помилка при видаленні нотатки:", errorMessage);
      alert(`Помилка: ${errorMessage}. Спробуйте ще раз.`);
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(noteId);
    }
  };

  const isPending = deleteMutation.isPending;

  return (
    <button
      onClick={handleDelete}
      className={css.deleteButton}
      disabled={isPending}
      type="button"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteNoteButton;
