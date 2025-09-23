import {create} from "zustand/react";

interface PlayListStore {
  playList: string[];
  setPlayList: (value: string[]) => void;
  appendPlayList: (value: string[]) => void;
  removePlayList: (value: string[]) => void;
}

export const usePlayListStore = create<PlayListStore>((set, get) => ({
  playList: [],
  setPlayList: (value) => set({ playList: value }),
  appendPlayList: (value) => {
    const newPlayList = [...new Set([...get().playList, ...value])];
    set({ playList: newPlayList})
  },
  removePlayList: (value) => {
    const newPlayList = get().playList.filter(v => !value.includes(v));
    set({ playList: newPlayList})
  }
}));
