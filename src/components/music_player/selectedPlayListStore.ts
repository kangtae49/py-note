import {create} from "zustand/react";

interface SelectedPlayListStore {
  selectedPlayList: string[];
  setSelectedPlayList: (value: string[]) => void;
  appendSelectedPlayList: (value: string[]) => void;
  removeSelectedPlayList: (value: string[]) => void;
}

export const useSelectedPlayListStore = create<SelectedPlayListStore>((set, get) => ({
  selectedPlayList: [],
  setSelectedPlayList: (value) => set({ selectedPlayList: value }),
  appendSelectedPlayList: (value) => {
    const newSelectedPlayList = [...new Set([...get().selectedPlayList, ...value])];
    set({ selectedPlayList: newSelectedPlayList})
  },
  removeSelectedPlayList: (value) => {
    const newSelectedPlayList = get().selectedPlayList.filter(v => !value.includes(v));
    set({ selectedPlayList: newSelectedPlayList})
  }
}));
