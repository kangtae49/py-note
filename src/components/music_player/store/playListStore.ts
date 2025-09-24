import {create} from "zustand/react";
import natsort from "natsort";

interface PlayListStore {
  playList: string[];
  setPlayList: (value: string[]) => void;
  appendPlayList: (value: string[]) => void;
  removePlayList: (value: string[]) => void;
  shufflePlayList: () => string [];
  natsortPlayList: () => string [];

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
  },
  shufflePlayList: () => {
    const arr = [...get().playList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    set({ playList: arr });
    return arr
  },
  natsortPlayList: () => {
    const sorter = natsort();
    const arr = [...get().playList].sort(sorter);
    set({ playList: arr });
    return arr
  }
}));
