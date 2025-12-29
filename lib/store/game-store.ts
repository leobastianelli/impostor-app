import { create } from 'zustand';
import { GameState } from '@/types/game';
import { Room } from '@/types/room';
import { Player } from '@/types/player';

interface GameStore extends GameState {
  setRoom: (room: Room | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: GameState = {
  room: null,
  currentPlayer: null,
  loading: false,
  error: null,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setRoom: (room) => set({ room }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
