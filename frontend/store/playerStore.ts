import { create } from 'zustand';

interface TrackMeta {
  title: string;
  artist: string;
  coverUrl: string;
}

interface PlayerState {
  isVisible: boolean;
  isPlaying: boolean;
  volume: number;
  meta: TrackMeta | null;
  show: () => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMeta: (meta: TrackMeta) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isVisible: false,
  isPlaying: false,
  volume: 1,
  meta: null,
  show: () => set({ isVisible: true, isPlaying: true }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setMeta: (meta) => set({ meta }),
}));
