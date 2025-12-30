"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNoteById, deleteNote } from "../../../../lib/api/clientApi";
import { useParams, useRouter } from "next/navigation";
import type { Note } from "../../../../types/note";
import css from "./NoteDetails.module.css";

const NoteDetailsClient: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const noteId = params.id as string;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    refetchOnMount: false,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
      router.refresh();
    },
  });

  const handleDelete = () => {
    if (confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <p className={css.status}>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p className={css.status}>Error loading note or note not found.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <div className={css.meta}>
            <span className={css.tag}>{note.tag}</span>
            <button onClick={() => router.back()} className={css.backBtn}>
              ← Back
            </button>
          </div>
          <h2 className={css.title}>{note.title}</h2>
        </div>

        <p className={css.content}>{note.content}</p>

        <div className={css.footer}>
          <p className={css.date}>
            Created date: {new Date(note.createdAt).toLocaleDateString()}
          </p>
          <button
            onClick={handleDelete}
            className={css.deleteBtn}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
