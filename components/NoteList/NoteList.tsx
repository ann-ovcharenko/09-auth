"use client";

import { AxiosError } from "axios";
import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import { deleteNote } from "../../lib/api/clientApi";
import css from "./NoteList.module.css";

interface ApiErrorData {
  message: string;
}
interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message || "Не вдалося видалити нотатку.";
      alert(errorMessage);
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Ви впевнені, що хочете видалити нотатку "${title}"?`)) {
      deleteNoteMutation.mutate(id);
    }
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <div className={css.cardHeader}>
            <h2 className={css.title}>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>

          <p className={css.content}>
            {note.content.length > 120
              ? `${note.content.substring(0, 120)}...`
              : note.content}
          </p>

          <div className={css.footer}>
            <div className={css.links}>
              <Link href={`/notes/${note.id}`} className={css.detailsLink}>
                View Details
              </Link>
              <Link href={`/notes/edit/${note.id}`} className={css.editLink}>
                Edit
              </Link>
            </div>

            <button
              className={css.button}
              onClick={() => handleDelete(note.id, note.title)}
              disabled={
                deleteNoteMutation.isPending &&
                deleteNoteMutation.variables === note.id
              }
            >
              {deleteNoteMutation.isPending &&
              deleteNoteMutation.variables === note.id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
