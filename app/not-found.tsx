import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Сторінку не знайдено | NoteHub",
  description:
    "На жаль, такої сторінки не існує. Можливо, посилання застаріло або було введено невірно.",
  openGraph: {
    title: "404 - Сторінку не знайдено | NoteHub",
    description: "Вибачте, сторінку, яку ви шукаєте, не знайдено.",
    url: "https://notehub-app.vercel.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 - Page Not Found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/notes/filter/all" className={css.link}>
        Go to Homepage
      </Link>
    </main>
  );
}
