import { create } from "zustand"
import type {RefObject} from "react";

export interface AudioRefStore {
  audioRef: RefObject<HTMLAudioElement | null> | null
  setAudioRef: (audioRef: RefObject<HTMLAudioElement | null> | null) => void
}

export const useAudioRefStore = create<AudioRefStore>((set) => ({
  audioRef: null,
  setAudioRef: (audioRef) => set({ audioRef }),
}))