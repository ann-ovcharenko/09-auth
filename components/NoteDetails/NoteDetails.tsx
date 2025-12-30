"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/types/note";
import DeleteNoteButton from "../DeleteNoteButton/DeleteNoteButton";
import css from "./NoteDetails.module.css";

interface NoteDetailsProps {
  note: Note;
}

const NoteDetails: React.FC<NoteDetailsProps> = ({ note }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/notes/edit/${note.id}`);
  };

  return (
    <div className={css.container}>
      <header className={css.header}>
        <h2 className={css.title}>{note.title}</h2>
        <div className={css.actions}>
          <button onClick={handleEdit} className={css.editButton} type="button">
            Edit
          </button>

          <DeleteNoteButton noteId={note.id} />
        </div>
      </header>

      <div className={css.metadata}>
        <div className={css.tag}>
          Tag: <span>{note.tag}</span>
        </div>
      </div>

      <p className={css.content}>{note.content}</p>

      <button
        className={css.backButton}
        onClick={() => router.back()}
        type="button"
      >
        ← Back
      </button>
    </div>
  );
};

export default NoteDetails;
