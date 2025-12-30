import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { fetchNoteById } from "../../../../lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description =
      note.content.length > 160
        ? `${note.content.substring(0, 157)}...`
        : note.content;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note not found | NoteHub",
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
