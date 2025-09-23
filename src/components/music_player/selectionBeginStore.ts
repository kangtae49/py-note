import {create} from "zustand/react";

interface SelectionBeginStore {
  selectionBegin: string | null;
  setSelectionBegin: (value: string | null) => void;
}

export const useSelectionBeginStore = create<SelectionBeginStore>((set) => ({
  selectionBegin: null,
  setSelectionBegin: (value) => set({ selectionBegin: value }),
}));
