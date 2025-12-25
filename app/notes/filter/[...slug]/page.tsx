import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Metadata } from "next"; 
import { fetchNotes, FetchNotesParams } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NoteFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: NoteFilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const filterSlug = slug?.[0] || "all";
  const filterName = filterSlug === "all" ? "Всі нотатки" : filterSlug;
  const title = `Фільтр: ${filterName} | NoteHub`;
  const description = `Перегляд нотаток у категорії "${filterName}". Керуйте своїми ідеями ефективно.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub-app.vercel.app/notes/filter/${filterSlug}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${filterName}`,
        },
      ],
    },
  };
}

const defaultParams: Omit<FetchNotesParams, "tag"> = {
  page: 1,
  perPage: 10,
  search: "",
};

export default async function NoteFilterPage({ params }: NoteFilterPageProps) {
  const { slug } = await params;

  const filterSlug = slug?.[0] || "all";
  const tagToFetch = filterSlug !== "all" ? filterSlug : undefined;

  const apiParams: FetchNotesParams = {
    ...defaultParams,
    page: 1,
    tag: tagToFetch,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", apiParams],
    queryFn: () => fetchNotes(apiParams),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient slug={filterSlug} />
    </HydrationBoundary>
  );
}