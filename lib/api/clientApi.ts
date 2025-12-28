import { API } from "./api";
import { User } from "@/types/user";
import { Note, NoteCreationData } from "@/types/note";

interface AuthRequest {
  email: string;
  password: string;
}

export type NoteRequest = NoteCreationData;

export const register = async (data: AuthRequest): Promise<User> => {
  const response = await API.post<{ user: User }>("/auth/register", data);
  return response.data.user;
};

export const login = async (data: AuthRequest): Promise<User> => {
  const response = await API.post<{ user: User }>("/auth/login", data);
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await API.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await API.get<User>("/auth/session");
    return response.data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await API.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const response = await API.patch<User>("/users/me", data);
  return response.data;
};

export interface NotesResponse {
  notes: Note[];
  total: number;
  totalPages: number;
}

export const fetchNotes = async (params?: Record<string, string | number | undefined>): Promise<NotesResponse> => {
  const response = await API.get<NotesResponse>("/notes", { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await API.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (data: NoteRequest): Promise<Note> => {
  const response = await API.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete<{ message: string }>(`/notes/${id}`);
  return response.data;
};