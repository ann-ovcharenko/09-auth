"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchNotes, 
  type NotesResponse 
} from "@/lib/api/clientApi";
export type FetchNotesParams = Record<string, string | number | undefined>;
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import StatusError from "@/components/StatusError/StatusError";
import StatusLoader from "@/components/StatusLoader/StatusLoader";
import css from "./Notes.client.module.css";

interface NotesClientProps {
  slug: string;
}

const SEARCH_DEBOUNCE_DELAY = 300;

export default function NotesClient({ slug }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const currentApiParams: FetchNotesParams = {
    page,
    perPage: 10,
    search: debouncedSearch,
    tag: slug !== "all" ? slug : undefined,
  };

  const { data, isPending, isError, error, isFetching } = useQuery<NotesResponse>({
    queryKey: ["notes", currentApiParams],
    queryFn: () => fetchNotes(currentApiParams),
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) return <StatusError message={error.message} />;

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.container}>
      <header className={css.header}>
        <div className={css.titleBox}>
          <h1 className={css.mainTitle}>Мої нотатки</h1>
          <p className={css.subtitle}>
            Фільтр: <strong>{slug === "all" ? "Всі" : slug}</strong>
          </p>
        </div>
        <Link href="/notes/action/create" className={css.createButton}>
          Створити нотатку +
        </Link>
      </header>

      <div className={css.searchWrapper}>
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSearching={isFetching}
        />
      </div>

      <div className={css.contentWrapper}>
        {isPending && !data ? (
          <StatusLoader message="Завантаження нотаток..." />
        ) : (
          <div className={`${css.notesList} ${isFetching ? css.fetching : ""}`}>
            {notes.length === 0 ? (
              <div className={css.emptyState}>
                <p>Нотаток не знайдено за вашим запитом.</p>
              </div>
            ) : (
              <NoteList notes={notes} />
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className={css.paginationWrapper}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}