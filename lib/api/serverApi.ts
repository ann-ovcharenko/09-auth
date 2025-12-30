import { cookies } from "next/headers";
import { API } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

const getAuthHeaders = async () => {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    return {
      headers: {
        Cookie: cookieString,
      },
    };
  } catch (error) {
    console.error("Error getting auth headers:", error);
    return {};
  }
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await API.get<User>("/auth/session", authHeaders);
    return response.data;
  } catch {
    return null;
  }
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await API.get<User>("/users/me", authHeaders);
    return response.data;
  } catch (error) {
    console.error("Server API Error (getMeServer):", error);
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const authHeaders = await getAuthHeaders();
  const response = await API.get<User>("/users/me", authHeaders);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const authHeaders = await getAuthHeaders();
  const response = await API.get<Note>(`/notes/${id}`, authHeaders);
  return response.data;
};

export interface NotesResponse {
  notes: Note[];
  total: number;
  totalPages: number;
}

export const fetchNotes = async (
  params?: Record<string, string | number | undefined>
): Promise<NotesResponse> => {
  const authHeaders = await getAuthHeaders();
  const response = await API.get<NotesResponse>("/notes", {
    ...authHeaders,
    params,
  });
  return response.data;
};
