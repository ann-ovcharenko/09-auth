"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, logout, user: authUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else {
          logout();
          
          if (pathname.startsWith("/notes") || pathname.startsWith("/profile")) {
            router.push("/sign-in");
          }
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser, logout, pathname, router]);

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
        <p>Завантаження сесії...</p>
      </div>
    );
  }

  return <>{children}</>;
}