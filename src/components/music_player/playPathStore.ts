import {create} from "zustand/react";

interface PlayPathStore {
  playPath: string | null;
  setPlayPath: (value: string | null) => void;
}

export const usePlayPathStore = create<PlayPathStore>((set) => ({
  playPath: null,
  setPlayPath: (value) => set({ playPath: value }),
}));
