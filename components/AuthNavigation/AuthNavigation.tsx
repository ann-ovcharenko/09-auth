"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout as apiLogout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export const AuthNavigation = () => {
  const { user, logout: clearStore } = useAuthStore();
  const router = useRouter();
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      await apiLogout();
      clearStore();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <div className={css.userInfoWrapper}>
              <p className={css.userEmail}>{user?.email}</p>
              <button className={css.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
};