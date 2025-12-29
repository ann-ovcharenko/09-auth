"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes, type NotesResponse } from "@/lib/api/clientApi";
import Link from "next/link";
import { AxiosError } from "axios";
import { Note } from "@/types/note";
import css from "./Notes.module.css";

interface ApiError {
  message: string;
}

export default function NotesPage() {
  const {
    data,
    isLoading,
    error,
  } = useQuery<NotesResponse, AxiosError<ApiError>>({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
  });

  if (isLoading)
    return <div className={css.loader}>Завантаження нотаток...</div>;

  if (error) {
    const errorMessage =
      error.response?.data?.message || "Помилка при завантаженні";
    return <div className={css.error}>{errorMessage}</div>;
  }

  const notes = data?.notes || [];

  return (
    <main className={css.container}>
      <header className={css.header}>
        <h1 className={css.title}>My Notes</h1>
        <Link href="/notes/create" className={css.createButton}>
          + Create New Note
        </Link>
      </header>

      {notes.length === 0 ? (
        <div className={css.emptyState}>
          <p>У вас ще немає нотаток. Створіть першу!</p>
        </div>
      ) : (
        <div className={css.grid}>
          {notes.map((note) => (
            <div key={note.id} className={css.card}>
              <div className={css.cardContent}>
                <span className={css.tag}>{note.tag}</span>
                <h2 className={css.noteTitle}>{note.title}</h2>
                <p className={css.excerpt}>
                  {note.content.substring(0, 100)}...
                </p>
              </div>
              <Link href={`/notes/${note.id}`} className={css.viewLink}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}