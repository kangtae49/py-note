import { create } from "zustand"
import type {RefObject} from "react";

export type RepeatType = 'repeat_none' | 'repeat_all' | 'repeat_one'

export interface AudioRefStore {
  audioRef: RefObject<HTMLAudioElement | null> | null
  setAudioRef: (audioRef: RefObject<HTMLAudioElement | null> | null) => void
  volume: number
  duration: number
  currentTime: number
  playbackRate: number
  paused: boolean
  muted: boolean
  autoPlay: boolean
  repeat: RepeatType
  shuffle: boolean
  ended: boolean

  setVolume: (volume: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (currentTime: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
  setPaused: (paused: boolean) => void;
  setMuted: (muted: boolean) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setRepeat: (repeat: RepeatType) => void;
  setShuffle: (shuffle: boolean) => void;
  setEnded: (ended: boolean) => void;

  changeVolume: (volume: number) => void;
  changeCurrentTime: (currentTime: number) => void;
  changePlaybackRate: (playbackRate: number) => void;
  changeMuted: (muted: boolean) => void;

  play: () => Promise<void> | undefined;
  pause: () => void | undefined;
  togglePlay: () => Promise<void>;
  toggleRepeat: () => void;
  toggleShuffle: () => void;

}

export const useAudioRefStore = create<AudioRefStore>((set, get) => ({
  audioRef: null,
  setAudioRef: (audioRef) => set({ audioRef }),
  volume: 1.0,
  duration: 0,
  currentTime: 0,
  playbackRate: 1.0,
  muted: false,
  paused: true,
  autoPlay: false,
  repeat: 'repeat_all',
  shuffle: true,
  ended: false,

  setVolume: (volume) => set({ volume }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setPaused: (paused) => set({ paused }),
  setMuted: (muted) => set({ muted }),
  setAutoPlay: (autoPlay) => set({ autoPlay }),
  setRepeat: (repeat) => set({ repeat }),
  setShuffle: (shuffle) => set({ shuffle }),
  setEnded: (ended) => set({ ended }),

  changeVolume: (volume) => {
    const audio = get().audioRef?.current;
    if (audio) audio.volume = Math.max(0, Math.min(1, volume));
  },
  changeCurrentTime: (currentTime) => {
    const audio = get().audioRef?.current;
    if (audio) audio.currentTime = currentTime;
  },
  changePlaybackRate: (playbackRate) => {
    const audio = get().audioRef?.current;
    if (audio) audio.playbackRate = playbackRate;
  },
  changeMuted: (muted) => {
    const audio = get().audioRef?.current;
    if (audio) audio.muted = muted;
  },

  play: () => get().audioRef?.current?.play(),
  pause: () => get().audioRef?.current?.pause(),
  togglePlay: async () => {
    return get().paused ? await get().play() : get().pause();
  },
  toggleRepeat: () => {
    const repeat = get().repeat;
    if (repeat === 'repeat_all') {
      set({ repeat: 'repeat_one' });
    } else if (repeat === 'repeat_one') {
      set({ repeat: 'repeat_none' });
    } else if (repeat === 'repeat_none') {
      set({ repeat: 'repeat_all' });
    }
  },
  toggleShuffle: () => {
    set({ shuffle: !get().shuffle });
  },


}))