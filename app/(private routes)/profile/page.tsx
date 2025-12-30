import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMeServer } from "@/lib/api/serverApi";
import css from "./Profile.module.css";

export const metadata: Metadata = {
  title: "Профіль користувача | NoteHub",
  description: "Перегляд особистої інформації та налаштувань профілю.",
  openGraph: {
    title: "Мій Профіль - NoteHub",
    images: [
      { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
    ],
  },
};

export default async function ProfilePage() {
  const user = await getMeServer();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Не вдалося завантажити дані профілю.</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={
              user.avatar ||
              "https://ac.goit.global/fullstack/react/avatar-default.png"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
