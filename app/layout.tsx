import type { Metadata } from "next";
import { Roboto } from "next/font/google"; 
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { ReactNode } from "react";

const roboto = Roboto({
  weight: ["400", "500", "700"], 
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"], 
  display: "swap",
  variable: "--font-roboto", 
});

export const metadata: Metadata = {
  title: "NoteHub — Ваш інтелектуальний простір для нотаток",
  description: "Зберігайте ідеї, плануйте завдання та структуруйте свої думки з NoteHub. Простий та надійний інструмент для щоденної продуктивності.",
  openGraph: {
    title: "NoteHub — Ваш інтелектуальний простір для нотаток",
    description: "Простий та надійний інструмент для щоденної продуктивності.",
    url: "https://notehub-app.vercel.app", 
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Прев'ю інтерфейсу NoteHub",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body style={{ fontFamily: 'var(--font-roboto), sans-serif' }}>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          {modal}
        </TanStackProvider>
      </body>
    </html>
  );
}