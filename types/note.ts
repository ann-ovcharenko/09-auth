export type NoteTag =
  | "Work"
  | "Personal"
  | "Ideas"
  | "Health"
  | "Education"
  | string;

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type NoteCreationData = Omit<Note, "id" | "createdAt" | "updatedAt">;

export type NoteUpdateData = Partial<NoteCreationData>;
