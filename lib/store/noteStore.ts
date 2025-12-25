import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NoteCreationData } from '@/types/note';

interface NoteState {
  draft: NoteCreationData;
  setDraft: (note: Partial<NoteCreationData>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteCreationData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (updatedFields) => 
        set((state) => ({
          draft: { ...state.draft, ...updatedFields }
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage',
    }
  )
);