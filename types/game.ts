import { Room } from './room';
import { Player } from './player';

export interface Clue {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  submittedAt: number;
  order: number;
}

export interface Vote {
  voterId: string;
  voterName: string;
  targetId: string;
  targetName: string;
  submittedAt: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

export interface GameState {
  room: Room | null;
  currentPlayer: Player | null;
  loading: boolean;
  error: string | null;
}
