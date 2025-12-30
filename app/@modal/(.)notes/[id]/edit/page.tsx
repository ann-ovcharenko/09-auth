import React from "react";
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import Modal from "@/components/Modal/Modal";
import NoteEditForm from "@/components/NoteEditForm/NoteEditForm";

interface EditNoteModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNoteModalPage({
  params,
}: EditNoteModalPageProps) {
  const { id: noteId } = await params;

  if (!noteId) {
    return (
      <Modal>
        <p>Error: Note ID not found.</p>
      </Modal>
    );
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", noteId],
      queryFn: () => fetchNoteById(noteId),
    });
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Modal>
        <NoteEditForm noteId={noteId} />
      </Modal>
    </HydrationBoundary>
  );
}
