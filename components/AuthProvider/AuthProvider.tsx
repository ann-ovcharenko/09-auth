"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const sessionActive = await checkSession();

        if (sessionActive) {
          const userData = await getMe();
          setAuth(userData, true);
        } else {
          logout();

          const isProtectedRoute =
            pathname.startsWith("/notes") || pathname.startsWith("/profile");

          if (isProtectedRoute) {
            router.push("/sign-in");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setAuth, logout, pathname, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <p>Завантаження профілю...</p>
      </div>
    );
  }

  return <>{children}</>;
}
