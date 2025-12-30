import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setAuth: (user, isAuthenticated) => set({ user, isAuthenticated }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
